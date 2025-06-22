// Mobile Navigation
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }
});

// Handle Contact Form Submission
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("leadForm");
  console.log("Form found:", contactForm); // Debug log

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Form submitted!"); // Debug log

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const company = document.getElementById("company").value;
      const service = document.getElementById("service").value;
      const message = document.getElementById("message").value;

      console.log("Form data:", { name, email, company, service, message }); // Debug log

      const newLead = {
        id: `lead_${new Date().getTime()}`,
        name: name,
        email: email,
        company: company,
        service: service,
        message: message,
        date: new Date().toISOString(),
        status: "New",
      };

      const leads = JSON.parse(localStorage.getItem("leads")) || [];
      leads.push(newLead);
      localStorage.setItem("leads", JSON.stringify(leads));
      console.log("Lead saved to localStorage:", newLead); // Debug log

      // Show success message - create element if it doesn't exist
      let formFeedback = document.getElementById("form-feedback");
      if (!formFeedback) {
        formFeedback = document.createElement("div");
        formFeedback.id = "form-feedback";
        formFeedback.style.cssText =
          "color: green; margin-top: 10px; font-weight: bold;";
        contactForm.appendChild(formFeedback);
      }

      formFeedback.textContent =
        "Thank you for your message! We will get back to you soon.";
      formFeedback.style.display = "block";

      // Clear the form
      contactForm.reset();

      // Hide the success message after 5 seconds
      setTimeout(() => {
        formFeedback.style.display = "none";
      }, 5000);
    });
  } else {
    console.error("Form with ID 'leadForm' not found!"); // Debug log
  }
});

// Animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".service-card, .portfolio-item, .about-content, .contact-content"
  );
  animateElements.forEach((el) => observer.observe(el));

  // Lightbox functionality
  const lightbox = document.getElementById("image-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const portfolioImages = document.querySelectorAll(".portfolio-img");
  const closeBtn = document.querySelector(".lightbox-close");

  if (lightbox && lightboxImg && portfolioImages.length > 0 && closeBtn) {
    portfolioImages.forEach((img) => {
      img.addEventListener("click", () => {
        lightbox.style.display = "block";
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      });
    });

    const closeLightbox = () => {
      lightbox.style.display = "none";
    };

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
});

// Analytics tracking (basic)
function trackEvent(eventName, data = {}) {
  // In a real implementation, you'd send this to Google Analytics, Mixpanel, etc.
  console.log("Event tracked:", eventName, data);

  // Example: track form submissions, button clicks, etc.
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, data);
  }
}

// Track important user interactions
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-primary")) {
    trackEvent("cta_click", {
      button_text: e.target.textContent,
      location: e.target.closest("section")?.id || "unknown",
    });
  }
});

// Performance monitoring
window.addEventListener("load", () => {
  const loadTime =
    performance.timing.loadEventEnd - performance.timing.navigationStart;
  console.log(`Page load time: ${loadTime}ms`);

  if (loadTime > 3000) {
    console.warn(
      "Page load time is slow. Consider optimizing images and scripts."
    );
  }
});

// SEO and accessibility improvements
document.addEventListener("DOMContentLoaded", () => {
  // Add meta description if not present
  if (!document.querySelector('meta[name="description"]')) {
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "ACR Developer - Professional web development services specializing in WordPress and custom websites. Get a free quote today!";
    document.head.appendChild(meta);
  }

  // Add structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ACR Developer",
    description: "Professional web development services in Lubbock, Texas",
    url: window.location.href,
    telephone: "(806) 776-2691",
    email: "chrisramirez@acr-developer.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lubbock",
      addressRegion: "TX",
      addressCountry: "US",
    },
    serviceType: "Web Development",
    areaServed: "Lubbock, Texas and surrounding areas",
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
});

// Project Modal Functions
function openProjectModal(projectId) {
  const modal = document.getElementById(projectId + "-modal");
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }
}

function closeProjectModal(projectId) {
  const modal = document.getElementById(`modal-${projectId}`);
  modal.style.display = "none";
}

// Close modal when clicking outside of it
window.addEventListener("click", function (event) {
  const modals = document.querySelectorAll(".project-modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const modals = document.querySelectorAll(".project-modal");
    modals.forEach((modal) => {
      if (modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }
});

// Export functions for global access
window.trackEvent = trackEvent;
