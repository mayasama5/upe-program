const express = require('express');
const { SavedItem } = require('../models');
const { requireAuth } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const savedItemSchema = Joi.object({
  item_id: Joi.string().required(),
  item_type: Joi.string().valid('course', 'event', 'job').required(),
  item_data: Joi.object().required()
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

    // Check if item is already saved
    const existingItem = await SavedItem.findOne({
      user_id: req.user.id,
      item_id: value.item_id,
      item_type: value.item_type
    });

    if (existingItem) {
      return res.status(409).json({
        error: 'Item already saved',
        message: 'This item is already in your saved items'
      });
    }

    const savedItem = new SavedItem({
      user_id: req.user.id,
      item_id: value.item_id,
      item_type: value.item_type,
      item_data: value.item_data
    });

    await savedItem.save();

    res.status(201).json({
      message: 'Item saved successfully',
      saved_item: savedItem
    });

  } catch (error) {
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
    const query = { user_id: req.user.id };

    if (item_type) {
      query.item_type = item_type;
    }

    const savedItems = await SavedItem.find(query)
      .sort({ saved_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SavedItem.countDocuments(query);

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

    const deletedItem = await SavedItem.findOneAndDelete({
      user_id: req.user.id,
      item_id: itemId
    });

    if (!deletedItem) {
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

    const query = {
      user_id: req.user.id,
      item_id: itemId
    };

    if (item_type) {
      query.item_type = item_type;
    }

    const savedItem = await SavedItem.findOne(query);

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
