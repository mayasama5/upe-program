const express = require('express');
const prisma = require('../config/prisma');
const { requireAuth } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const savedItemSchema = Joi.object({
  item_id: Joi.string().required(),
  item_type: Joi.string().valid('course', 'event', 'job').required()
});

// Save item
router.post('/', requireAuth, async (req, res) => {
  try {
    const { error, value } = savedItemSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    const data = {
      user_id: req.user.id,
      item_type: value.item_type
    };

    // Set the appropriate foreign key based on item type
    if (value.item_type === 'course') {
      data.course_id = value.item_id;
    } else if (value.item_type === 'event') {
      data.event_id = value.item_id;
    } else if (value.item_type === 'job') {
      data.job_vacancy_id = value.item_id;
    }

    // Verify referenced entity exists to return a clear 404 instead of DB error
    if (value.item_type === 'course') {
      const exists = await prisma.course.findUnique({ where: { id: value.item_id } });
      if (!exists) {
        return res.status(404).json({ error: 'Course not found', message: 'The referenced course does not exist' });
      }
    } else if (value.item_type === 'event') {
      const exists = await prisma.event.findUnique({ where: { id: value.item_id } });
      if (!exists) {
        return res.status(404).json({ error: 'Event not found', message: 'The referenced event does not exist' });
      }
    } else if (value.item_type === 'job') {
      const exists = await prisma.jobVacancy.findUnique({ where: { id: value.item_id } });
      if (!exists) {
        return res.status(404).json({ error: 'Job not found', message: 'The referenced job does not exist' });
      }
    }

    const savedItem = await prisma.savedItem.create({ data });

    res.status(201).json({
      message: 'Item saved successfully',
      saved_item: savedItem
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Item already saved',
        message: 'This item is already in your saved items'
      });
    }
    console.error('Save item error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while saving item'
    });
  }
});

// Get saved items
router.get('/', requireAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      item_type
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { user_id: req.user.id };

    if (item_type) {
      where.item_type = item_type;
    }

    const [savedItems, total] = await Promise.all([
      prisma.savedItem.findMany({
        where,
        select: {
          id: true,
          user_id: true,
          item_type: true,
          course_id: true,
          event_id: true,
          job_vacancy_id: true,
          created_at: true,
          // only return minimal related fields to reduce payload
          course: {
            select: { id: true, title: true, provider: true, url: true, image_url: true }
          },
          event: {
            select: { id: true, title: true, organizer: true, event_date: true, location: true }
          },
          job_vacancy: {
            select: { id: true, title: true, company: true, location: true, apply_type: true, external_url: true, salary_range: true }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.savedItem.count({ where })
    ]);

    res.json({
      saved_items: savedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get saved items error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching saved items'
    });
  }
});

// Remove saved item
router.delete('/:itemId', requireAuth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const deletedItem = await prisma.savedItem.deleteMany({
      where: {
        user_id: req.user.id,
        OR: [
          { course_id: itemId },
          { event_id: itemId },
          { job_vacancy_id: itemId }
        ]
      }
    });

    if (deletedItem.count === 0) {
      return res.status(404).json({
        error: 'Item not found',
        message: 'Saved item not found or already removed'
      });
    }

    res.json({
      message: 'Item removed from saved items successfully'
    });

  } catch (error) {
    console.error('Remove saved item error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while removing saved item'
    });
  }
});

// Check if item is saved
router.get('/check/:itemId', requireAuth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { item_type } = req.query;

    const where = {
      user_id: req.user.id,
      OR: []
    };

    if (item_type === 'course') {
      where.OR = [{ course_id: itemId }];
    } else if (item_type === 'event') {
      where.OR = [{ event_id: itemId }];
    } else if (item_type === 'job') {
      where.OR = [{ job_vacancy_id: itemId }];
    } else {
      where.OR = [
        { course_id: itemId },
        { event_id: itemId },
        { job_vacancy_id: itemId }
      ];
    }

    const savedItem = await prisma.savedItem.findFirst({ where });

    res.json({
      is_saved: !!savedItem,
      saved_item: savedItem
    });

  } catch (error) {
    console.error('Check saved item error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while checking saved item'
    });
  }
});

module.exports = router;
