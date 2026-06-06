// AI Chat Widget for EL-Notepad Wiki — v3 responsive
(function() {
  if (document.getElementById("el-notepad-chat-widget")) return;
  var s = document.createElement("style");
  s.textContent = 
    "#el-notepad-chat-widget{position:fixed;bottom:20px;right:20px;z-index:9999;font-family:system-ui,-apple-system,sans-serif}" +
    "#el-notepad-chat-btn{width:56px;height:56px;border-radius:28px;background:#284b63;color:#fff;border:none;cursor:pointer;font-size:28px;box-shadow:0 4px 16px rgba(0,0,0,.25);transition:transform .2s;display:flex;align-items:center;justify-content:center}" +
    "#el-notepad-chat-btn:hover{transform:scale(1.1)}" +
    "#el-notepad-chat-panel{position:fixed;bottom:84px;right:20px;width:380px;height:560px;max-height:calc(100vh - 110px);background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.18);display:none;flex-direction:column;overflow:hidden}" +
    "body.dark #el-notepad-chat-panel{background:#1a1a2e}" +
    /* 移动端自适应 */
    "@media (max-width:767px){" +
    "#el-notepad-chat-widget{right:0;bottom:0;left:0}" +
    "#el-notepad-chat-btn{position:fixed;bottom:16px;right:16px;width:52px;height:52px;font-size:24px}" +
    "#el-notepad-chat-panel{position:fixed;bottom:0;right:0;left:0;width:100%;height:70vh;max-height:70vh;border-radius:16px 16px 0 0;bottom:0}" +
    "#el-notepad-chat-msgs{max-height:none;min-height:120px}" +
    "}" +
    "#el-notepad-chat-header{padding:12px 16px;background:#284b63;color:#fff;font-weight:600;font-size:14px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}" +
    "#el-notepad-chat-close{background:none;border:none;color:#fff;cursor:pointer;font-size:18px;padding:0 4px;line-height:1}" +
    "#el-notepad-chat-msgs{flex:1;overflow-y:auto;padding:12px;font-size:14px;line-height:1.5;min-height:200px}" +
    ".chat-msg{margin-bottom:10px;padding:8px 12px;border-radius:8px;max-width:85%;word-wrap:break-word;white-space:pre-wrap}" +
    ".chat-user{background:#284b63;color:#fff;margin-left:auto;border-radius:8px 8px 2px 8px}" +
    ".chat-bot{background:#f0f0f0;color:#222;margin-right:auto;border-radius:8px 8px 8px 2px}" +
    "body.dark .chat-bot{background:#2a2a3e;color:#e0e0e0}" +
    ".chat-typing{background:#f0f0f0;color:#888;margin-right:auto;border-radius:8px;padding:8px 12px}" +
    "body.dark .chat-typing{background:#2a2a3e;color:#888}" +
    "#el-notepad-chat-input-bar{display:flex;padding:8px;border-top:1px solid #e0e0e0;gap:8px;flex-shrink:0}" +
    "body.dark #el-notepad-chat-input-bar{border-color:#333}" +
    "#el-notepad-chat-input{flex:1;padding:8px 12px;border:1px solid #ddd;border-radius:8px;font-size:16px;outline:none}" +
    "body.dark #el-notepad-chat-input{background:#2a2a3e;color:#e0e0e0;border-color:#444}" +
    "#el-notepad-chat-send{padding:8px 16px;background:#284b63;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600}" +
    "#el-notepad-chat-send:disabled{opacity:.5;cursor:default}";
  document.head.appendChild(s);
  var c = document.createElement("div");
  c.id = "el-notepad-chat-widget";
  var btn = document.createElement("button");
  btn.id = "el-notepad-chat-btn";
  btn.textContent = "\uD83D\uDCAC";
  btn.title = "Ask AI";
  c.appendChild(btn);
  var p = document.createElement("div");
  p.id = "el-notepad-chat-panel";
  p.innerHTML =
    '<div id="el-notepad-chat-header"><span>\uD83E\uDD16 Wiki AI</span><button id="el-notepad-chat-close">\u2715</button></div>' +
    '<div id="el-notepad-chat-msgs"><div class="chat-msg chat-bot">Hi! Ask me anything about this wiki. \uD83D\uDC4B</div></div>' +
    '<div id="el-notepad-chat-input-bar"><input id="el-notepad-chat-input" type="text" placeholder="Ask a question...">' +
    '<button id="el-notepad-chat-send">Send</button></div>';
  c.appendChild(p);
  document.body.appendChild(c);
  var open = false;
  var msgs = document.getElementById("el-notepad-chat-msgs");
  var input = document.getElementById("el-notepad-chat-input");
  var sendBtn = document.getElementById("el-notepad-chat-send");
  var closeBtn = document.getElementById("el-notepad-chat-close");
  btn.onclick = function() { open = !open; p.style.display = open ? "flex" : "none"; if (open) input.focus(); };
  closeBtn.onclick = function() { open = false; p.style.display = "none"; };
  function addMsg(text, role) {
    var d = document.createElement("div");
    d.className = "chat-msg chat-" + role;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
  async function ask() {
    var q = input.value.trim();
    if (!q) return;
    addMsg(q, "user");
    input.value = "";
    sendBtn.disabled = true;
    var typing = document.createElement("div");
    typing.className = "chat-msg chat-typing";
    typing.textContent = "Thinking...";
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    try {
      var resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      });
      msgs.removeChild(typing);
      if (resp.ok) {
        var data = await resp.json();
        addMsg(data.answer || "No response", "bot");
      } else {
        addMsg("Error: " + resp.statusText, "bot");
      }
    } catch(e) {
      if (typing.parentNode) msgs.removeChild(typing);
      addMsg("Network error: " + e.message, "bot");
    }
    sendBtn.disabled = false;
  }
  sendBtn.onclick = ask;
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") { e.preventDefault(); ask(); }
  });
})();
