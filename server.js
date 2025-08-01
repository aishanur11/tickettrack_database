const express = require('express');
const app = express();
const path = require('path');



app.use(express.json());
app.use(express.static('public'));

// Route: Buyer Engagement
app.use('/buyer-engagement', require('./controllers/buyer-engagement'));
app.use('/multi-event-buyers', require('./controllers/multi-event-buyers'));
app.use('/top-ticket-buyers', require('./controllers/top-ticket-buyers'));
app.use('/events-no-engagement', require('./controllers/events-no-engagement'));
app.use('/popular-events', require('./controllers/popular-events'));
app.use('/transfer-tickets', require('./controllers/transfer-tickets'));
app.use('/add-buyer', require('./controllers/add-buyer'));



// Step 5: Start the Server
// Define the port the server will listen on, defaulting to 5000 if not specified in environment variables
const PORT = process.env.PORT || 5002;

// Start the server and log a message indicating the URL.
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
