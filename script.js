(function () {
  function qs(id) {
    return document.getElementById(id);
  }

  // عناصر FPS
  const fpsCanvas = qs("fpsCanvas");
  const fpsNowEl = qs("fpsNow");
  const fpsAvgEl = qs("fpsAvg");
  const fpsMinEl = qs("fpsMin");
  const startBtn = qs("startBtn");
  const stopBtn = qs("stopBtn");

  // عناصر المعلومات
  const cpuCoresEl = qs("cpuCores");
  const deviceMemEl = qs("deviceMem");
  const gpuInfoEl = qs("gpuInfo");
  const uaEl = qs("ua");
  const screenResEl = qs("screenRes");
  const assessmentEl = qs("assessment");

  // عناصر المشاركة
  const generateLinkBtn = qs("generateLink");

  // FPS loop
  let rafId = null,
    lastTime = 0,
    fpsSamples = [],
    minF = Infinity,
    running = false;

  function drawGraph() {
    if (!fpsCanvas) return;
    const ctx = fpsCanvas.getContext("2d");
    const w = fpsCanvas.width;
    const h = fpsCanvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#060606";
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = "rgba(229,57,53,0.95)";
    ctx.lineWidth = 2;

    const maxFPS = 120;
    for (let i = 0; i < fpsSamples.length; i++) {
      const val = fpsSamples[i];
      const x = (i / (fpsSamples.length - 1 || 1)) * w;
      const y = h - (Math.min(val, maxFPS) / maxFPS) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function loop(t) {
    if (!lastTime) lastTime = t;
    const delta = (t - lastTime) / 1000;
    lastTime = t;
    if (delta > 0) {
      const fps = 1 / delta;
      fpsSamples.push(Math.round(fps));
      if (fpsSamples.length > 120) fpsSamples.shift();
      minF = Math.min(minF, fps);
      const avg = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
      fpsNowEl.textContent = Math.round(fps);
      fpsAvgEl.textContent = Math.round(avg);
      fpsMinEl.textContent = Math.round(minF);
      drawGraph();
    }
    rafId = requestAnimationFrame(loop);
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (running) return;
      running = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      lastTime = 0;
      fpsSamples = [];
      minF = Infinity;
      rafId = requestAnimationFrame(loop);
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener("click", () => {
      if (rafId) cancelAnimationFrame(rafId);
      running = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
    });
  }

  // معلومات الجهاز
  function getWebGLInfo() {
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      if (!gl) return null;
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      return dbg
        ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER);
    } catch (e) {
      return null;
    }
  }

  function gatherInfo() {
    return {
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency || null,
      deviceMemory: navigator.deviceMemory || null,
      screen: {
        w: screen.width,
        h: screen.height,
        ratio: window.devicePixelRatio || 1,
      },
      gpu: getWebGLInfo(),
    };
  }

  function updateUIWithInfo(info) {
    if (uaEl) uaEl.textContent = info.userAgent;
    if (cpuCoresEl) cpuCoresEl.textContent = info.hardwareConcurrency || "--";
    if (deviceMemEl)
      deviceMemEl.textContent = info.deviceMemory
        ? info.deviceMemory + " GB"
        : "--";
    if (gpuInfoEl) gpuInfoEl.textContent = info.gpu || "--";
    if (screenResEl)
      screenResEl.textContent =
        info.screen.w + "x" + info.screen.h + " (x" + info.screen.ratio + ")";
  }

  function estimateScore(info) {
    let score = 0;
    const mem = info.deviceMemory || 0;
    const cores = info.hardwareConcurrency || 0;
    score += Math.min(mem, 16) * 6;
    score += Math.min(cores, 16) * 4;
    if (info.gpu && /rtx|radeon|nvidia|geforce/i.test(info.gpu)) score += 80;
    return Math.round(Math.min(100, score));
  }

  function buildAssessment(info) {
    if (!assessmentEl) return;
    const score = estimateScore(info);
    assessmentEl.innerHTML =
      "<h3>Device Score: " +
      score +
      "%</h3><p>" +
      (score < 50 ? "Needs Upgrade" : "Good Device") +
      "</p>";
  }

  // مشاركة الرابط
  if (generateLinkBtn) {
    generateLinkBtn.addEventListener("click", () => {
      alert(
        "Share link feature coming soon! In the future, you will get a custom URL."
      );
    });
  }

  // تشغيل عند فتح الصفحة
  const info = gatherInfo();
  updateUIWithInfo(info);
  buildAssessment(info);
})();



  // 🔹 محاكاة Task Manager (CPU/RAM/Temp)
  function simulateMetrics() {
    const cpu = Math.floor(10 + Math.random() * 70);   // 10% - 80%
    const ram = Math.floor(20 + Math.random() * 70);   // 20% - 90%
    const temp = (35 + Math.random() * 45).toFixed(1); // 35°C - 80°C

    const cpuUsageEl = document.getElementById("cpuUsage");
    const ramUsageEl = document.getElementById("ramUsage");
    const cpuTempEl = document.getElementById("cpuTemp");

    if (cpuUsageEl) cpuUsageEl.textContent = cpu + "%";
    if (ramUsageEl) ramUsageEl.textContent = ram + "%";
    if (cpuTempEl) cpuTempEl.textContent = temp + " °C";
  }

  // يحدث القيم كل ثانيتين
  simulateMetrics();
  setInterval(simulateMetrics, 2000);



// ⚠️ ضع مفتاحك هنا (للاستخدام الشخصي فقط)
// إذا رح تنشر الموقع: لازم تخليه في سيرفر وسيط وليس هنا
const OPENAI_API_KEY = "";

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender = "ai") {
  const msg = document.createElement("div");
  msg.classList.add("chat-msg", sender === "user" ? "chat-user" : "chat-ai");
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // رسالة المستخدم
  addMessage(text, "user");
  userInput.value = "";

  // رسالة انتظار
  const thinkingMsg = document.createElement("div");
  thinkingMsg.classList.add("chat-msg", "chat-ai");
  thinkingMsg.textContent = "Thinking...";
  chatBox.appendChild(thinkingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // تقدر تغيّرها حسب المتاح لك
        messages: [
          { role: "system", content: "You are an assistant inside FPS Inspector." },
          { role: "user", content: text }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await resp.json();

    if (data.error) {
      thinkingMsg.textContent = "⚠️ API Error: " + data.error.message;
    } else {
      thinkingMsg.textContent = data.choices[0].message.content;
    }

  } catch (err) {
    thinkingMsg.textContent = "⚠️ Network Error: " + err.message;
  }
}

// زر الإرسال
sendBtn.addEventListener("click", sendMessage);

// الضغط على Enter
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
