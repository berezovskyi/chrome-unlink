/**
 * @jest-environment node
 */
// Mock chrome API for testing (must be before require)
global.chrome = {
  tabs: {
    update: jest.fn(),
  },
  runtime: {
    onInstalled: {
      addListener: jest.fn(),
    },
  },
  contextMenus: {
    create: jest.fn(),
    onClicked: {
      addListener: jest.fn(),
    },
  },
};

const { skipLinkShortener } = require('./service-worker.js');

describe('skipLinkShortener', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    chrome.tabs.update.mockClear();
  });

  test('should correctly extract and navigate to the destination URL for a valid sh.st link', () => {
    const mockArg = {
      linkUrl: 'https://sh.st/st/randomchars/https://example.com/actualpage',
    };
    const mockTab = { id: 123 };

    skipLinkShortener(mockArg, mockTab);

    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, {
      url: 'http://example.com/actualpage',
    });
  });

  test('should correctly handle http sh.st link', () => {
    const mockArg = {
      linkUrl: 'http://sh.st/st/randomchars/http://example.com/anotherpage',
    };
    const mockTab = { id: 124 };

    skipLinkShortener(mockArg, mockTab);

    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, {
      url: 'http://example.com/anotherpage',
    });
  });

  test('should handle sh.st link with https destination', () => {
    const mockArg = {
      linkUrl: 'http://sh.st/st/randomchars/https://secure.example.com/page',
    };
    const mockTab = { id: 125 };

    skipLinkShortener(mockArg, mockTab);

    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    // The current regex converts destination to http. Let's test that behavior.
    // If https is desired, the regex in service-worker.js needs to change.
    expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, {
      url: 'http://secure.example.com/page',
    });
  });

  test('should not modify the URL if it is not an sh.st link', () => {
    const mockArg = { linkUrl: 'https://www.google.com' };
    const mockTab = { id: 126 };

    skipLinkShortener(mockArg, mockTab);

    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, {
      url: 'https://www.google.com',
    });
  });

  test('should handle URLs with query parameters and fragments in destination', () => {
    const mockArg = {
      linkUrl:
        'https://sh.st/st/randomchars/https://example.com/path?query=123#section',
    };
    const mockTab = { id: 127 };

    skipLinkShortener(mockArg, mockTab);

    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, {
      url: 'http://example.com/path?query=123#section',
    });
  });

  test('should handle sh.st links where the destination is http', () => {
    const mockArg = {
      linkUrl: 'http://sh.st/st/randomchars/http://anotherexample.com/resource',
    };
    const mockTab = { id: 128 };

    skipLinkShortener(mockArg, mockTab);

    expect(chrome.tabs.update).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.update).toHaveBeenCalledWith(mockTab.id, {
      url: 'http://anotherexample.com/resource',
    });
  });
});
