// Shared Components for LUXE Nightclub Website
class SharedComponents {
  constructor() {
    this.init()
  }

  init() {
    this.createLoadingScreen()
    this.initBackToTop()
    this.initCookieConsent()
    this.initPreloader()
    console.log("[v0] Shared components initialized")
  }

  // Loading screen component
  createLoadingScreen() {
    const loadingHTML = `
      <div id="loading-screen" class="loading-screen">
        <div class="loading-content">
          <div class="loading-logo">LUXE</div>
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <div class="loading-text">Loading Experience...</div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML("afterbegin", loadingHTML)

    // Hide loading screen when page is loaded
    window.addEventListener("load", () => {
      const loadingScreen = document.getElementById("loading-screen")
      if (loadingScreen) {
        setTimeout(() => {
          loadingScreen.classList.add("fade-out")
          setTimeout(() => {
            loadingScreen.remove()
          }, 500)
        }, 1000)
      }
    })
  }

  // Back to top button
  initBackToTop() {
    const backToTopHTML = `
      <button id="back-to-top" class="back-to-top" aria-label="Back to top">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `

    document.body.insertAdjacentHTML("beforeend", backToTopHTML)

    const backToTopBtn = document.getElementById("back-to-top")

    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("visible")
      } else {
        backToTopBtn.classList.remove("visible")
      }
    })

    // Smooth scroll to top
    backToTopBtn.addEventListener("click", () => {
      if (window.gsap && window.gsap.to) {
        window.gsap.to(window, {
          duration: 1,
          scrollTo: { y: 0 },
          ease: "power3.inOut",
        })
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    })
  }

  // Cookie consent banner
  initCookieConsent() {
    // Check if consent already given
    if (localStorage.getItem("cookie-consent")) return

    const cookieHTML = `
      <div id="cookie-consent" class="cookie-consent">
        <div class="cookie-content">
          <div class="cookie-text">
            <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
          </div>
          <div class="cookie-actions">
            <button id="cookie-accept" class="btn btn-primary btn-small">Accept</button>
            <button id="cookie-decline" class="btn btn-secondary btn-small">Decline</button>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML("beforeend", cookieHTML)

    const cookieBanner = document.getElementById("cookie-consent")
    const acceptBtn = document.getElementById("cookie-accept")
    const declineBtn = document.getElementById("cookie-decline")

    // Show banner after delay
    setTimeout(() => {
      cookieBanner.classList.add("visible")
    }, 2000)

    // Handle accept
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "accepted")
      cookieBanner.classList.remove("visible")
      setTimeout(() => cookieBanner.remove(), 300)
    })

    // Handle decline
    declineBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "declined")
      cookieBanner.classList.remove("visible")
      setTimeout(() => cookieBanner.remove(), 300)
    })
  }

  // Preloader for images and assets
  initPreloader() {
    const images = document.querySelectorAll("img[data-src]")

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.classList.remove("lazy")
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach((img) => imageObserver.observe(img))
    } else {
      // Fallback for older browsers
      images.forEach((img) => {
        img.src = img.dataset.src
        img.classList.remove("lazy")
      })
    }
  }

  // Modal component
  static createModal(content, options = {}) {
    const modalId = options.id || "modal-" + Date.now()
    const modalHTML = `
      <div id="${modalId}" class="modal" role="dialog" aria-modal="true">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <button class="modal-close" aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="modal-body">
            ${content}
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML("beforeend", modalHTML)

    const modal = document.getElementById(modalId)
    const closeBtn = modal.querySelector(".modal-close")
    const overlay = modal.querySelector(".modal-overlay")

    // Show modal
    setTimeout(() => modal.classList.add("visible"), 10)

    // Close handlers
    const closeModal = () => {
      modal.classList.remove("visible")
      setTimeout(() => modal.remove(), 300)
      document.body.style.overflow = ""
    }

    closeBtn.addEventListener("click", closeModal)
    overlay.addEventListener("click", closeModal)

    // Close with Escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeModal()
        document.removeEventListener("keydown", handleEscape)
      }
    }
    document.addEventListener("keydown", handleEscape)

    // Prevent body scroll
    document.body.style.overflow = "hidden"

    return modal
  }

  // Notification component
  static showNotification(message, type = "info", duration = 5000) {
    const notificationHTML = `
      <div class="notification notification-${type}">
        <div class="notification-content">
          <span class="notification-message">${message}</span>
          <button class="notification-close" aria-label="Close notification">×</button>
        </div>
      </div>
    `

    // Create or get notification container
    let container = document.getElementById("notification-container")
    if (!container) {
      container = document.createElement("div")
      container.id = "notification-container"
      container.className = "notification-container"
      document.body.appendChild(container)
    }

    container.insertAdjacentHTML("beforeend", notificationHTML)

    const notification = container.lastElementChild
    const closeBtn = notification.querySelector(".notification-close")

    // Show notification
    setTimeout(() => notification.classList.add("visible"), 10)

    // Auto remove
    const autoRemove = setTimeout(() => {
      notification.classList.remove("visible")
      setTimeout(() => notification.remove(), 300)
    }, duration)

    // Manual close
    closeBtn.addEventListener("click", () => {
      clearTimeout(autoRemove)
      notification.classList.remove("visible")
      setTimeout(() => notification.remove(), 300)
    })

    return notification
  }
}

// Initialize shared components when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SharedComponents()
})

// Export for use in other scripts
window.SharedComponents = SharedComponents
