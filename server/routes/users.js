const express = require('express');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { User } = require('../models');

const router = express.Router();

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'role', 'branchId', 'customerId', 'createdAt']
    });
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (Admin/HO only)
router.get('/', authMiddleware, checkRole(['ADMIN', 'HO']), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role', 'branchId', 'customerId', 'createdAt']
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
