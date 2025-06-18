// Import the function to be tested
// Note: If skipLinkShortener is not explicitly exported, this will require modification.
// For now, assume it's made available for testing, or we'll adjust if the subtask fails.
// We might need to temporarily modify service-worker.js to export it if it's not globally available
// or use a different approach to load it if it's a global function.

// Mock the Chrome API
global.chrome = {
  tabs: {
    update: jest.fn(),
  },
  // Add other parts of the chrome API if needed by the function
};

// Load the service-worker.js script.
// This is a common way to load scripts that define global functions or attach to global objects.
// However, this can have side effects (like context menu creation).
// A cleaner way would be to export skipLinkShortener from service-worker.js.
// For now, let's try this and see.
const fs = require('fs');
const path = require('path');
const serviceWorkerCode = fs.readFileSync(path.resolve(__dirname, 'service-worker.js'), 'utf8');
// This eval can be risky. If it fails, we'll need to refactor service-worker.js for export.
eval(serviceWorkerCode);

describe('skipLinkShortener', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    chrome.tabs.update.mockClear();
  });

  test('should correctly extract and navigate to the destination URL for a valid sh.st link', () => {
    const mockArg = { linkUrl: 'https://sh.st/st/randomchars/https://example.com/actualpage' };
    const mockTab = { id: 123 };

    skipLinkShortener(mockArg, mockTab);

    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, { url: 'http://example.com/actualpage' });
  });

  test('should correctly handle http sh.st link', () => {
    const mockArg = { linkUrl: 'http://sh.st/st/randomchars/http://example.com/anotherpage' };
    const mockTab = { id: 124 };

    skipLinkShortener(mockArg, mockTab);

    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, { url: 'http://example.com/anotherpage' });
  });

  test('should handle sh.st link with https destination', () => {
     const mockArg = { linkUrl: 'http://sh.st/st/randomchars/https://secure.example.com/page' };
     const mockTab = { id: 125 };

     skipLinkShortener(mockArg, mockTab);

     expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
     // The current regex converts destination to http. Let's test that behavior.
     // If https is desired, the regex in service-worker.js needs to change.
     expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, { url: 'http://secure.example.com/page' });
  });

  test('should not modify the URL if it is not an sh.st link', () => {
    const mockArg = { linkUrl: 'https://www.google.com' };
    const mockTab = { id: 126 };

    skipLinkShortener(mockArg, mockTab);

    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, { url: 'https://www.google.com' });
  });

  test('should handle URLs with query parameters and fragments in destination', () => {
    const mockArg = { linkUrl: 'https://sh.st/st/randomchars/https://example.com/path?query=123#section' };
    const mockTab = { id: 127 };

    skipLinkShortener(mockArg, mockTab);

    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, { url: 'http://example.com/path?query=123#section' });
  });

  test('should handle sh.st links where the destination is http', () => {
     const mockArg = { linkUrl: 'http://sh.st/st/randomchars/http://anotherexample.com/resource' };
     const mockTab = { id: 128 };

     skipLinkShortener(mockArg, mockTab);

     expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
     expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, { url: 'http://anotherexample.com/resource' });
  });

});
