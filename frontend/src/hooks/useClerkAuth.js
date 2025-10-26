import { useUser, useClerk } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' :
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');

export const useClerkAuth = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        // Sync with backend to get/create user in our database
        syncUserWithBackend();
      } else {
        setUser(null);
        setLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const syncUserWithBackend = async () => {
    try {
      if (!clerkUser) {
        setLoading(false);
        return;
      }

      // Send to backend to sync user using cookie-based session (withCredentials)
      // Some Clerk setups use cookies instead of exposing a token to the client.
      console.log('Syncing user with backend (cookie-based)...');
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true
      });

      console.log('User synced successfully:', response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
      // If backend sync fails but Clerk is signed in, create a temporary user object
      if (clerkUser) {
        setUser({
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          name: clerkUser.fullName || clerkUser.username,
          picture: clerkUser.imageUrl,
          role: clerkUser.publicMetadata?.role || null,
          is_verified: clerkUser.primaryEmailAddress?.verification?.status === 'verified'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const startGoogleAuth = (mode = null) => {
    // Store intended role if provided
    if (mode === 'estudiante') {
      sessionStorage.setItem('intended_role', 'estudiante');
      window.location.href = '/registro-estudiante';
    } else if (mode === 'empresa') {
      sessionStorage.setItem('intended_role', 'empresa');
      window.location.href = '/registro-empresa';
    } else {
      // Default login without role
      window.location.href = '/login';
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      sessionStorage.removeItem('intended_role');
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive"
      });
    }
  };

  const setRole = async (role) => {
    try {
      if (!clerkUser) {
        throw new Error('No user found');
      }

      const token = await getToken();

      if (!token) {
        throw new Error('Could not get authentication token');
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/auth/set-role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      setUser(response.data.user);
      sessionStorage.removeItem('intended_role');

      toast({
        title: "Rol actualizado",
        description: `Tu cuenta ahora es de tipo ${role}`,
      });
    } catch (error) {
      console.error('Failed to set role:', error);
      toast({
        title: "Error",
        description: "Error al configurar el rol",
        variant: "destructive"
      });
    }
  };

  return {
    user,
    loading,
    startGoogleAuth,
    logout,
    setUser,
    setRole,
    isSignedIn
  };
};
