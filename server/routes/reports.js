const express = require('express');
const router = express.Router();

// Placeholder - will be fully implemented with Sequelize
router.get('/outstanding', (req, res) => {
  res.json({ totalOutstanding: 0, customers: [] });
});

router.get('/daybook', (req, res) => {
  res.json({ 
    totalSales: 0, 
    totalSalesCount: 0, 
    transactions: [] 
  });
});

module.exports = router;
