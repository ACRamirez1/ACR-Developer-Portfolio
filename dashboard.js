// Dashboard Analytics and Management

// Update dashboard stats
function updateDashboardStats() {
  const leads = leadManager.leads;
  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const contactedLeads = leads.filter(
    (lead) => lead.status === "contacted"
  ).length;
  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "qualified"
  ).length;

  document.getElementById("totalLeads").textContent = totalLeads;
  document.getElementById("newLeads").textContent = newLeads;
  document.getElementById("contactedLeads").textContent = contactedLeads;
  document.getElementById("qualifiedLeads").textContent = qualifiedLeads;

  // Update conversion rates
  const newToContacted =
    totalLeads > 0 ? Math.round((contactedLeads / totalLeads) * 100) : 0;
  const contactedToQualified =
    contactedLeads > 0
      ? Math.round((qualifiedLeads / contactedLeads) * 100)
      : 0;
  const overallConversion =
    totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  document.getElementById("newToContacted").textContent = newToContacted + "%";
  document.getElementById("contactedToQualified").textContent =
    contactedToQualified + "%";
  document.getElementById("overallConversion").textContent =
    overallConversion + "%";
}

// Filter leads
function filterLeads() {
  const statusFilter = document.getElementById("statusFilter").value;
  const serviceFilter = document.getElementById("serviceFilter").value;
  const searchTerm = document.getElementById("searchLeads").value.toLowerCase();

  let filteredLeads = leadManager.leads.filter((lead) => {
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    const matchesService =
      serviceFilter === "all" || lead.service === serviceFilter;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm) ||
      lead.company.toLowerCase().includes(searchTerm) ||
      lead.message.toLowerCase().includes(searchTerm);

    return matchesStatus && matchesService && matchesSearch;
  });

  displayFilteredLeads(filteredLeads);
}

// Display filtered leads
function displayFilteredLeads(leads) {
  const leadsContainer = document.getElementById("leadsContainer");

  if (leads.length === 0) {
    leadsContainer.innerHTML =
      '<p class="no-leads">No leads match your filters.</p>';
    return;
  }

  const leadsHTML = leads
    .map(
      (lead) => `
        <div class="lead-card ${lead.status}">
            <div class="lead-header">
                <h4>${lead.name}</h4>
                <span class="lead-status ${lead.status}">${lead.status}</span>
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

// Clear all leads
function clearAllLeads() {
  if (
    confirm(
      "Are you sure you want to delete all leads? This action cannot be undone."
    )
  ) {
    leadManager.leads = [];
    leadManager.saveLeads();
    leadManager.displayLeads();
    updateDashboardStats();
  }
}

// Modal functions
function showEmailTemplates() {
  document.getElementById("emailTemplatesModal").style.display = "block";
}

function showFollowUpSchedule() {
  document.getElementById("followUpModal").style.display = "block";
}

function showSocialContent() {
  alert(
    "Social media content ideas:\n\n" +
      '1. "Just launched a stunning WordPress website for [Client Name]! Check out the transformation 🚀"\n' +
      '2. "Your website is often the first impression customers have of your business. Make it count! 💻✨"\n' +
      '3. "WordPress vs Custom Development - which is right for your business? Let\'s discuss! 🤔"\n' +
      '4. "Before & After: Website redesign that increased conversions by 150% 📈"\n' +
      '5. "Free website audit - discover what\'s holding your site back from success! 🔍"'
  );
}

function showLeadResearch() {
  alert(
    "Lead Research Strategies:\n\n" +
      "1. LinkedIn: Search for businesses in your target industries\n" +
      "2. Google My Business: Find local businesses with poor websites\n" +
      "3. Industry directories and associations\n" +
      "4. Facebook/Instagram business pages\n" +
      "5. Local Chamber of Commerce websites\n" +
      '6. Google search for "business name + website" to find outdated sites\n' +
      "7. Competitor analysis - check who's not using your competitors\n" +
      "8. Trade shows and networking events"
  );
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Copy template to clipboard
function copyTemplate(templateId) {
  const textarea = document.getElementById(templateId);
  textarea.select();
  document.execCommand("copy");

  // Show feedback
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = "Copied!";
  button.style.background = "#10b981";

  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = "";
  }, 2000);
}

// Save follow-up schedule
function saveFollowUpSchedule() {
  const firstFollowup = document.getElementById("firstFollowup").value;
  const secondFollowup = document.getElementById("secondFollowup").value;
  const finalFollowup = document.getElementById("finalFollowup").value;

  const schedule = {
    first: parseInt(firstFollowup),
    second: parseInt(secondFollowup),
    final: parseInt(finalFollowup),
  };

  localStorage.setItem("acr_followup_schedule", JSON.stringify(schedule));
  alert("Follow-up schedule saved!");
  closeModal("followUpModal");
}

// Load follow-up schedule
function loadFollowUpSchedule() {
  const schedule = JSON.parse(localStorage.getItem("acr_followup_schedule"));
  if (schedule) {
    document.getElementById("firstFollowup").value = schedule.first;
    document.getElementById("secondFollowup").value = schedule.second;
    document.getElementById("finalFollowup").value = schedule.final;
  }
}

// Enhanced lead manager with dashboard integration
const originalDisplayLeads = leadManager.displayLeads;
leadManager.displayLeads = function () {
  originalDisplayLeads.call(this);
  updateDashboardStats();
};

const originalUpdateLeadStatus = leadManager.updateLeadStatus;
leadManager.updateLeadStatus = function (leadId, status) {
  originalUpdateLeadStatus.call(this, leadId, status);
  updateDashboardStats();
};

const originalDeleteLead = leadManager.deleteLead;
leadManager.deleteLead = function (leadId) {
  originalDeleteLead.call(this, leadId);
  updateDashboardStats();
};

// Analytics functions (placeholder for future chart integration)
function initializeAnalytics() {
  // In a real implementation, you'd integrate with Chart.js or similar
  console.log("Analytics initialized");

  // Placeholder for charts
  const chartContainers = document.querySelectorAll(".chart-container");
  chartContainers.forEach((container) => {
    container.innerHTML =
      "<p>Chart will be displayed here when data is available</p>";
  });
}

// Export enhanced leads with more data
function exportEnhancedLeads() {
  const leads = leadManager.leads;
  const enhancedLeads = leads.map((lead) => ({
    ...lead,
    daysSinceContact: Math.floor(
      (new Date() - new Date(lead.date)) / (1000 * 60 * 60 * 24)
    ),
    statusAge: getStatusAge(lead),
    priority: calculatePriority(lead),
  }));

  const csvContent = leadManager.convertToCSV(enhancedLeads);
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `acr-enhanced-leads-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

function getStatusAge(lead) {
  const statusChanges = lead.statusHistory || [];
  if (statusChanges.length === 0) {
    return Math.floor(
      (new Date() - new Date(lead.date)) / (1000 * 60 * 60 * 24)
    );
  }
  const lastChange = statusChanges[statusChanges.length - 1];
  return Math.floor(
    (new Date() - new Date(lastChange.date)) / (1000 * 60 * 60 * 24)
  );
}

function calculatePriority(lead) {
  let priority = 0;

  // New leads get higher priority
  if (lead.status === "new") priority += 10;
  if (lead.status === "contacted") priority += 5;

  // Recent leads get higher priority
  const daysSinceContact = Math.floor(
    (new Date() - new Date(lead.date)) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceContact <= 1) priority += 8;
  else if (daysSinceContact <= 3) priority += 6;
  else if (daysSinceContact <= 7) priority += 4;

  // Certain services might be higher priority
  if (lead.service === "wordpress") priority += 2;
  if (lead.service === "custom") priority += 3;

  return priority;
}

// Auto-refresh dashboard
function autoRefreshDashboard() {
  setInterval(() => {
    updateDashboardStats();
  }, 30000); // Refresh every 30 seconds
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  updateDashboardStats();
  initializeAnalytics();
  loadFollowUpSchedule();
  autoRefreshDashboard();

  // Close modals when clicking outside
  window.onclick = function (event) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  };

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "e":
          e.preventDefault();
          leadManager.exportLeads();
          break;
        case "f":
          e.preventDefault();
          document.getElementById("searchLeads").focus();
          break;
        case "n":
          e.preventDefault();
          window.location.href = "index.html#contact";
          break;
      }
    }
  });
});

// Performance monitoring for dashboard
function monitorDashboardPerformance() {
  const startTime = performance.now();

  window.addEventListener("load", () => {
    const loadTime = performance.now() - startTime;
    console.log(`Dashboard load time: ${loadTime.toFixed(2)}ms`);

    if (loadTime > 2000) {
      console.warn("Dashboard is loading slowly. Consider optimizing.");
    }
  });
}

monitorDashboardPerformance();

// Export functions for global access
window.filterLeads = filterLeads;
window.clearAllLeads = clearAllLeads;
window.showEmailTemplates = showEmailTemplates;
window.showFollowUpSchedule = showFollowUpSchedule;
window.showSocialContent = showSocialContent;
window.showLeadResearch = showLeadResearch;
window.closeModal = closeModal;
window.copyTemplate = copyTemplate;
window.saveFollowUpSchedule = saveFollowUpSchedule;
window.exportEnhancedLeads = exportEnhancedLeads;
