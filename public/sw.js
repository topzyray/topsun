import { skipWaiting, clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";

// Ensure the service worker activates immediately and claims all clients
skipWaiting();
clientsClaim();

// Precache the static assets (if you're using workbox-build or next-pwa, this is automatically injected)
precacheAndRoute(self.__WB_MANIFEST);

// Handle push notifications
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/logo.jpg",
      badge: "/logo.jpg",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("https://school-management-system-jade.vercel.app"));
});

// **Configure caching strategy for Next.js static assets**

// Exclude hot-update files from caching
registerRoute(
  ({ url }) =>
    url.pathname.startsWith("/_next/static/webpack/") && url.pathname.includes("hot-update.js"),
  new NetworkOnly({
    cacheName: "nextjs-hot-update-files",
  }),
);

// Cache other static assets (like images, JavaScript, etc.)
registerRoute(
  ({ url }) => url.pathname.startsWith("/_next/static/"),
  new StaleWhileRevalidate({
    cacheName: "nextjs-static-assets",
  }),
);

// Optionally, you can cache other types of resources like images, fonts, etc.
registerRoute(
  ({ url }) => url.pathname.endsWith(".jpg") || url.pathname.endsWith(".png"),
  new StaleWhileRevalidate({
    cacheName: "nextjs-images",
  }),
);
