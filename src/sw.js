import { DateRange } from "./assets/js/DateFormater";
import { OfflineUrls as STATIC_ASSETS } from "./assets/js/Utility";

const CACHE_NAME = "Radiant-cache-v2"; // 🔥 নতুন ভার্সন নাম্বার ব্যবহার করো
const OFFLINE_PAGE = "/offline.html";

//===> Install event: Cache essential files/pages/assets
self.addEventListener("install", (event) => {
  self.skipWaiting(); // 🔥 নতুন SW সাথে সাথে install হোক
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching static assets");
      return cache.addAll([...STATIC_ASSETS, OFFLINE_PAGE]);
    })
  );
});

//===> Activate event: Remove old caches + force claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // 🔥 পুরানো SW কে replace করে নতুন SW active করবে
});

// ===> Fetch event: Cache API responses & serve offline
self.addEventListener("fetch", (event) => {
  const apiUrls = [
    //=> Home page
    "http://localhost:8000/api/dueInvoice",
    "http://localhost:8000/api/low_stock_alerts",
    "http://localhost:8000/api/dashboard-report",
    `http://localhost:8000/api/profit-loss-report?from_date=${
      DateRange("year").formattedStartDate
    }&to_date=${DateRange("year").formattedEndDate}`,

    //=> Brand page
    "http://localhost:8000/api/brands",
  ];

  if (apiUrls.some((api) => event.request.url.includes(api))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone()); // ক্যাশে API ডাটা সংরক্ষণ
            return response;
          })
          .catch(() => caches.match(event.request)); // অফলাইনে থাকলে ক্যাশ ডাটা লোড
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).catch(() => caches.match(OFFLINE_PAGE))
        );
      })
    );
  }
});

// import { DateRange } from "./assets/js/DateFormater";
// import { OfflineUrls as STATIC_ASSETS } from "./assets/js/Utility";
// const CACHE_NAME = "Radiant-cache-v1";
// const OFFLINE_PAGE = "/offline.html";

// //===> Install event: Cache essential files/pages/assets
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Caching static assets");
//       return cache.addAll([...STATIC_ASSETS, OFFLINE_PAGE]);
//     })
//   );
// });

// //===> Activate event: Remove old caches
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cache) => {
//           if (cache !== CACHE_NAME) {
//             console.log("Deleting old cache:", cache);
//             return caches.delete(cache);
//           }
//         })
//       );
//     })
//   );
// });

// // ===> Fetch event: Cache API responses & serve offline
// self.addEventListener("fetch", (event) => {
//   const apiUrls = [
//     //=> Home page
//     "http://localhost:8000/api/dueInvoice",
//     "http://localhost:8000/api/low_stock_alerts",
//     "http://localhost:8000/api/dashboard-report",
//     `http://localhost:8000/api/profit-loss-report?from_date=${
//       DateRange("year").formattedStartDate
//     }&to_date=${DateRange("year").formattedEndDate}`,

//     //=> Brand page
//     "http://localhost:8000/api/brands",
//     // "http://localhost:8000/api/brands",
//   ];

//   if (apiUrls.some((api) => event.request.url.includes(api))) {
//     event.respondWith(
//       caches.open(CACHE_NAME).then((cache) => {
//         return fetch(event.request)
//           .then((response) => {
//             cache.put(event.request, response.clone()); // ক্যাশে API ডাটা সংরক্ষণ
//             return response;
//           })
//           .catch(() => caches.match(event.request)); // অফলাইনে থাকলে ক্যাশ ডাটা লোড
//       })
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request).then((cachedResponse) => {
//         return (
//           cachedResponse ||
//           fetch(event.request).catch(() => caches.match(OFFLINE_PAGE))
//         );
//       })
//     );
//   }
// });
