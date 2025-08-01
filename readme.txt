
TicketTrack | Group 12
======================

README - Setup Instructions & Transaction Implementation

1. Project Overview
-------------------
TicketTrack is a database-driven web application built using Node.js and MySQL. It allows tracking of ticket purchases, buyer engagement, event popularity, and supports transferring tickets between buyers using transaction-safe operations.

2. Technology Stack
-------------------
- Backend: Node.js (Express)
- Frontend: HTML5, JavaScript, Bootstrap (Bootswatch Slate theme)
- Database: MySQL/MariaDB
- Environment: GCP VM running Ubuntu with XAMPP/MySQL and Node.js

3. Installation Steps
----------------------
a. **Install Dependencies**
   - Ensure Node.js and npm are installed (`node -v`, `npm -v`)
   - Navigate to the project directory and run:
     ```
     npm install
     ```

b. **Database Setup**
   - Import the SQL file `Group_12_Queries.sql` into your local MySQL or phpMyAdmin.
   - Make sure the database is named `tickettrack`.

c. **Configure DB Connection**
   - Open `dbConfig.js` and update your credentials:
     ```js
     const db = mysql.createConnection({
       host: 'localhost',
       user: 'your_mysql_user',
       password: 'your_mysql_password',
       database: 'tickettrack'
     });
     ```

4. Running the Application
--------------------------
- Start the server:
  ```
  node server.js
  ```
- Visit `http://localhost:5000` in your browser.

5. Folder Structure
-------------------
- `controllers/` – Route logic for each query
- `public/` – All HTML and client-side JS files
- `server.js` – Main app entry point

6. Transaction Feature (Transfer Tickets)
-----------------------------------------
The ticket transfer functionality is implemented using **MySQL transactions** to ensure data integrity:

- Route: `POST /transfer-tickets`
- Description: Transfers a ticket from one buyer to another.
- Logic:
  - Start a transaction.
  - Validate that the selected ticket belongs to the `fromBuyer`.
  - If valid, update the ticket's `buyer_id`.
  - If not, rollback the transaction and return an error.
  - If update is successful, commit the transaction and return success.

Here’s the pattern used:
```js
db.beginTransaction(err => {
  // update query
  // rollback if error or no match
  // commit if success
});
```

7. Notes
--------
- All unnecessary files (e.g., `node_modules/`) have been removed.
- Make sure MySQL is running before launching the server.
- Use `npm install` before starting the server for the first time.
