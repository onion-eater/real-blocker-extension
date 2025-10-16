document.addEventListener("DOMContentLoaded", init);

async function init() {
  const defaults = {
    reels: true,
    explore: true,
  };

  const keys = Object.keys(defaults);

  const res = await chrome.storage.sync.get(keys);

  for (const el of document.querySelectorAll('input[type="checkbox"][data-key]')) {
    const key = el.dataset.key;
    if (!keys.includes(key)) {
      console.log("Unknown key", key);
      continue;
    }
    el.checked = res[key] ?? defaults[key];

    el.addEventListener("change", () => {
      chrome.storage.sync.set({ [key]: el.checked });
      console.log(`Set ${key} to ${el.checked}`);
    });
  }
}