require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON
app.use(bodyParser.json());

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Load VAPID keys from .env
const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  throw new Error('❌ VAPID keys missing from .env');
}

webPush.setVapidDetails(
  'mailto:you@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// === ROUTES ===

// Get public VAPID key for frontend
app.get('/vapidPublicKey', (req, res) => {
  res.send(VAPID_PUBLIC_KEY);
});

// Save new subscription
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  console.log('[NEW SUBSCRIPTION]', subscription.endpoint);
  db.saveSubscription(subscription);
  res.status(201).json({ success: true });
});

// Remove a subscription (manual unsubscribe)
app.post('/unsubscribe', (req, res) => {
  const { endpoint } = req.body;
  console.log('[UNSUBSCRIBE]', endpoint);
  db.removeSubscription(endpoint);
  res.status(200).json({ removed: true });
});

// Trigger push notification to all subscribers
app.post('/notify', async (req, res) => {
  const subscriptions = db.getAllSubscriptions();
  const payload = JSON.stringify({
    title: 'Hello from the server!',
    body: 'This is a test push notification.'
  });

  let success = 0;
  let failed = 0;

  await Promise.all(subscriptions.map(async (sub) => {
    try {
      await webPush.sendNotification(sub, payload);
      success++;
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        db.removeSubscription(sub.endpoint);
        failed++;
        console.warn(`Removed expired subscription: ${sub.endpoint}`);
      } else {
        console.error('Failed to send push:', err);
      }
    }
  }));

  res.status(200).json({ success, failed });
});

// Debug route to inspect subscriptions 
// TODO: Don't expose it in production...)
app.get('/subscriptions', (req, res) => {
  const subs = db.getAllSubscriptions();
  res.json(subs);
});


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
