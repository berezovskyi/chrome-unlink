module.exports = {
  clearMocks: true,
  testEnvironment: 'node', // Or 'jsdom' if DOM interaction is needed, but for service-worker, 'node' is often fine.
  // For chrome.* APIs, we'll need to mock them.
  // We might need to set up a mock for the chrome API later.
};
