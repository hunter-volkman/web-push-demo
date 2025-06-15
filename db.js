const Database = require('better-sqlite3');
const path = require('path');

// Path to DB file (auto-created if it doesn’t exist)
const db = new Database(path.join(__dirname, 'db', 'subscriptions.db'));

// Initialize the subscriptions table
db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT UNIQUE NOT NULL,
    subscription TEXT NOT NULL
  );
`);

// Save a new subscription (or ignore if it already exists)
function saveSubscription(subscription) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO subscriptions (endpoint, subscription)
    VALUES (?, ?)
  `);
  stmt.run(subscription.endpoint, JSON.stringify(subscription));
}

// Get all stored subscriptions
function getAllSubscriptions() {
  const rows = db.prepare(`SELECT subscription FROM subscriptions`).all();
  return rows.map(row => JSON.parse(row.subscription));
}

// Remove a subscription by endpoint
function removeSubscription(endpoint) {
  const stmt = db.prepare(`DELETE FROM subscriptions WHERE endpoint = ?`);
  stmt.run(endpoint);
}

module.exports = {
  saveSubscription,
  getAllSubscriptions,
  removeSubscription
};
