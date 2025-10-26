const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/career-advice
router.get('/', async (req, res) => {
  try {
  const advice = await prisma.careerAdvice.findMany();
    res.json({ advice });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching career advice', details: error.message });
  }
});

module.exports = router;