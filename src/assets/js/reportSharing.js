/**
 * Helper utilities for sharing reports via WhatsApp and Gmail.
 * Radiant Agrovet Management System
 */

export const formatShareDate = () => {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Share report summary to WhatsApp
 * @param {Object} options
 * @param {string} options.title - Report title (e.g. "Product-wise Sales Report")
 * @param {string} options.period - Date range or period description
 * @param {string} [options.officer] - Selected Sales Officer (default: "All Officers")
 * @param {Array<{label: string, value: string|number}>} options.summaryItems - KPI metrics
 * @param {Array<{name: string, value: string|number}>} [options.topItems] - Top highlight rows
 * @param {string} [options.extraNotes] - Any additional text or remarks
 */
export const shareReportWhatsApp = ({
  title,
  period = "All Time",
  officer = "All Officers",
  summaryItems = [],
  topItems = [],
  extraNotes = "",
}) => {
  const generatedTime = formatShareDate();

  let message = `🏢 *Radiant Agrovet*\n`;
  message += `📊 *Report:* ${title}\n`;
  message += `📅 *Period:* ${period}\n`;
  if (officer) {
    message += `👤 *Sales Officer:* ${officer}\n`;
  }
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📋 *SUMMARY*\n`;

  summaryItems.forEach((item) => {
    message += `• *${item.label}:* ${item.value}\n`;
  });

  if (topItems && topItems.length > 0) {
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `⭐ *HIGHLIGHTS / TOP ITEMS*\n`;
    topItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*: ${item.value}\n`;
    });
  }

  if (extraNotes) {
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📝 *Note:* ${extraNotes}\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🕒 *Generated:* ${generatedTime}\n`;
  message += `🌐 *System:* Radiant Agrovet`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

/**
 * Share report summary via Gmail web compose
 * @param {Object} options
 * @param {string} options.title - Report title
 * @param {string} options.period - Date range or period description
 * @param {string} [options.officer] - Selected Sales Officer
 * @param {Array<{label: string, value: string|number}>} options.summaryItems - KPI metrics
 * @param {Array<{name: string, value: string|number}>} [options.topItems] - Top highlight rows
 * @param {string} [options.extraNotes] - Any additional text or remarks
 */
export const shareReportGmail = ({
  title,
  period = "All Time",
  officer = "All Officers",
  summaryItems = [],
  topItems = [],
  extraNotes = "",
}) => {
  const generatedTime = formatShareDate();

  const subject = `[Radiant Agrovet] ${title} - ${period}`;

  let body = `Radiant Agrovet - Management System\n`;
  body += `Report: ${title}\n`;
  body += `Period: ${period}\n`;
  if (officer) {
    body += `Sales Officer: ${officer}\n`;
  }
  body += `Generated: ${generatedTime}\n\n`;

  body += `============================================================\n`;
  body += `SUMMARY METRICS\n`;
  body += `============================================================\n`;

  summaryItems.forEach((item) => {
    body += `• ${item.label}: ${item.value}\n`;
  });

  if (topItems && topItems.length > 0) {
    body += `\n============================================================\n`;
    body += `TOP HIGHLIGHTS\n`;
    body += `============================================================\n`;
    topItems.forEach((item, index) => {
      body += `${index + 1}. ${item.name}: ${item.value}\n`;
    });
  }

  if (extraNotes) {
    body += `\n============================================================\n`;
    body += `NOTES\n`;
    body += `============================================================\n`;
    body += `${extraNotes}\n`;
  }

  body += `\n============================================================\n`;
  body += `Report URL: ${window.location.href}\n`;
  body += `Radiant Agrovet Management System\n`;

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, "_blank");
};
