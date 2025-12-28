const express = require('express');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { Branch, Warehouse } = require('../models');

const router = express.Router();

// Get all branches
router.get('/', authMiddleware, async (req, res) => {
  try {
    const branches = await Branch.findAll({
      include: [{ model: Warehouse, as: 'warehouses' }]
    });
    res.json(branches);
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create branch
router.post('/', authMiddleware, checkRole(['ADMIN', 'HO']), async (req, res) => {
  try {
    const { name, address, isHeadOffice } = req.body;

    const branch = await Branch.create({
      name,
      address,
      isHeadOffice: isHeadOffice || false
    });
    res.status(201).json(branch);
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
