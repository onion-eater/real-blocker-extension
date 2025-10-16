
const style = document.createElement("style");
onHeadReady(() => {
  document.head.appendChild(style);
  update();
});

// checks for changes in settings (popup)
chrome.storage.onChanged.addListener(update);

