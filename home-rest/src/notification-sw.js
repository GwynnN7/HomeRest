importScripts('./ngsw-worker.js');

self.addEventListener('push', (event) => {
  const data = event.data?.json();

  const promise = (async () => {
    const auth = await checkAuth(data.uid);
    if (!auth) return;

    const title = "🏠 HomeRest Alert";
    const options = {
      body: data.text,
      icon: 'icons/icon-72x72.png',
      tag: 'home-rest-alert',
      renotify: true,
      actions: [
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]

    };

    await self.registration.showNotification(title, options);
  })();

  event.waitUntil(promise);
});

async function checkAuth(uid) {
  const cache = await caches.open('auth-cache');
  const response = await cache.match('/uid');
  if (!response) return false;

  const cache_uid = await response.text();

  return cache_uid === uid;
}
