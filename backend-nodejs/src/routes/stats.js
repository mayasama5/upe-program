const express = require('express');
const { User, Course, Event, JobVacancy, JobApplication } = require('../models');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get platform statistics
router.get('/', optionalAuth, async (req, res) => {
  try {
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
      upcomingEvents
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'estudiante' }),
      User.countDocuments({ role: 'empresa' }),
      Course.countDocuments(),
      Event.countDocuments(),
      JobVacancy.countDocuments(),
      JobApplication.countDocuments(),
      JobVacancy.countDocuments({ is_active: true }),
      Event.countDocuments({ event_date: { $gte: new Date() } })
    ]);

    // Get recent statistics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      newUsersLast30Days,
      newJobsLast30Days,
      newApplicationsLast30Days
    ] = await Promise.all([
      User.countDocuments({ created_at: { $gte: thirtyDaysAgo } }),
      JobVacancy.countDocuments({ created_at: { $gte: thirtyDaysAgo } }),
      JobApplication.countDocuments({ applied_at: { $gte: thirtyDaysAgo } })
    ]);

    // Get job type distribution
    const jobTypeStats = await JobVacancy.aggregate([
      { $match: { is_active: true } },
      { $group: { _id: '$job_type', count: { $sum: 1 } } }
    ]);

    // Get modality distribution
    const modalityStats = await JobVacancy.aggregate([
      { $match: { is_active: true } },
      { $group: { _id: '$modality', count: { $sum: 1 } } }
    ]);

    // Get application status distribution
    const applicationStatusStats = await JobApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get top skills from active jobs
    const topSkills = await JobVacancy.aggregate([
      { $match: { is_active: true } },
      { $unwind: '$skills_stack' },
      { $group: { _id: '$skills_stack', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

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
          type: item._id,
          count: item.count
        })),
        modalities: modalityStats.map(item => ({
          modality: item._id,
          count: item.count
        })),
        application_status: applicationStatusStats.map(item => ({
          status: item._id,
          count: item.count
        }))
      },
      insights: {
        top_skills: topSkills.map(item => ({
          skill: item._id,
          count: item.count
        }))
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
        savedEvents
      ] = await Promise.all([
        JobApplication.countDocuments({ student_id: req.user.id }),
        JobApplication.countDocuments({ 
          student_id: req.user.id, 
          status: { $in: ['nuevo', 'en_revision', 'entrevista'] }
        }),
        SavedItem.countDocuments({ user_id: req.user.id }),
        SavedItem.countDocuments({ user_id: req.user.id, item_type: 'job' }),
        SavedItem.countDocuments({ user_id: req.user.id, item_type: 'course' }),
        SavedItem.countDocuments({ user_id: req.user.id, item_type: 'event' })
      ]);

      const applicationStatusStats = await JobApplication.aggregate([
        { $match: { student_id: req.user.id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      stats = {
        role: 'student',
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          by_status: applicationStatusStats.map(item => ({
            status: item._id,
            count: item.count
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
      const companyJobs = await JobVacancy.find({ company_id: req.user.id });
      const jobIds = companyJobs.map(job => job.id);

      const [
        totalJobs,
        activeJobs,
        totalApplications,
        newApplications
      ] = await Promise.all([
        JobVacancy.countDocuments({ company_id: req.user.id }),
        JobVacancy.countDocuments({ company_id: req.user.id, is_active: true }),
        JobApplication.countDocuments({ job_id: { $in: jobIds } }),
        JobApplication.countDocuments({ 
          job_id: { $in: jobIds }, 
          status: 'nuevo' 
        })
      ]);

      const applicationStatusStats = await JobApplication.aggregate([
        { $match: { job_id: { $in: jobIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const jobPerformance = await JobApplication.aggregate([
        { $match: { job_id: { $in: jobIds } } },
        { $group: { 
          _id: '$job_id', 
          application_count: { $sum: 1 } 
        }},
        { $sort: { application_count: -1 } },
        { $limit: 5 }
      ]);

      // Enrich job performance with job titles
      const enrichedJobPerformance = await Promise.all(
        jobPerformance.map(async (item) => {
          const job = companyJobs.find(j => j.id === item._id);
          return {
            job_id: item._id,
            job_title: job?.title || 'Unknown Job',
            application_count: item.application_count
          };
        })
      );

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
            status: item._id,
            count: item.count
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
