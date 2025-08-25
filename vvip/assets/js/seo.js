// SEO Enhancement JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initSEO()
  console.log("[v0] SEO enhancements initialized")
})

function initSEO() {
  generateBreadcrumbs()
  initStructuredData()
  initSocialSharing()
  initMetaTagUpdates()
  trackPageViews()
}

// Generate breadcrumb navigation
function generateBreadcrumbs() {
  const breadcrumbContainer = document.getElementById("breadcrumbs")
  if (!breadcrumbContainer) return

  const path = window.location.pathname
  const pathSegments = path.split("/").filter((segment) => segment !== "")

  // Remove .html extension for cleaner URLs
  const cleanSegments = pathSegments.map((segment) => segment.replace(".html", ""))

  const breadcrumbs = [{ name: "Home", url: "/" }]

  // Build breadcrumb trail
  let currentPath = ""
  cleanSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const name = formatBreadcrumbName(segment)
    const url = index === cleanSegments.length - 1 ? null : `${currentPath}.html`

    breadcrumbs.push({ name, url })
  })

  // Generate breadcrumb HTML
  const breadcrumbHTML = breadcrumbs
    .map((crumb, index) => {
      if (index === breadcrumbs.length - 1) {
        return `<span class="breadcrumb-current" aria-current="page">${crumb.name}</span>`
      }
      return `<a href="${crumb.url}" class="breadcrumb-link">${crumb.name}</a>`
    })
    .join('<span class="breadcrumb-separator" aria-hidden="true">›</span>')

  breadcrumbContainer.innerHTML = `
    <nav aria-label="Breadcrumb" class="breadcrumb-nav">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">${breadcrumbHTML}</li>
      </ol>
    </nav>
  `

  // Add structured data for breadcrumbs
  addBreadcrumbStructuredData(breadcrumbs)
}

function formatBreadcrumbName(segment) {
  const names = {
    about: "About",
    gallery: "Gallery",
    blog: "Events & News",
    reservation: "Reservations",
    contact: "Contact",
    faq: "FAQ",
  }
  return names[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
}

// Add structured data for breadcrumbs
function addBreadcrumbStructuredData(breadcrumbs) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url ? `${window.location.origin}${crumb.url}` : window.location.href,
    })),
  }

  const script = document.createElement("script")
  script.type = "application/ld+json"
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)
}

// Initialize additional structured data
function initStructuredData() {
  const currentPage = getCurrentPageType()

  switch (currentPage) {
    case "home":
      addOrganizationStructuredData()
      break
    case "about":
      addAboutPageStructuredData()
      break
    case "gallery":
      addImageGalleryStructuredData()
      break
    case "blog":
      addBlogStructuredData()
      break
    case "contact":
      addContactStructuredData()
      break
    case "faq":
      addFAQStructuredData()
      break
    case "reservation":
      addReservationStructuredData()
      break
  }
}

function getCurrentPageType() {
  const path = window.location.pathname
  if (path === "/" || path.includes("index")) return "home"
  if (path.includes("about")) return "about"
  if (path.includes("gallery")) return "gallery"
  if (path.includes("blog")) return "blog"
  if (path.includes("contact")) return "contact"
  if (path.includes("faq")) return "faq"
  if (path.includes("reservation")) return "reservation"
  return "other"
}

function addOrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: "LUXE Nightclub",
    alternateName: "LUXE",
    description:
      "Premium luxury nightclub experience with cutting-edge design, world-class entertainment, and unparalleled VIP service",
    url: "https://luxenightclub.com",
    logo: "https://luxenightclub.com/assets/img/logo.png",
    image: [
      "https://luxenightclub.com/assets/img/hero-image.jpg",
      "https://luxenightclub.com/assets/img/interior-1.jpg",
      "https://luxenightclub.com/assets/img/vip-area.jpg",
    ],
    telephone: "+1-555-LUXE-VIP",
    email: "info@luxenightclub.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Elite Boulevard",
      addressLocality: "Downtown",
      addressRegion: "NY",
      postalCode: "10001",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "40.7589",
      longitude: "-73.9851",
    },
    openingHours: ["Th 22:00-04:00", "Fr 22:00-04:00", "Sa 22:00-04:00"],
    priceRange: "$$$",
    servesCuisine: "Cocktails",
    acceptsReservations: true,
    hasMenu: true,
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "VIP Service",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Bottle Service",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Live DJ",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Valet Parking",
        value: true,
      },
    ],
    sameAs: [
      "https://www.instagram.com/luxenightclub",
      "https://www.facebook.com/luxenightclub",
      "https://twitter.com/luxenightclub",
    ],
  }

  addStructuredDataScript(structuredData)
}

function addImageGalleryStructuredData() {
  const galleryItems = document.querySelectorAll(".gallery-item img")
  const images = Array.from(galleryItems).map((img, index) => ({
    "@type": "ImageObject",
    contentUrl: img.src,
    name: img.alt || `LUXE Nightclub Gallery Image ${index + 1}`,
    description: img.alt || "Interior and atmosphere photos from LUXE nightclub",
  }))

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "LUXE Nightclub Photo Gallery",
    description: "Stunning photos showcasing the luxury interior, VIP areas, and vibrant atmosphere of LUXE nightclub",
    image: images,
  }

  addStructuredDataScript(structuredData)
}

function addFAQStructuredData() {
  const faqItems = document.querySelectorAll(".faq-item")
  const faqs = Array.from(faqItems).map((item) => {
    const question = item.querySelector(".faq-question span").textContent
    const answer = item.querySelector(".faq-answer").textContent.trim()

    return {
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    }
  })

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs,
  }

  addStructuredDataScript(structuredData)
}

function addStructuredDataScript(data) {
  const script = document.createElement("script")
  script.type = "application/ld+json"
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

// Social sharing functionality
function initSocialSharing() {
  const shareButtons = document.querySelectorAll(".share-btn")

  shareButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const platform = btn.getAttribute("data-platform")
      const url = encodeURIComponent(window.location.href)
      const title = encodeURIComponent(document.title)
      const description = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || "")

      let shareUrl = ""

      switch (platform) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
          break
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
          break
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
          break
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${title}%20${url}`
          break
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank", "width=600,height=400")
      }
    })
  })

  // Add native Web Share API support
  if (navigator.share) {
    const nativeShareBtn = document.querySelector(".native-share-btn")
    if (nativeShareBtn) {
      nativeShareBtn.style.display = "block"
      nativeShareBtn.addEventListener("click", async () => {
        try {
          await navigator.share({
            title: document.title,
            text: document.querySelector('meta[name="description"]')?.content || "",
            url: window.location.href,
          })
        } catch (err) {
          console.log("[v0] Error sharing:", err)
        }
      })
    }
  }
}

// Dynamic meta tag updates
function initMetaTagUpdates() {
  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement("link")
    canonical.rel = "canonical"
    document.head.appendChild(canonical)
  }
  canonical.href = window.location.href

  // Update Open Graph URL
  const ogUrl = document.querySelector('meta[property="og:url"]')
  if (ogUrl) {
    ogUrl.content = window.location.href
  }

  // Update Twitter Card URL
  const twitterUrl = document.querySelector('meta[name="twitter:url"]')
  if (twitterUrl) {
    twitterUrl.content = window.location.href
  }
}

// Simple page view tracking (privacy-friendly)
function trackPageViews() {
  // Only track if user hasn't opted out
  if (localStorage.getItem("analytics-opt-out") === "true") return

  const pageData = {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    referrer: document.referrer || "direct",
    userAgent: navigator.userAgent,
  }

  // Store in localStorage for privacy-friendly analytics
  const views = JSON.parse(localStorage.getItem("page-views") || "[]")
  views.push(pageData)

  // Keep only last 50 views
  if (views.length > 50) {
    views.splice(0, views.length - 50)
  }

  localStorage.setItem("page-views", JSON.stringify(views))

  console.log("[v0] Page view tracked:", pageData.url)
}

// Export functions for use in other scripts
window.SEO = {
  generateBreadcrumbs,
  addStructuredDataScript,
  trackPageViews,
}

// Declare missing functions
function addAboutPageStructuredData() {
  // Implementation for about page structured data
}

function addBlogStructuredData() {
  // Implementation for blog page structured data
}

function addContactStructuredData() {
  // Implementation for contact page structured data
}

function addReservationStructuredData() {
  // Implementation for reservation page structured data
}
