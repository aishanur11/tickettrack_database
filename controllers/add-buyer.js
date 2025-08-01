const express = require('express');
const router = express.Router();
const db = require('../dbConfig');

router.post('/', (req, res) => {
  const { first_name, last_name, email } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const query = `INSERT INTO buyers (first_name, last_name, email, number_of_tickets) VALUES (?, ?, ?, 0)`;
  db.query(query, [first_name, last_name, email], (err, result) => {
    if (err) {
      console.error('Insert Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to add buyer.' });
    }
    res.json({ success: true, message: 'Buyer added successfully!' });
  });
});

module.exports = router;
