const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Sales routes - to be implemented with Sequelize' });
});

module.exports = router;
