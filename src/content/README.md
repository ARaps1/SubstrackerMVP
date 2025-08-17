# Subscription Tracker Content Script

A Chrome extension content script that automatically detects subscription-related keywords on web pages and triggers notifications when users encounter subscription confirmation pages.

## Features

### 🔍 **Comprehensive Keyword Detection**

The content script monitors for multiple categories of subscription-related keywords:

- **Trial Keywords**: "trial", "free trial", "start trial", "begin trial", "try free"
- **Confirmation Keywords**: "subscription confirmation", "order confirmation", "payment confirmation", "billing confirmation", "subscription activated", "subscription successful", "payment successful", "order successful"
- **Subscription Keywords**: "subscription", "subscribe", "subscription plan", "billing cycle", "recurring payment", "auto-renewal", "monthly subscription", "yearly subscription"
- **Payment Keywords**: "payment method", "billing information", "credit card", "debit card", "payment details", "billing address"

### ⚡ **Performance Optimized**

- **Debounced Detection**: Uses debouncing (300ms delay) to prevent excessive keyword checking during rapid DOM changes
- **Smart Mutation Observer**: Only processes relevant DOM changes that add or modify text content
- **Efficient Text Processing**: Single pass through page text with case-insensitive matching

### 🔄 **Dynamic Content Support**

- **Real-time Monitoring**: Detects keywords in dynamically loaded content
- **SPA Navigation**: Handles single-page application navigation and URL changes
- **Visibility Changes**: Re-checks when page becomes visible (for background tabs)

### 🛡️ **Error Handling**

- **Try-catch Protection**: Graceful error handling for all operations
- **Observer Cleanup**: Proper cleanup of MutationObservers on page unload
- **Safe Error Logging**: Secure error message handling

## Usage

### Basic Implementation

The content script automatically initializes when injected into a page:

```typescript
// The script runs automatically, no manual initialization needed
// It will detect keywords and send messages to the background script
```

### Message Format

When keywords are detected, the content script sends structured messages to the background script:

```typescript
{
  type: "subscription-detected",
  keyword: "free trial",           // The specific keyword found
  category: "trial",               // Category of the keyword
  url: "https://example.com",      // Current page URL
  timestamp: 1703123456789         // Detection timestamp
}
```

### Background Script Integration

Your background script should listen for these messages:

```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "subscription-detected") {
    // Handle subscription detection
    console.log(`Subscription detected: ${message.keyword} on ${message.url}`);

    // Open popup, show notification, etc.
    // Your subscription tracking logic here
  }
});
```

## Testing

Use the included `test.html` file to test the content script functionality:

1. Load `test.html` in a browser
2. The page contains initial subscription keywords
3. Use the buttons to add dynamic content with keywords
4. Simulate SPA navigation
5. Check the browser console for detection messages

## Customization

### Adding New Keywords

To add new keywords, modify the `SUBSCRIPTION_KEYWORDS` object:

```typescript
const SUBSCRIPTION_KEYWORDS: SubscriptionKeywords = {
  trial: [
    "trial",
    "free trial",
    "start trial",
    "begin trial",
    "try free",
    "new keyword",
  ],
  // Add new categories or keywords as needed
  custom: ["your custom keyword", "another keyword"],
};
```

### Adjusting Performance

- **Debounce Delay**: Change the debounce delay (currently 300ms) in the `debouncedDetectKeywords` call
- **Observer Options**: Modify the MutationObserver options for different detection sensitivity

## Technical Details

### DOM Observation Strategy

- **ChildList**: Monitors for new nodes being added
- **CharacterData**: Monitors for text content changes
- **Subtree**: Observes the entire document tree
- **Smart Filtering**: Only processes mutations that actually add content

### Memory Management

- **Observer Cleanup**: Automatically disconnects observers on page unload
- **Timeout Management**: Proper cleanup of debounce timeouts
- **Event Listener Cleanup**: Removes event listeners when appropriate

### Browser Compatibility

- **Chrome Extensions**: Designed for Chrome extension content scripts
- **Modern JavaScript**: Uses ES6+ features (arrow functions, const/let, template literals)
- **TypeScript**: Full TypeScript support with proper type definitions

## Performance Considerations

1. **Debouncing**: Prevents excessive function calls during rapid DOM changes
2. **Selective Processing**: Only processes relevant mutations
3. **Single Detection**: Stops after finding the first keyword to avoid spam
4. **Efficient Text Search**: Uses `includes()` for fast string matching
5. **Observer Optimization**: Minimal observer configuration for performance

## Security Notes

- **Error Handling**: All operations are wrapped in try-catch blocks
- **Safe Logging**: Error messages are sanitized before logging
- **No External Calls**: Content script doesn't make external network requests
- **Chrome API Usage**: Only uses Chrome extension APIs for messaging
