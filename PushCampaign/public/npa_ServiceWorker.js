self.addEventListener('push', function(event) {
  var data = event.data.json();
  var title = data.title;
  var body = data.body;
  var icon = data.icon;
  var action = data.tag;
  var id = data.campaignId;
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: action,
      requireInteraction: true,
      data: {
        id: id
      }
    })
  );
});
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  fetch('http://ip-api.com/json')
    .then(res => res.json())
    .then(res => {
      fetch('/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clicked: 'Your notification has been clicked.',
          id: event.notification.data.id,
          location: res
        })
      });
    })
    .catch(err => console.log('could not locate'));

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window'
      })
      .then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === event.notification.tag && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.tag);
        }
      })
  );
});
