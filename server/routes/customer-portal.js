const express = require('express');
const router = express.Router();

router.get('/orders', (req, res) => {
  res.json({ message: 'Customer portal routes - to be implemented with Sequelize' });
});

module.exports = router;
