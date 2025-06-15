const webPush = require('web-push');
const fs = require('fs');

const vapidKeys = webPush.generateVAPIDKeys();

const envContent = `
VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
`.trim();

fs.writeFileSync('.env', envContent);
console.log('✅ VAPID keys generated and saved to .env');