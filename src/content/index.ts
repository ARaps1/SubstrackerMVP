// Content script to detect subscription-related keywords and trigger popup
type SubscriptionKeywords = Record<string, readonly string[]>;

// Define subscription-related keywords to detect
const SUBSCRIPTION_KEYWORDS: SubscriptionKeywords = {
  trial: ["trial", "free trial", "start trial", "begin trial", "try free"],
  confirmation: [
    "subscription confirmation",
    "order confirmation",
    "payment confirmation",
    "billing confirmation",
    "subscription activated",
    "subscription successful",
    "payment successful",
    "order successful",
  ],
  subscription: [
    "subscription",
    "subscribe",
    "subscription plan",
    "billing cycle",
    "recurring payment",
    "auto-renewal",
    "monthly subscription",
    "yearly subscription",
  ],
  payment: [
    "payment method",
    "billing information",
    "credit card",
    "debit card",
    "payment details",
    "billing address",
  ],
};

// Debounce function to limit how often we check for keywords
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Check if any subscription keywords are present in the page text
function detectSubscriptionKeywords(): void {
  try {
    // Get all text content from the page
    const pageText =
      (document.body.innerText || document.body.textContent) ?? "";
    const lowerPageText = pageText.toLowerCase();

    // Check each category of keywords
    for (const [category, keywords] of Object.entries(SUBSCRIPTION_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerPageText.includes(keyword.toLowerCase())) {
          console.log(
            `Subscription keyword detected: "${keyword}" (category: ${category})`
          );

          // Send message to background script with detected keyword info
          void chrome.runtime.sendMessage({
            type: "subscription-detected",
            keyword,
            category,
            url: window.location.href,
            timestamp: Date.now(),
          });

          // Only send one message per detection to avoid spam
          return;
        }
      }
    }
  } catch (error) {
    console.error(
      "Error detecting subscription keywords:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// Debounced version of the detection function
const debouncedDetectKeywords = debounce(detectSubscriptionKeywords, 300);

// Function to observe DOM changes for dynamic content
function observePageChanges(): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    // Only process mutations that add or modify text content
    const hasRelevantChanges = mutations.some((mutation) => {
      if (mutation.type === "childList") {
        // Check if new nodes were added
        return mutation.addedNodes.length > 0;
      }
      if (mutation.type === "characterData") {
        // Check if text content changed
        return (
          mutation.target.textContent &&
          mutation.target.textContent.trim().length > 0
        );
      }
      return false;
    });

    if (hasRelevantChanges) {
      debouncedDetectKeywords();
    }
  });

  // Start observing the document body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return observer;
}

// Initialize the content script
function initialize(): void {
  console.log(
    "Subscription tracker content script loaded - monitoring for subscription keywords..."
  );

  // Check for keywords immediately
  detectSubscriptionKeywords();

  // Set up observer for dynamic content
  const observer = observePageChanges();

  // Clean up observer when page unloads
  window.addEventListener("beforeunload", () => {
    observer.disconnect();
  });
}

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

// Also check when page becomes visible (for SPAs)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    debouncedDetectKeywords();
  }
});

// Listen for navigation events in SPAs
let currentUrl = window.location.href;
const urlObserver = new MutationObserver(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    // Small delay to allow new content to load
    setTimeout(detectSubscriptionKeywords, 500);
  }
});

// Observe URL changes by watching for changes in the document title or body
urlObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Export for potential testing or external use
export { detectSubscriptionKeywords, SUBSCRIPTION_KEYWORDS };
