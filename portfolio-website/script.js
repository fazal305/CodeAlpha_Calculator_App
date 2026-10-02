/* 
   ELEMENTS
 */
const navLinks = document.querySelectorAll(".nav-link-custom");
const revealSections = document.querySelectorAll(".reveal-section");
const contactForm = document.querySelector(".contact-form");
const navbarCollapse = document.querySelector("#mainNavbar");

/* 
   REVEAL SECTIONS
 */
const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
      }
    });
  },
  {
    threshold: 0.18,
  },
);

revealSections.forEach(function (section) {
  revealObserver.observe(section);
});

/* 
   ACTIVE NAV LINK
 */
function updateActiveNavLink() {
  let currentSectionId = "home";

  document.querySelectorAll("section[id]").forEach(function (section) {
    const sectionTop = section.offsetTop - 150;

    if (window.scrollY >= sectionTop) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach(function (link) {
    const isActiveLink = link.getAttribute("href") === `#${currentSectionId}`;

    link.classList.toggle("active", isActiveLink);

    if (isActiveLink) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* 
   MOBILE MENU
 */
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    if (!navbarCollapse || !navbarCollapse.classList.contains("show")) {
      return;
    }

    const bootstrapMenu =
      bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
    bootstrapMenu.hide();
  });
});

/*
   CONTACT FORM DEMO
 */
function showFieldError(field, message) {
  clearFieldError(field);

  field.classList.add("is-invalid");

  const errorEl = document.createElement("span");
  errorEl.className = "field-error";
  errorEl.textContent = message;
  field.insertAdjacentElement("afterend", errorEl);
}

function clearFieldError(field) {
  field.classList.remove("is-invalid");

  const existingError = field.parentElement.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (contactForm) {
  const nameField = contactForm.querySelector("#nameInput");
  const emailField = contactForm.querySelector("#emailInput");
  const messageField = contactForm.querySelector("#messageInput");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let isFormValid = true;

    [nameField, emailField, messageField].forEach(function (field) {
      if (field) {
        clearFieldError(field);
      }
    });

    if (nameField && nameField.value.trim() === "") {
      showFieldError(nameField, "Please enter your name.");
      isFormValid = false;
    }

    if (emailField && emailField.value.trim() === "") {
      showFieldError(emailField, "Please enter your email.");
      isFormValid = false;
    } else if (emailField && !isValidEmail(emailField.value.trim())) {
      showFieldError(emailField, "Please enter a valid email address.");
      isFormValid = false;
    }

    if (messageField && messageField.value.trim() === "") {
      showFieldError(messageField, "Please enter a message.");
      isFormValid = false;
    }

    if (!isFormValid) {
      return;
    }

    alert(
      "Thanks for reaching out. This demo form is ready for future backend integration.",
    );
    contactForm.reset();
  });
}

window.addEventListener("scroll", updateActiveNavLink);
window.addEventListener("load", updateActiveNavLink);
