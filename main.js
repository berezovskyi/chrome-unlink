skipLinkShortener = function(arg){
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
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.update(tabs[0].id, {url: dstUrl});
  });
};

chrome.contextMenus.create({
  title: "Skip the link shortener",
  contexts:["link"],
  onclick: skipLinkShortener
});