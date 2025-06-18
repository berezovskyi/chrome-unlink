var skipLinkShortener = function(arg, tab){ // Modified signature
  var srcUrl = arg.linkUrl;
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
  // Use the tab id from the onClicked event
  chrome.tabs.update(tab.id, {url: dstUrl});
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "skipLinkShortener",
    title: "Skip the link shortener",
    contexts:["link"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "skipLinkShortener") {
    skipLinkShortener({ linkUrl: info.linkUrl }, tab);
  }
});
