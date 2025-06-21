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

// Lead Management System
class LeadManager {
  constructor() {
    this.leads = JSON.parse(localStorage.getItem("acr_leads")) || [];
    this.init();
  }

  init() {
    this.setupFormHandling();
    this.displayLeads();
  }

  setupFormHandling() {
    const form = document.getElementById("leadForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmission(e.target);
      });
    }
  }

  handleFormSubmission(form) {
    const formData = new FormData(form);
    const lead = {
      id: Date.now(),
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      service: formData.get("service"),
      message: formData.get("message"),
      status: "new",
      date: new Date().toISOString(),
      source: "website",
    };

    this.addLead(lead);
    this.showSuccessMessage("Thank you! We'll get back to you soon.");
    form.reset();
  }

  addLead(lead) {
    this.leads.unshift(lead);
    this.saveLeads();
    this.displayLeads();
    this.sendNotification(lead);
  }

  saveLeads() {
    localStorage.setItem("acr_leads", JSON.stringify(this.leads));
  }

  displayLeads() {
    const leadsContainer = document.getElementById("leadsContainer");
    if (!leadsContainer) return;

    if (this.leads.length === 0) {
      leadsContainer.innerHTML =
        '<p class="no-leads">No leads yet. Start promoting your website!</p>';
      return;
    }

    const leadsHTML = this.leads
      .map(
        (lead) => `
            <div class="lead-card ${lead.status}">
                <div class="lead-header">
                    <h4>${lead.name}</h4>
                    <span class="lead-status ${lead.status}">${
          lead.status
        }</span>
                </div>
                <div class="lead-details">
                    <p><strong>Email:</strong> ${lead.email}</p>
                    <p><strong>Company:</strong> ${lead.company || "N/A"}</p>
                    <p><strong>Service:</strong> ${lead.service}</p>
                    <p><strong>Date:</strong> ${new Date(
                      lead.date
                    ).toLocaleDateString()}</p>
                    <p><strong>Message:</strong> ${lead.message}</p>
                </div>
                <div class="lead-actions">
                    <button onclick="leadManager.updateLeadStatus(${
                      lead.id
                    }, 'contacted')" class="btn btn-small">Mark Contacted</button>
                    <button onclick="leadManager.updateLeadStatus(${
                      lead.id
                    }, 'qualified')" class="btn btn-small">Mark Qualified</button>
                    <button onclick="leadManager.deleteLead(${
                      lead.id
                    })" class="btn btn-small btn-danger">Delete</button>
                </div>
            </div>
        `
      )
      .join("");

    leadsContainer.innerHTML = leadsHTML;
  }

  updateLeadStatus(leadId, status) {
    const lead = this.leads.find((l) => l.id === leadId);
    if (lead) {
      lead.status = status;
      this.saveLeads();
      this.displayLeads();
    }
  }

  deleteLead(leadId) {
    if (confirm("Are you sure you want to delete this lead?")) {
      this.leads = this.leads.filter((l) => l.id !== leadId);
      this.saveLeads();
      this.displayLeads();
    }
  }

  sendNotification(lead) {
    // In a real implementation, this would send an email or notification
    console.log("New lead received:", lead);

    // You could integrate with services like:
    // - EmailJS for email notifications
    // - Slack webhooks for team notifications
    // - CRM systems like HubSpot or Salesforce
  }

  showSuccessMessage(message) {
    const form = document.getElementById("leadForm");
    const existingMessage = form.querySelector(".success-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;
    form.insertBefore(successDiv, form.firstChild);

    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }

  exportLeads() {
    const csvContent = this.convertToCSV(this.leads);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `acr-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  convertToCSV(leads) {
    const headers = [
      "Name",
      "Email",
      "Company",
      "Service",
      "Message",
      "Status",
      "Date",
      "Source",
    ];
    const csvRows = [headers.join(",")];

    leads.forEach((lead) => {
      const row = [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.company || ""}"`,
        `"${lead.service}"`,
        `"${lead.message.replace(/"/g, '""')}"`,
        `"${lead.status}"`,
        `"${lead.date}"`,
        `"${lead.source}"`,
      ];
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  }
}

// Initialize Lead Manager
const leadManager = new LeadManager();

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

// Export functions for global access
window.leadManager = leadManager;
window.trackEvent = trackEvent;

// Run animations on scroll
window.addEventListener("scroll", checkAndAnimate);
window.addEventListener("load", checkAndAnimate);
