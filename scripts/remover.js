const observer = new MutationObserver((mutations) => {
  removeElements();
});

function removeElements() {
  if (window.location.pathname.startsWith("/reels") || window.location.pathname === "/explore" || window.location.pathname === "/explore/") {
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
  } else {
    const targets = ["a[href^='/reels']", "a[href^='/explore']"];

    document.querySelectorAll(targets.join(",")).forEach((el) => {
      if (
        el.parentElement.tagName === "DIV" &&
        el.parentElement.parentElement.tagName === "SPAN" &&
        el.parentElement.parentElement.parentElement.tagName === "DIV"
      ) {
        el.parentElement.parentElement.parentElement.style.display = "none";
      }
    });
  }
}

removeElements();

observer.observe(document, { childList: true, subtree: true });
