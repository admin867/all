const CACHE_NAME = "luxe-nightclub-v1.0.0"
const STATIC_CACHE = "static-v1.0.0"
const DYNAMIC_CACHE = "dynamic-v1.0.0"

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/about.html",
  "/contact.html",
  "/gallery.html",
  "/blog.html",
  "/reservation.html",
  "/faq.html",
  "/assets/css/main.css",
  "/assets/css/animations.css",
  "/assets/css/shared-components.css",
  "/assets/css/i18n.css",
  "/assets/js/main.js",
  "/assets/js/webgl-background.js",
  "/assets/js/animations.js",
  "/assets/js/shared-components.js",
  "/assets/js/i18n.js",
  "/assets/js/performance.js",
  "/assets/fonts/inter-variable.woff2",
  "/assets/fonts/playfair-display-variable.woff2",
  "/favicon.ico",
]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Fetch event
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      caches
        .match(request)
        .then((response) => {
          return (
            response ||
            fetch(request).then((fetchResponse) => {
              return caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, fetchResponse.clone())
                return fetchResponse
              })
            })
          )
        })
        .catch(() => {
          return caches.match("/index.html")
        }),
    )
    return
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request)
      }),
    )
    return
  }

  // Handle API requests and other resources
  event.respondWith(
    caches
      .match(request)
      .then((response) => {
        return (
          response ||
          fetch(request).then((fetchResponse) => {
            // Only cache successful responses
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone()
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return fetchResponse
          })
        )
      })
      .catch(() => {
        // Return offline fallback for images
        if (request.destination === "image") {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#1a1a1a"/><text x="100" y="100" text-anchor="middle" fill="#666" font-family="Arial">Offline</text></svg>',
            { headers: { "Content-Type": "image/svg+xml" } },
          )
        }
      }),
  )
})

// Background sync for form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form") {
    event.waitUntil(syncContactForm())
  }
  if (event.tag === "reservation-form") {
    event.waitUntil(syncReservationForm())
  }
})

async function syncContactForm() {
  const formData = await getStoredFormData("contact-form")
  if (formData) {
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      await clearStoredFormData("contact-form")
    } catch (error) {
      console.error("Failed to sync contact form:", error)
    }
  }
}

async function syncReservationForm() {
  const formData = await getStoredFormData("reservation-form")
  if (formData) {
    try {
      await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      await clearStoredFormData("reservation-form")
    } catch (error) {
      console.error("Failed to sync reservation form:", error)
    }
  }
}

async function getStoredFormData(key) {
  return new Promise((resolve) => {
    const request = indexedDB.open("FormStorage", 1)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(["forms"], "readonly")
      const store = transaction.objectStore("forms")
      const getRequest = store.get(key)
      getRequest.onsuccess = () => resolve(getRequest.result)
    }
  })
}

async function clearStoredFormData(key) {
  return new Promise((resolve) => {
    const request = indexedDB.open("FormStorage", 1)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(["forms"], "readwrite")
      const store = transaction.objectStore("forms")
      store.delete(key)
      transaction.oncomplete = () => resolve()
    }
  })
}
