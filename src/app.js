const express = require('express');
const checkSoftGate = require('./middleware/checkSoftGate');

const app = express();

app.use(express.json());

app.post('/api/v1/jobs', checkSoftGate, (req, res) => {
  res.status(201).json({ message: 'Job created' });
});

module.exports = app;
