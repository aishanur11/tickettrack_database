const express = require('express');
const router = express.Router();
const db = require('../dbConfig');

// GET /buyer-engagement/buyers
// Route to return a list of all buyers with basic info (used to populate dropdowns)
router.get('/buyers', (req, res) => {
  const query = `SELECT buyer_id, first_name, last_name, email FROM buyers`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching buyers.' });
    res.json(results); // Return array of buyers for frontend dropdown
  });
});

// GET /buyer-engagement
// Route to return engagement logs with buyer name, event name, and engagement type.
// Optionally filters results by buyer email (case-insensitive).
router.get('/', (req, res) => {
  const email = req.query.email?.trim(); // Optional email query parameter
  let query = `
    SELECT 
      b.first_name, 
      b.last_name,
      e.event_name,
      et.engagement_type_name
    FROM engagement_logs el
    JOIN buyers b ON el.buyer_id = b.buyer_id
    JOIN events e ON el.event_id = e.event_id
    JOIN engagement_types et ON el.engagement_type_id = et.engagement_type_id
  `;
  const params = [];

  // If an email is provided, filter the results for that buyer
  if (email) {
    query += ' WHERE LOWER(b.email) = ?';
    params.push(email.toLowerCase());
  }

  // Run the query and return results
  db.query(query, params, (err, results) => {
    if (err) return res.json({ error: 'Query failed.' });
    res.json(results); // Return matching engagement logs
  });
});

module.exports = router;
