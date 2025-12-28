console.log('Starting minimal server test...');
require('dotenv').config();
console.log('Dotenv loaded');

const express = require('express');
console.log('Express loaded');

const app = express();
const PORT = 5001;

app.get('/', (req, res) => {
  res.json({ message: 'Minimal server works!' });
});

app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});
