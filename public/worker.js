self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body || 'Default message',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' // optional
  });
});
