const express = require('express');
const router = express.Router();
const db = require('../dbConfig');

// POST /events-no-engagement
// This route returns a list of events that have no engagement records.
// An event is considered to have no engagement if it does not appear in the engagement_logs table.
router.post('/', (req, res) => {
  const query = `
    SELECT 
      e.event_name, 
      e.event_date
    FROM events e
    LEFT JOIN engagement_logs el ON e.event_id = el.event_id
    WHERE el.engagement_id IS NULL
  `;

  // Run the query and return the list of events with no engagement
  db.query(query, (err, results) => {
    if (err) {
      console.error('Query failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(results); // Return events with no matching rows in engagement_logs
  });
});

module.exports = router;
