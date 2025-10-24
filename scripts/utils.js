
// creates mutation observer that waits for document.head to exist
function onHeadReady(cb) {
  if (document.head) return cb();
  const mo = new MutationObserver(() => {
    if (document.head) {
      mo.disconnect();
      cb();
    }
  });
  mo.observe(document, { childList: true, subtree: true });
}

// display none for all targets
function update() {
  const targets = [];

  chrome.storage.sync.get((res) => {
    if (isBlockedPage(res) === 1) {
      console.log("blocked page, replacing");
      replacePage();
      return;
    }

    if (isBlockedPage(res) === 2) {
      console.log("blocked page, redirecting to inbox");
      window.location.href = "/direct/inbox/";
      return;
    }

    console.log("Settings", res);
    if (res.reels ?? false)
      targets.push("div:has(> span > div > a[href^='/reels'])");
    if (res.explore ?? false)
      targets.push("div:has(> span > div > a[href^='/explore'])");
    if (res.stories ?? false)
      targets.push("div[data-pagelet^='story_tray']");
    if (res.onlyMessages ?? false)
      targets.push("div:has(> div > div > div > div > div > div > span > div > a[href^='/explore'])");
    if (res.posts ?? false)
      targets.push("div:has(> div > div > article)");

    style.innerText =
      targets.length > 0
        ? targets.join(",") + " { display: none !important; }"
        : "";
  });
}

// replaces entire page with a silly img + link to homepage
function replacePage() {
  const catUrl = chrome.runtime.getURL("./public/images/catdunking.jpeg");

  window.stop();
  const root = document.documentElement;
  while (root.firstChild) root.removeChild(root.firstChild);

  const head = document.createElement("head");
  const body = document.createElement("body");
  root.append(head, body);

  head.innerHTML = `
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          background: #fff;
          margin: 0;
          padding: 0;
          background-image: url(${catUrl});
          background-repeat: no-repeat;
          background-attachment: fixed; 
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
      </style>
    `;

  body.innerHTML = `
      <a href="/" 
         style="z-index: 10000; 
                font-size: 32px; 
                text-decoration: none; 
                background-color: #EEEEEE";
                
      > 
      click me twin </a>
    `;
}

// checks if current page is blocked 
// (to then replace with swag cat)
function isBlockedPage(res) {
  const p = window.location.pathname;
  if ((p.startsWith("/reels") && res.reels) || ((p === "/explore" || p === "/explore/") && res.explore))
    return 1; // replace page
  if (!(p.startsWith("/direct/inbox")) && res.onlyMessages)
    return 2; // redirect
}