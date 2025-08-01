const express = require('express');
const router = express.Router();
const db = require('../dbConfig');

// GET /multi-event-buyers
// This route returns events that have been attended by more than one unique buyer.
// It helps identify events with broader engagement across different attendees.
router.get('/', (req, res) => {
  const query = `
    SELECT 
      e.event_name, 
      COUNT(DISTINCT el.buyer_id) AS total_buyers
    FROM events e
    JOIN engagement_logs el ON e.event_id = el.event_id
    GROUP BY e.event_name
    HAVING COUNT(DISTINCT el.buyer_id) > 1
  `;

  // Execute the query and return results
  db.query(query, (err, results) => {
    if (err) {
      console.error('Query failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results); // Send the list of popular events with total unique buyers
  });
});

module.exports = router;
