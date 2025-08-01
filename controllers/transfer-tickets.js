const express = require('express');
const router = express.Router();
const db = require('../dbConfig');

// GET /transfer-tickets/tickets
// Fetch all tickets along with event names for the dropdown menu
router.get('/tickets', (req, res) => {
  const query = `
    SELECT t.ticket_id, e.event_name
    FROM tickets t
    JOIN events e ON t.event_id = e.event_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Ticket fetch error:', err);
      return res.status(500).json({ error: 'Failed to load tickets' });
    }
    res.json(results); // Return list of tickets with associated event names
  });
});

// POST /transfer-tickets
// Transfer a ticket from one buyer to another using a database transaction
router.post('/', (req, res) => {
  const { fromBuyer, toBuyer, ticketId } = req.body;

  // Begin MySQL transaction to ensure atomicity
  db.beginTransaction(err => {
    if (err) {
      console.error('Failed to start transaction:', err);
      return res.status(500).json({ message: 'Transaction start failed' });
    }

    // Only update the ticket if it belongs to the specified fromBuyer
    const updateQuery = `
      UPDATE tickets 
      SET buyer_id = ? 
      WHERE ticket_id = ? AND buyer_id = ?
    `;

    db.query(updateQuery, [toBuyer, ticketId, fromBuyer], (err, result) => {
      // If update fails or ticket is not owned by fromBuyer, rollback
      if (err || result.affectedRows === 0) {
        db.rollback(() => {
          console.error('Transfer failed or no matching ticket:', err);
          return res.status(400).json({ message: 'Transfer failed. Check buyer IDs or ticket ownership.' });
        });
      } else {
        // Commit transaction if update is successful
        db.commit(err => {
          if (err) {
            db.rollback(() => {
              console.error('Commit failed:', err);
              return res.status(500).json({ message: 'Transaction commit failed' });
            });
          } else {
            return res.status(200).json({ message: 'Ticket transferred successfully!' });
          }
        });
      }
    });
  });
});

// GET /transfer-tickets/all-tickets
// (Unused in your frontend) – Fetch all tickets and their event names
router.get('/all-tickets', (req, res) => {
  const query = `
    SELECT t.ticket_id, e.event_name
    FROM tickets t
    JOIN events e ON t.event_id = e.event_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch tickets:', err);
      return res.status(500).json({ message: 'Error loading tickets' });
    }
    res.json(results);
  });
});

module.exports = router;
