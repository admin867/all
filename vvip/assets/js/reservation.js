// Reservation Page Functionality
document.addEventListener("DOMContentLoaded", () => {
  initReservation()
  console.log("[v0] Reservation functionality initialized")
})

function initReservation() {
  initReservationOptions()
  initReservationForm()
  initDateValidation()
}

// Reservation option selection
function initReservationOptions() {
  const optionBtns = document.querySelectorAll(".option-btn")
  const optionCards = document.querySelectorAll(".option-card")
  const selectedOptionInput = document.getElementById("selected-option")
  const vipOptions = document.getElementById("vip-options")

  optionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const option = btn.getAttribute("data-option")

      // Update selected option
      selectedOptionInput.value = option

      // Update active card
      optionCards.forEach((card) => card.classList.remove("selected"))
      btn.closest(".option-card").classList.add("selected")

      // Show/hide VIP options
      if (option === "vip") {
        vipOptions.style.display = "block"
        // Make VIP fields required
        vipOptions.querySelectorAll("select").forEach((select) => {
          if (select.id === "bottle-preference") {
            select.setAttribute("required", "")
          }
        })
      } else {
        vipOptions.style.display = "none"
        // Remove required from VIP fields
        vipOptions.querySelectorAll("select").forEach((select) => {
          select.removeAttribute("required")
        })
      }

      // Scroll to form
      document.getElementById("reservation-form").scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Show success message
      const optionName = btn.closest(".option-card").querySelector(".option-title").textContent
      window.SharedComponents.showNotification(
        `${optionName} selected. Please fill out the reservation form below.`,
        "info",
        4000,
      )
    })
  })
}

// Reservation form handling
function initReservationForm() {
  const form = document.getElementById("reservation-form-element")
  const inputs = form.querySelectorAll(".form-input, .form-select, .form-textarea")

  // Form submission
  form.addEventListener("submit", handleReservationSubmit)

  // Input validation
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input))
    input.addEventListener("input", () => clearFieldError(input))
  })

  // Phone number formatting
  const phoneInput = document.getElementById("phone")
  if (phoneInput) {
    phoneInput.addEventListener("input", formatPhoneNumber)
  }

  // Party size change handler
  const partySizeSelect = document.getElementById("party-size")
  partySizeSelect.addEventListener("change", handlePartySizeChange)
}

function handleReservationSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const data = Object.fromEntries(formData.entries())

  // Validate form
  const isValid = validateReservationForm(form)

  if (!isValid) {
    window.SharedComponents.showNotification("Please correct the errors in the form.", "error")
    return
  }

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Processing Reservation..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    // Generate confirmation number
    const confirmationNumber = "LUXE" + Date.now().toString().slice(-6)

    // Reset form
    form.reset()
    document.querySelectorAll(".option-card").forEach((card) => {
      card.classList.remove("selected")
    })
    document.getElementById("vip-options").style.display = "none"

    // Reset button
    submitBtn.textContent = originalText
    submitBtn.disabled = false

    // Show success modal
    showReservationConfirmation(data, confirmationNumber)

    console.log("[v0] Reservation submitted:", data)
  }, 2500)
}

function validateReservationForm(form) {
  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false
    }
  })

  // Additional validations
  const emailField = form.querySelector('input[type="email"]')
  if (emailField && emailField.value && !isValidEmail(emailField.value)) {
    showFieldError(emailField, "Please enter a valid email address")
    isValid = false
  }

  const phoneField = form.querySelector('input[type="tel"]')
  if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
    showFieldError(phoneField, "Please enter a valid phone number")
    isValid = false
  }

  const dateField = form.querySelector('input[type="date"]')
  if (dateField && dateField.value && !isValidDate(dateField.value)) {
    showFieldError(dateField, "Please select a future date")
    isValid = false
  }

  return isValid
}

// Date validation
function initDateValidation() {
  const dateInput = document.getElementById("date")

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0]
  dateInput.setAttribute("min", today)

  // Set maximum date to 3 months from now
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  dateInput.setAttribute("max", maxDate.toISOString().split("T")[0])

  // Validate on change
  dateInput.addEventListener("change", () => {
    const selectedDate = new Date(dateInput.value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      showFieldError(dateInput, "Please select a future date")
    } else {
      clearFieldError(dateInput)
    }
  })
}

// Party size change handler
function handlePartySizeChange(e) {
  const partySize = Number.parseInt(e.target.value)
  const selectedOption = document.getElementById("selected-option").value

  // Show recommendations based on party size
  if (partySize >= 8 && selectedOption !== "vip") {
    window.SharedComponents.showNotification(
      "For parties of 8 or more, we recommend our VIP table service for the best experience.",
      "info",
      6000,
    )
  }
}

// Show reservation confirmation modal
function showReservationConfirmation(data, confirmationNumber) {
  const modalContent = `
    <div class="confirmation-modal">
      <div class="confirmation-header">
        <h2>Reservation Confirmed!</h2>
        <p class="confirmation-number">Confirmation #${confirmationNumber}</p>
      </div>
      
      <div class="confirmation-details">
        <h3>Reservation Details</h3>
        <div class="detail-row">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${data.firstName} ${data.lastName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">${formatDate(data.date)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span>
          <span class="detail-value">${formatTime(data.time)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Party Size:</span>
          <span class="detail-value">${data.partySize} ${data.partySize === "1" ? "person" : "people"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Type:</span>
          <span class="detail-value">${formatReservationType(data.reservationType)}</span>
        </div>
      </div>
      
      <div class="confirmation-actions">
        <p class="confirmation-note">
          You will receive a confirmation email within 24 hours. 
          Our team may contact you to finalize details.
        </p>
        <div class="action-buttons">
          <a href="https://wa.me/15558438847?text=Hi, I have a reservation confirmation ${confirmationNumber}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="btn btn-primary">
            Contact via WhatsApp
          </a>
          <button class="btn btn-secondary" onclick="this.closest('.modal').querySelector('.modal-close').click()">
            Close
          </button>
        </div>
      </div>
    </div>
  `

  window.SharedComponents.createModal(modalContent, { id: "reservation-confirmation" })
}

// Utility functions
function validateField(field) {
  const value = field.value.trim()

  clearFieldError(field)

  if (field.hasAttribute("required") && !value) {
    showFieldError(field, "This field is required")
    return false
  }

  if (field.type === "email" && value && !isValidEmail(value)) {
    showFieldError(field, "Please enter a valid email address")
    return false
  }

  if (field.type === "tel" && value && !isValidPhone(value)) {
    showFieldError(field, "Please enter a valid phone number")
    return false
  }

  if (field.type === "date" && value && !isValidDate(value)) {
    showFieldError(field, "Please select a future date")
    return false
  }

  return true
}

function showFieldError(field, message) {
  const formGroup = field.closest(".form-group")

  const existingError = formGroup.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }

  field.classList.add("error")

  const errorElement = document.createElement("span")
  errorElement.className = "field-error"
  errorElement.textContent = message
  formGroup.appendChild(errorElement)
}

function clearFieldError(field) {
  const formGroup = field.closest(".form-group")
  const errorElement = formGroup.querySelector(".field-error")

  field.classList.remove("error")
  if (errorElement) {
    errorElement.remove()
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  const cleanPhone = phone.replace(/[\s\-$$$$]/g, "")
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10
}

function isValidDate(dateString) {
  const selectedDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selectedDate >= today
}

function formatPhoneNumber(e) {
  const input = e.target
  const value = input.value.replace(/\D/g, "")

  if (value.length >= 6) {
    input.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
  } else if (value.length >= 3) {
    input.value = `(${value.slice(0, 3)}) ${value.slice(3)}`
  } else {
    input.value = value
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":")
  const date = new Date()
  date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatReservationType(type) {
  const types = {
    general: "General Admission",
    vip: "VIP Table Service",
    private: "Private Event",
  }
  return types[type] || type
}
