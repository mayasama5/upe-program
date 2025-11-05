const express = require('express');
const prisma = require('../config/prisma');
const { Prisma } = require('@prisma/client');
const { authenticateJWT, requireRole } = require('../middleware/jwtAuth');

const router = express.Router();

/**
 * GET /api/reports/applications-stats
 * Get statistics about job applications
 * Only accessible by admin users
 */
router.get('/applications-stats', authenticateJWT, requireRole(['admin']), async (req, res) => {
  try {
    console.log('📊 Fetching applications stats...');
    const { startDate, endDate } = req.query;
    console.log('📅 Date range:', { startDate, endDate });

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const whereClause = Object.keys(dateFilter).length > 0
      ? { created_at: dateFilter }
      : {};

    console.log('🔍 Where clause:', whereClause);

    // Get applications grouped by status
    console.log('1️⃣ Getting applications by status...');
    const applicationsByStatus = await prisma.jobApplication.groupBy({
      by: ['status'],
      where: whereClause,
      _count: {
        id: true
      }
    }).catch(err => {
      console.error('❌ Error in groupBy:', err);
      throw err;
    });
    console.log('✅ Applications by status:', applicationsByStatus);

    // Get total applications
    console.log('2️⃣ Getting total applications...');
    const totalApplications = await prisma.jobApplication.count({
      where: whereClause
    }).catch(err => {
      console.error('❌ Error in count:', err);
      throw err;
    });
    console.log('✅ Total applications:', totalApplications);

    // Get applications by month (last 12 months)
    console.log('3️⃣ Getting applications by month...');
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const applicationsByMonthRaw = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', created_at) as month,
        status,
        COUNT(*) as count
      FROM job_applications
      WHERE created_at >= ${twelveMonthsAgo}
      ${startDate ? Prisma.sql`AND created_at >= ${new Date(startDate)}` : Prisma.empty}
      ${endDate ? Prisma.sql`AND created_at <= ${new Date(endDate)}` : Prisma.empty}
      GROUP BY DATE_TRUNC('month', created_at), status
      ORDER BY month DESC
    `;

    // Convert BigInt to Number
    const applicationsByMonth = applicationsByMonthRaw.map(row => ({
      ...row,
      count: Number(row.count)
    }));
    console.log('✅ Applications by month:', applicationsByMonth);

    // Get top jobs with most applications
    console.log('4️⃣ Getting top jobs...');
    const topJobs = await prisma.jobApplication.groupBy({
      by: ['job_vacancy_id'],
      where: whereClause,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    });

    // Get job details for top jobs
    const topJobsWithDetails = await Promise.all(
      topJobs.map(async (job) => {
        const jobDetails = await prisma.jobVacancy.findUnique({
          where: { id: job.job_vacancy_id },
          select: {
            id: true,
            title: true,
            company: true,
            job_type: true,
            modality: true
          }
        });
        return {
          ...jobDetails,
          applicationsCount: job._count.id
        };
      })
    );

    console.log('5️⃣ Processing stats...');

    // Calculate conversion rates
    const stats = {
      nuevo: 0,
      en_revision: 0,
      entrevista: 0,
      oferta: 0,
      contratado: 0,
      rechazado: 0
    };

    applicationsByStatus.forEach(item => {
      stats[item.status] = item._count.id;
    });

    console.log('✅ Stats processed:', stats);

    const conversionRates = {
      interviewRate: totalApplications > 0
        ? ((stats.entrevista / totalApplications) * 100).toFixed(2)
        : 0,
      offerRate: totalApplications > 0
        ? ((stats.oferta / totalApplications) * 100).toFixed(2)
        : 0,
      rejectionRate: totalApplications > 0
        ? ((stats.rechazado / totalApplications) * 100).toFixed(2)
        : 0
    };

    res.json({
      success: true,
      data: {
        summary: {
          total: totalApplications,
          nuevo: stats.nuevo,
          en_revision: stats.en_revision,
          entrevista: stats.entrevista,
          oferta: stats.oferta,
          contratado: stats.contratado,
          rechazado: stats.rechazado,
          conversionRates
        },
        byMonth: applicationsByMonth,
        topJobs: topJobsWithDetails,
        generatedAt: new Date().toISOString()
      }
    });

    console.log('✅ Response ready to send');

  } catch (error) {
    console.error('❌ Error fetching application stats:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error name:', error.name);
    console.error('❌ Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Error al obtener estadísticas de aplicaciones',
      details: error.message,
      errorName: error.name
    });
  }
});

/**
 * GET /api/reports/users-stats
 * Get statistics about users
 * Only accessible by admin users
 */
router.get('/users-stats', authenticateJWT, requireRole(['admin']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const whereClause = Object.keys(dateFilter).length > 0
      ? { created_at: dateFilter }
      : {};

    // Count users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      where: whereClause,
      _count: {
        id: true
      }
    });

    // Total users
    const totalUsers = await prisma.user.count({ where: whereClause });

    // Verified users
    const verifiedUsers = await prisma.user.count({
      where: { ...whereClause, is_verified: true }
    });

    // Users registered per month
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const usersByMonthRaw = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', created_at) as month,
        role,
        COUNT(*) as count
      FROM users
      WHERE created_at >= ${twelveMonthsAgo}
      ${startDate ? Prisma.sql`AND created_at >= ${new Date(startDate)}` : Prisma.empty}
      ${endDate ? Prisma.sql`AND created_at <= ${new Date(endDate)}` : Prisma.empty}
      GROUP BY DATE_TRUNC('month', created_at), role
      ORDER BY month DESC
    `;

    // Convert BigInt to Number
    const usersByMonth = usersByMonthRaw.map(row => ({
      ...row,
      count: Number(row.count)
    }));

    res.json({
      success: true,
      data: {
        summary: {
          total: totalUsers,
          verified: verifiedUsers,
          byRole: usersByRole.reduce((acc, item) => {
            acc[item.role] = item._count.id;
            return acc;
          }, {})
        },
        byMonth: usersByMonth,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Error al obtener estadísticas de usuarios'
    });
  }
});

/**
 * GET /api/reports/jobs-stats
 * Get statistics about job vacancies
 * Only accessible by admin users
 */
router.get('/jobs-stats', authenticateJWT, requireRole(['admin']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const whereClause = Object.keys(dateFilter).length > 0
      ? { created_at: dateFilter }
      : {};

    // Total jobs
    const totalJobs = await prisma.jobVacancy.count({ where: whereClause });

    // Active jobs
    const activeJobs = await prisma.jobVacancy.count({
      where: { ...whereClause, is_active: true }
    });

    // Jobs by type
    const jobsByType = await prisma.jobVacancy.groupBy({
      by: ['job_type'],
      where: whereClause,
      _count: { id: true }
    });

    // Jobs by modality
    const jobsByModality = await prisma.jobVacancy.groupBy({
      by: ['modality'],
      where: whereClause,
      _count: { id: true }
    });

    res.json({
      success: true,
      data: {
        summary: {
          total: totalJobs,
          active: activeJobs,
          byType: jobsByType.reduce((acc, item) => {
            acc[item.job_type] = item._count.id;
            return acc;
          }, {}),
          byModality: jobsByModality.reduce((acc, item) => {
            acc[item.modality] = item._count.id;
            return acc;
          }, {})
        },
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Error al obtener estadísticas de empleos'
    });
  }
});

/**
 * GET /api/reports/export/applications
 * Export applications report as CSV
 * Only accessible by admin users
 */
router.get('/export/applications', authenticateJWT, requireRole(['admin']), async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const whereClause = Object.keys(dateFilter).length > 0
      ? { created_at: dateFilter }
      : {};

    // Get all applications with related data
    const applications = await prisma.jobApplication.findMany({
      where: whereClause,
      include: {
        job_vacancy: {
          select: {
            title: true,
            company: true,
            job_type: true,
            modality: true
          }
        },
        applicant: {
          select: {
            name: true,
            email: true,
            career: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'ID',
        'Fecha',
        'Estado',
        'Puesto',
        'Empresa',
        'Tipo',
        'Modalidad',
        'Candidato',
        'Email',
        'Carrera'
      ].join(',');

      const csvRows = applications.map(app => [
        app.id,
        new Date(app.created_at).toLocaleDateString('es-ES'),
        app.status,
        `"${app.job_vacancy.title}"`,
        `"${app.job_vacancy.company}"`,
        app.job_vacancy.job_type,
        app.job_vacancy.modality,
        `"${app.applicant.name}"`,
        app.applicant.email,
        `"${app.applicant.career || 'N/A'}"`
      ].join(','));

      const csv = [csvHeaders, ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-aplicaciones-${new Date().toISOString().split('T')[0]}.csv`);
      res.send('\uFEFF' + csv); // Add BOM for Excel UTF-8 support

    } else if (format === 'json') {
      res.json({
        success: true,
        data: applications,
        exportedAt: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Formato no soportado. Use csv o json'
      });
    }

  } catch (error) {
    console.error('Error exporting applications:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Error al exportar reporte'
    });
  }
});

module.exports = router;
