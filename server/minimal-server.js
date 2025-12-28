require('dotenv').config();
console.log('1. Starting server...');

const express = require('express');
console.log('2. Express loaded');

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

console.log('3. About to start listening...');
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
});
console.log('4. Listen called');
