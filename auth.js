const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid credentials' });

  const payload = { username };
  const secret = process.env.JWT_SECRET || 'dev-secret';
  const token = jwt.sign(payload, secret, { expiresIn: '12h' });

  res.json({ token });
});

module.exports = router;
