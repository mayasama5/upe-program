const { clerkClient } = require('@clerk/clerk-sdk-node');
const { verifyToken } = require('@clerk/backend');
const prisma = require('../config/prisma');

// Get current user from Clerk session
const getCurrentUser = async (req, res, next) => {
  try {
    console.log('🔐 getCurrentUser middleware called for:', req.method, req.path);
    // Get session token from cookie or Authorization header
    let sessionToken = req.cookies.__session;

    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        sessionToken = authHeader.split(' ')[1];
      }
    }

    if (!sessionToken) {
      console.log('⚠️ No session token found');
      req.user = null;
      return next();
    }

    console.log('✅ Session token found, verifying...');
    // Verify JWT token (networkless verification - recommended by Clerk)
    const payload = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    console.log('✅ Token verified, payload sub:', payload?.sub);

    if (!payload || !payload.sub) {
      req.user = null;
      return next();
    }

    // Get Clerk user ID from token payload
    const clerkUserId = payload.sub;

    // Get full Clerk user data
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    if (!clerkUser) {
      req.user = null;
      return next();
    }

    // Find or create user in Supabase (via Prisma)
    let user = await prisma.user.findUnique({
      where: { id: clerkUser.id }
    });

    if (!user) {
      // Derive email and name from Clerk
      const email = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;
      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email;
      const role = clerkUser.publicMetadata?.role || 'estudiante';

      // First, try to find an existing user by email to avoid unique-constraint errors
      if (email) {
        const existingByEmail = await prisma.user.findUnique({ where: { email } });
        if (existingByEmail) {
          // Use the existing record (do not attempt to change its primary id)
          user = existingByEmail;
        }
      }

      if (!user) {
        // No existing user, safe to create with Clerk id. Wrap in try/catch to handle rare race where email exists.
        try {
          user = await prisma.user.create({
            data: {
              id: clerkUser.id,
              email: email,
              name: name,
              picture: clerkUser.imageUrl || null,
              role: role,
              is_verified: clerkUser.emailAddresses.some(e => e.verification?.status === 'verified'),
              created_at: new Date(clerkUser.createdAt)
            }
          });
        } catch (err) {
          // If unique constraint on email occurs, fallback to existing user by email
          if (err && err.code === 'P2002') {
            console.warn('User create conflict (P2002), falling back to find by email');
            user = await prisma.user.findUnique({ where: { email } });
          } else {
            throw err;
          }
        }
      }
    }

    // Sincroniza el rol si Clerk tiene un valor diferente
    if (user && clerkUser.publicMetadata?.role && user.role !== clerkUser.publicMetadata.role) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: clerkUser.publicMetadata.role }
      });
      user.role = clerkUser.publicMetadata.role;
    }
    req.user = user;
    req.clerkUser = clerkUser;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.status
    });
    req.user = null;
    next();
  }
};

// Require authentication
const requireAuth = async (req, res, next) => {
  await getCurrentUser(req, res, () => {});

  // Development mode: DISABLED - Uncomment to enable development user
  // if (process.env.NODE_ENV === 'development' && !req.user) {
  //   // Create a mock development user
  //   // Ensure the dev user exists in the database so foreign key constraints won't fail
  //   try {
  //     let devUser = await prisma.user.findUnique({ where: { id: 'dev-user-1' } });
  //     if (!devUser) {
  //       devUser = await prisma.user.create({
  //         data: {
  //           id: 'dev-user-1',
  //           email: 'developer@test.com',
  //           name: 'Usuario de Desarrollo',
  //           role: 'estudiante',
  //           is_verified: true,
  //           github_url: '',
  //           linkedin_url: '',
  //           portfolio_url: '',
  //           skills: [],
  //           bio: '',
  //           company_name: '',
  //           company_document: '',
  //           created_at: new Date(),
  //           updated_at: new Date()
  //         }
  //       });
  //     }
  //     req.user = devUser;
  //     return next();
  //   } catch (err) {
  //     console.error('Error ensuring dev user in DB:', err);
  //     // Fallback to an in-memory mock user if DB operation fails
  //     req.user = {
  //       id: 'dev-user-1',
  //       email: 'developer@test.com',
  //       name: 'Usuario de Desarrollo',
  //       role: 'estudiante',
  //       is_verified: true,
  //       github_url: '',
  //       linkedin_url: '',
  //       portfolio_url: '',
  //       skills: [],
  //       bio: '',
  //       company_name: '',
  //       company_document: '',
  //       created_at: new Date(),
  //       updated_at: new Date()
  //     };
  //     return next();
  //   }
  // }

  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'You must be logged in to access this resource'
    });
  }

  next();
};

// Require company role
const requireCompany = async (req, res, next) => {
  await requireAuth(req, res, () => {});

  if (res.headersSent) return; // If requireAuth already sent a response

  if (req.user.role !== 'empresa') {
    return res.status(403).json({
      error: 'Company account required',
      message: 'This resource is only available to company accounts'
    });
  }

  next();
};

// Require student role
const requireStudent = async (req, res, next) => {
  await requireAuth(req, res, () => {});

  if (res.headersSent) return; // If requireAuth already sent a response

  if (req.user.role !== 'estudiante') {
    return res.status(403).json({
      error: 'Student account required',
      message: 'This resource is only available to student accounts'
    });
  }

  next();
};

// Optional authentication (sets user if available, but doesn't require it)
const optionalAuth = async (req, res, next) => {
  await getCurrentUser(req, res, next);
};

// Require admin role
const requireAdmin = async (req, res, next) => {
  await requireAuth(req, res, () => {});

  if (res.headersSent) return; // If requireAuth already sent a response

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin account required',
      message: 'This resource is only available to admin accounts'
    });
  }

  next();
};

module.exports = {
  getCurrentUser,
  requireAuth,
  requireCompany,
  requireStudent,
  requireAdmin,
  optionalAuth
};
