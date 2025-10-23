document.addEventListener("DOMContentLoaded", init);

async function init() {
  const defaults = {
    reels: true,
    explore: true,
    stories: true,
    onlyMessages: false
  };

  const keys = Object.keys(defaults);

  const res = await chrome.storage.sync.get(keys);
  
  // iterate through all checkboxes with data-key attribute
  for (const el of document.querySelectorAll('input[type="checkbox"][data-key]')) {
    const key = el.dataset.key;
    if (!keys.includes(key)) {
      console.log("Unknown key", key);
      continue;
    }

    el.checked = res[key] ?? defaults[key];
    // for each checkbox, add change listener
    el.addEventListener("change", () => {
      // current page might be blocked, unblock
      // if (res["onlyMessages"] && el.dataset.key === "onlyMessages" && !el.checked) {
      //   console.log("Reloading tab to unblock page");
      //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //     if (tabs.length > 0 && tabs[0].id) {
      //       chrome.tabs.reload(tabs[0].id);
      //     }
      //   });
      // }
      chrome.storage.sync.set({ [key]: el.checked });
      console.log(`Set ${key} to ${el.checked}`);
    });
  }
}