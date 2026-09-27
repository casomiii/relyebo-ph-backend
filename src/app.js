const express = require('express');
const checkSoftGate = require('./middleware/checkSoftGate');

const app = express();

app.use(express.json());

let jobsCount = 0;
const idempotencyStore = new Set();

app.post('/api/v1/jobs', checkSoftGate, (req, res) => {
  const { gps } = req.body;
  if (!gps || typeof gps.lat !== 'number' || typeof gps.lng !== 'number') {
    return res.status(400).json({ message: 'Bad Request: Invalid GPS' });
  }

  const idempotencyKey = req.headers['x-idempotency-key'];
  if (idempotencyKey) {
    if (idempotencyStore.has(idempotencyKey)) {
      return res.status(201).json({ message: 'Job created' }); // Idempotent response
    }
    idempotencyStore.add(idempotencyKey);
  }

  jobsCount += 1;
  res.status(201).json({ message: 'Job created', jobsCount });
});

app.get('/api/v1/jobs/count', (req, res) => {
  res.status(200).json({ count: jobsCount });
});

app.delete('/api/v1/jobs', (req, res) => {
  jobsCount = 0;
  idempotencyStore.clear();
  res.status(200).json({ message: 'Jobs cleared' });
});

module.exports = app;
