const skipLinkShortener = function(info, tab) {
  var srcUrl = info.linkUrl;
  var dstUrl = srcUrl; // safe default

  console.log("Source " + srcUrl);

  var shst_regex = /^http(s?):\/\/sh\.st\/st\/(\w+)\/http(s?):\/\/(.*)$/
  var match = srcUrl.match(shst_regex);
  if(match != null && match.length >= 3) {
    console.log("Match " + match);

    dstUrl = "http://" + match[4];
  }
  // TODO alternate between approches based on 'Ctrl' key status
  // chrome.tabs.create({url: dstUrl});

  if (tab && tab.id) {
    chrome.tabs.update(tab.id, {url: dstUrl});
  } else {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      if (tabs && tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, {url: dstUrl});
      }
    });
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "skip-link-shortener",
    title: "Skip the link shortener",
    contexts: ["link"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "skip-link-shortener") {
    skipLinkShortener(info, tab);
  }
});
