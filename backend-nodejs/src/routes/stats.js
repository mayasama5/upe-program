const express = require('express');
const prisma = require('../config/prisma');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get platform statistics
router.get('/', optionalAuth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Run all queries in parallel for better performance
    const [
      totalUsers,
      totalStudents,
      totalCompanies,
      totalCourses,
      totalEvents,
      totalJobs,
      totalApplications,
      activeJobs,
      upcomingEvents,
      newUsersLast30Days,
      newJobsLast30Days,
      newApplicationsLast30Days,
      jobTypeStats,
      modalityStats,
      applicationStatusStats
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'estudiante' } }),
      prisma.user.count({ where: { role: 'empresa' } }),
      prisma.course.count(),
      prisma.event.count(),
      prisma.jobVacancy.count(),
      prisma.jobApplication.count(),
      prisma.jobVacancy.count({ where: { is_active: true } }),
      prisma.event.count({ where: { event_date: { gte: new Date() } } }),
      prisma.user.count({ where: { created_at: { gte: thirtyDaysAgo } } }),
      prisma.jobVacancy.count({ where: { created_at: { gte: thirtyDaysAgo } } }),
      prisma.jobApplication.count({ where: { created_at: { gte: thirtyDaysAgo } } }),
      prisma.jobVacancy.groupBy({
        by: ['job_type'],
        where: { is_active: true },
        _count: true
      }),
      prisma.jobVacancy.groupBy({
        by: ['modality'],
        where: { is_active: true },
        _count: true
      }),
      prisma.jobApplication.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    // Get top skills from active jobs (this requires custom logic since we can't unwind arrays directly in Prisma)
    const activeJobsWithRequirements = await prisma.jobVacancy.findMany({
      where: { is_active: true },
      select: { requirements: true }
    });

    const skillsMap = {};
    activeJobsWithRequirements.forEach(job => {
      job.requirements.forEach(skill => {
        skillsMap[skill] = (skillsMap[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillsMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      overview: {
        total_users: totalUsers,
        total_students: totalStudents,
        total_companies: totalCompanies,
        total_courses: totalCourses,
        total_events: totalEvents,
        total_jobs: totalJobs,
        active_jobs: activeJobs,
        upcoming_events: upcomingEvents,
        total_applications: totalApplications
      },
      recent_activity: {
        new_users_last_30_days: newUsersLast30Days,
        new_jobs_last_30_days: newJobsLast30Days,
        new_applications_last_30_days: newApplicationsLast30Days
      },
      distributions: {
        job_types: jobTypeStats.map(item => ({
          type: item.job_type,
          count: item._count
        })),
        modalities: modalityStats.map(item => ({
          modality: item.modality,
          count: item._count
        })),
        application_status: applicationStatusStats.map(item => ({
          status: item.status,
          count: item._count
        }))
      },
      insights: {
        top_skills: topSkills
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching statistics'
    });
  }
});

// Get user-specific statistics (if authenticated)
router.get('/personal', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to view personal statistics'
      });
    }

    let stats = {};

    if (req.user.role === 'estudiante') {
      // Student statistics
      const [
        totalApplications,
        pendingApplications,
        savedItems,
        savedJobs,
        savedCourses,
        savedEvents,
        applicationStatusStats
      ] = await Promise.all([
        prisma.jobApplication.count({ where: { applicant_id: req.user.id } }),
        prisma.jobApplication.count({
          where: {
            applicant_id: req.user.id,
            status: { in: ['nuevo', 'en_revision', 'entrevista'] }
          }
        }),
        prisma.savedItem.count({ where: { user_id: req.user.id } }),
        prisma.savedItem.count({ where: { user_id: req.user.id, item_type: 'job' } }),
        prisma.savedItem.count({ where: { user_id: req.user.id, item_type: 'course' } }),
        prisma.savedItem.count({ where: { user_id: req.user.id, item_type: 'event' } }),
        prisma.jobApplication.groupBy({
          by: ['status'],
          where: { applicant_id: req.user.id },
          _count: true
        })
      ]);

      stats = {
        role: 'student',
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          by_status: applicationStatusStats.map(item => ({
            status: item.status,
            count: item._count
          }))
        },
        saved_items: {
          total: savedItems,
          jobs: savedJobs,
          courses: savedCourses,
          events: savedEvents
        }
      };

    } else if (req.user.role === 'empresa') {
      // Company statistics
      const [
        totalJobs,
        activeJobs,
        totalApplications,
        newApplications,
        applicationStatusStats,
        jobPerformance
      ] = await Promise.all([
        prisma.jobVacancy.count({ where: { posted_by_user_id: req.user.id } }),
        prisma.jobVacancy.count({ where: { posted_by_user_id: req.user.id, is_active: true } }),
        prisma.jobApplication.count({
          where: { job_vacancy: { posted_by_user_id: req.user.id } }
        }),
        prisma.jobApplication.count({
          where: {
            job_vacancy: { posted_by_user_id: req.user.id },
            status: 'nuevo'
          }
        }),
        prisma.jobApplication.groupBy({
          by: ['status'],
          where: { job_vacancy: { posted_by_user_id: req.user.id } },
          _count: true
        }),
        prisma.jobApplication.groupBy({
          by: ['job_vacancy_id'],
          where: { job_vacancy: { posted_by_user_id: req.user.id } },
          _count: true,
          orderBy: { _count: { job_vacancy_id: 'desc' } },
          take: 5
        })
      ]);

      // Enrich job performance with job titles
      const jobIds = jobPerformance.map(item => item.job_vacancy_id);
      const jobs = await prisma.jobVacancy.findMany({
        where: { id: { in: jobIds } },
        select: { id: true, title: true }
      });

      const enrichedJobPerformance = jobPerformance.map(item => {
        const job = jobs.find(j => j.id === item.job_vacancy_id);
        return {
          job_id: item.job_vacancy_id,
          job_title: job?.title || 'Unknown Job',
          application_count: item._count
        };
      });

      stats = {
        role: 'company',
        jobs: {
          total: totalJobs,
          active: activeJobs
        },
        applications: {
          total: totalApplications,
          new: newApplications,
          by_status: applicationStatusStats.map(item => ({
            status: item.status,
            count: item._count
          }))
        },
        top_jobs: enrichedJobPerformance
      };
    }

    res.json(stats);

  } catch (error) {
    console.error('Get personal stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching personal statistics'
    });
  }
});

module.exports = router;
