let subscription = null;

async function getVapidPublicKey() {
  const res = await fetch('/vapidPublicKey');
  return res.text();
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  return new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));
}

async function registerServiceWorker() {
  return await navigator.serviceWorker.register('/worker.js');
}

async function subscribeUser() {
  try {
    const registration = await registerServiceWorker();
    console.log('[ServiceWorker] Registered:', registration);

    const vapidKey = await getVapidPublicKey();
    console.log('[VAPID] Public Key:', vapidKey);

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    console.log('[Subscription] Success:', subscription);

    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' }
    });

    document.getElementById('status').textContent = '✅ Subscribed to push';
  } catch (err) {
    console.error('❌ Subscription error:', err);
    document.getElementById('status').textContent = `❌ Failed to subscribe: ${err?.message || err}`;
  }
}



async function unsubscribeUser() {
  const registration = await navigator.serviceWorker.ready;
  const subs = await registration.pushManager.getSubscription();

  if (subs) {
    await subs.unsubscribe();

    await fetch('/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ endpoint: subs.endpoint }),
      headers: { 'Content-Type': 'application/json' }
    });

    document.getElementById('status').textContent = '🚫 Unsubscribed';
  } else {
    document.getElementById('status').textContent = '⚠️ No active subscription';
  }
}

async function sendTestNotification() {
  await fetch('/notify', { method: 'POST' });
}

document.getElementById('subscribeBtn').addEventListener('click', subscribeUser);
document.getElementById('unsubscribeBtn').addEventListener('click', unsubscribeUser);
document.getElementById('notifyBtn').addEventListener('click', sendTestNotification);
