# Web Push Demo App (VAPID + SQLite + ngrok)

A lightweight demo app that showcases how to implement web push notifications using:

- ✅ VAPID (Voluntary Application Server Identification)
- ✅ SQLite (for persisting push subscriptions)
- ✅ Express (Node.js backend)
- ✅ Service Workers + PushManager (frontend)
- ✅ ngrok (for mobile HTTPS testing)

This project is designed to work with mobile devices (iOS + Android) and desktop browsers.

---

## 🔧 Tech Stack

- **Backend**: Node.js + Express + web-push + better-sqlite3
- **Frontend**: Vanilla JS + HTML + Service Worker
- **Database**: SQLite
- **Secure Tunnel for HTTPS**: ngrok

---

## 📲 Features

| Feature               | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| VAPID Authentication   | Properly signed push messages using pre-generated keys                     |
| Subscription Storage   | Subscriptions persisted in SQLite for later use                             |
| Unsubscribe Handling   | Users can cleanly unsubscribe, and stale endpoints are removed automatically |
| Mobile Testing         | Full end-to-end testing with ngrok and real mobile push notifications        |

---

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Generate VAPID keys (one-time)**
   ```bash
   node scripts/generate-keys.js
   ```

3. **Run the server**
   ```bash
   node server.js
   ```

4.  **Start HTTPS tunnel (for mobile push support)**
    ```bash
    npx ngrok http 3000
    ```

5. **Open the ngrok URL** in your mobile browser and test the UI


## 📁 Project Structure

```bash
web-push-demo/
├── public/              # Frontend files
│   ├── index.html
│   ├── client.js
│   └── worker.js
├── server.js            # Express backend
├── db.js                # SQLite logic
├── db/                  # SQLite DB file
├── .env                 # VAPID keys (do not commit)
├── scripts/
│   └── generate-keys.js
├── .env.example
├── README.md
```

## 📚 Background Knowledge

* [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

* [MDN: Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

* [The Web Push Protocol](https://web.dev/articles/push-notifications-web-push-protocol)

* [Voluntary Application Server Identification for Web Push](https://datatracker.ietf.org/doc/html/draft-thomson-webpush-vapid)

