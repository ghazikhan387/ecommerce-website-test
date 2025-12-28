const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Purchases routes - to be implemented with Sequelize' });
});

module.exports = router;
