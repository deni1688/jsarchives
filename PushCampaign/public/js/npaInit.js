function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
function registerServiceWorker() {
  return navigator.serviceWorker
    .register("npa_ServiceWorker.js")
    .then(function(registration) {
      return registration;
    })
    .catch(function(err) {
      console.error("Unable to register service worker.", err);
    });
}

function askPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function(permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    } else {
      subscribeUserToPush();
    }
  });
}
function subscribeUserToPush() {
  return navigator.serviceWorker
    .register("npa_ServiceWorker.js")
    .then(function(registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          "BGp8tjifgDbbgnaWF59917Hzy_DM4Eg2s3LOgHEUXA9WztbAmuW7hnPaGAYmPQPFGz1y04yZ7mg8mvTdOlfRMbw"
        )
      };
      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
      sendSubscriptionToBackEnd(pushSubscription);
    });
}
function sendSubscriptionToBackEnd(subscription) {
  function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  }
  const siteIdentifier = document.querySelector('#npa-id').getAttribute('data-npa-id');
  const subscriberDetails = {
    subscription: subscription,
    isMobile: isMobile()
  }
  return fetch("/subscribers/save/" + siteIdentifier, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(subscriberDetails)
  }).then(function (response) {
    if (!response.ok) {
      throw new Error("Bad status code from server.");
    }
    return response.json();
  }).then(function (responseData) {
    if (!(responseData.data && responseData.data.success)) {
      throw new Error("Bad response from server.");
    }
  });
}
window.onload = function() {
  registerServiceWorker();
  if(Notification.permission !== 'granted'){
        askPermission();
  }
};
