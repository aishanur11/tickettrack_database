const express = require('express');
const router = express.Router();
const db = require('../dbConfig');

// GET /buyer-engagement/all
// Route to retrieve all buyers' basic info for populating dropdowns (e.g., name + email)
router.get('/all', (req, res) => {
  const query = `SELECT first_name, last_name, email FROM buyers`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to load buyers' });
    res.json(results); // Respond with a list of all buyers
  });
});

// GET /buyer-engagement?email=...
// Route to fetch buyers who have more tickets than average, optionally filtered by email
router.get('/', (req, res) => {
  const { email } = req.query;   // Optional email query parameter
  const params = [];

  // Base query: select buyers with more than average number of tickets
  let query = `
    SELECT 
      b.first_name, 
      b.last_name, 
      b.email, 
      b.number_of_tickets,
      COUNT(DISTINCT el.event_id) AS events_attended
    FROM buyers b
    LEFT JOIN engagement_logs el ON b.buyer_id = el.buyer_id
    WHERE b.number_of_tickets > (
      SELECT AVG(number_of_tickets) FROM buyers
    )
  `;

  // If an email filter is provided, add it to the WHERE clause
  if (email) {
    query += ` AND b.email = ?`;
    params.push(email);
  }

  // Group by buyer and order by ticket count descending
  query += ` GROUP BY b.buyer_id ORDER BY b.number_of_tickets DESC`;

  // Execute the query with optional email parameter
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Query failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results); // Send matching buyers and their stats
  });
});

module.exports = router;
