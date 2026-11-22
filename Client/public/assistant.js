(function () {

  const script = document.currentScript;
  const userId = script?.dataset?.userId;

  const theme = "dark";
  const assistantConfig = null
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "http://localhost:5173/assistant.css"
  document.head.appendChild(link);
  const popup = document.createElement("div");

  popup.className = `shifra-popup theme-${theme}`

  popup.innerHTML = `
  <div class = "shifra-overlay"></div>
  <div class = "shifra-content">
  <div class = "shifra-top">
  <div class = "shifra-orb-wrap">
  <div class = "shifra-orb-glow"></div>
  <div class = "shifra-orb"></div>
  </div>
  <h2 class = "shifra-title">
  Hello! I am Shifra AI</h2>

  <p class = "shifra-sub">
  Your smart voice assistant.
  <br/>
  Ask anything about your website.
  </p>
  <div class= "shifra-status">
  Tap button to Speak</div>

  <div class = "shifra-wave">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  </div>

  <!--User Text -->
  <div class = "shifra-user-text">
  
  </div>

  <!--AI Text -->
  <div class = "shifra-ai-text">
  
  </div>
  </div>
  <div class = "shifra-bottom">
  <button class = "shifra-mic">
  <img src = "http://localhost:5173/mic.svg" alt = "mic"
  class = "shifra-mic-icon"/>
  </button>
  </div>
  </div>
  `;

  document.body.appendChild(popup);

  const button = document.createElement("button")
  button.className = `shifra-btn theme-${theme}`

  button.innerHTML = `
  <img src = "http://localhost:5173/logo.png"
  alt = "logo"/>`;

  document.body.appendChild(button);

  let open = false;
  button.onclick = () => {
    open = !open;
    popup.style.display = open ? "flex" : "none";
  }

})();