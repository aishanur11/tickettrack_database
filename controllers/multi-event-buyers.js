const express = require('express');
const router = express.Router();
const db = require('../dbConfig');

// GET /multi-event-buyers/all
// Route to retrieve all buyers' basic info (used for dropdowns in the UI)
router.get('/all', (req, res) => {
  const query = `SELECT first_name, last_name, email FROM buyers`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to load buyers' });
    res.json(results); // Return list of all buyers
  });
});

// GET /multi-event-buyers?email=...
// Route to return buyers who attended more than one distinct event.
// Optionally filters results by email (if query param is provided).
router.get('/', (req, res) => {
  const { email } = req.query;  // Optional email filter
  const params = [];

  // Base query: select buyers who attended > 1 event
  let query = `
    SELECT 
      b.first_name, 
      b.last_name, 
      b.email,
      COUNT(DISTINCT e.event_id) AS events_count,
      GROUP_CONCAT(DISTINCT e.event_name ORDER BY e.event_name SEPARATOR ', ') AS events_attended
    FROM buyers b
    JOIN engagement_logs el ON b.buyer_id = el.buyer_id
    JOIN events e ON el.event_id = e.event_id
    WHERE b.buyer_id IN (
      SELECT buyer_id
      FROM engagement_logs
      GROUP BY buyer_id
      HAVING COUNT(DISTINCT event_id) > 1
    )
  `;

  // If an email is provided, add it to the WHERE clause
  if (email) {
    query += ` AND b.email = ?`;
    params.push(email);
  }

  // Final grouping to summarize buyer event history
  query += ` GROUP BY b.buyer_id`;

  // Execute the query and return the results
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    res.json(results); // Respond with buyers who attended multiple events
  });
});

module.exports = router;
