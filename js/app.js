(function () {
  var DARK_KEY = "portfolio-dark";
  var ACCENT_KEY = "portfolio-accent";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function setYear() {
    var el = $("#year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initNav() {
    var toggle = $(".nav-toggle");
    var nav = $("#site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
        }
      });
    });
  }

  function applyDark(isDark) {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem(DARK_KEY, isDark ? "1" : "0");
    } catch (e) {
      /* ignore */
    }
    var btn = $("#dark-mode-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
    }
  }

  function initDarkMode() {
    var btn = $("#dark-mode-toggle");
    if (!btn) return;

    var isDark = document.documentElement.classList.contains("dark");
    btn.setAttribute("aria-pressed", isDark ? "true" : "false");

    btn.addEventListener("click", function () {
      var next = !document.documentElement.classList.contains("dark");
      applyDark(next);
    });
  }

  function initAccent() {
    var input = $("#accent-color");
    if (!input) return;

    var stored = null;
    try {
      stored = localStorage.getItem(ACCENT_KEY);
    } catch (e) {
      /* ignore */
    }
    if (stored) {
      input.value = rgbToHexIfNeeded(stored);
    }

    input.addEventListener("input", function () {
      var v = input.value;
      document.documentElement.style.setProperty("--accent", v);
      try {
        localStorage.setItem(ACCENT_KEY, v);
      } catch (e) {
        /* ignore */
      }
    });
  }

  function rgbToHexIfNeeded(val) {
    if (/^#[0-9a-f]{6}$/i.test(val)) return val;
    return "#6366f1";
  }

  function initScrollAnimations() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".animate-on-scroll").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var els = document.querySelectorAll(".animate-on-scroll");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    els.forEach(function (el) {
      obs.observe(el);
    });
  }

  function showError(id, message) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.hidden = !message;
  }

  function initContactForm() {
    var form = $("#contact-form");
    if (!form) return;

    var nameInput = $("#contact-name");
    var emailInput = $("#contact-email");
    var subjectInput = $("#contact-subject");
    var messageInput = $("#contact-message");
    var successEl = $("#form-success");

    function validateName() {
      var v = (nameInput.value || "").trim();
      if (!v) {
        showError("name-error", "Please enter your name.");
        nameInput.classList.add("invalid");
        return false;
      }
      if (v.length < 2) {
        showError("name-error", "Name must be at least 2 characters.");
        nameInput.classList.add("invalid");
        return false;
      }
      showError("name-error", "");
      nameInput.classList.remove("invalid");
      return true;
    }

    function validateEmail() {
      var v = (emailInput.value || "").trim();
      if (!v) {
        showError("email-error", "Please enter your email.");
        emailInput.classList.add("invalid");
        return false;
      }
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(v)) {
        showError("email-error", "Enter a valid email address.");
        emailInput.classList.add("invalid");
        return false;
      }
      showError("email-error", "");
      emailInput.classList.remove("invalid");
      return true;
    }

    function validateSubject() {
      var v = subjectInput.value || "";
      if (v.length > 120) {
        showError("subject-error", "Subject must be 120 characters or less.");
        subjectInput.classList.add("invalid");
        return false;
      }
      showError("subject-error", "");
      subjectInput.classList.remove("invalid");
      return true;
    }

    function validateMessage() {
      var v = (messageInput.value || "").trim();
      if (!v) {
        showError("message-error", "Please enter a message.");
        messageInput.classList.add("invalid");
        return false;
      }
      if (v.length < 10) {
        showError("message-error", "Message must be at least 10 characters.");
        messageInput.classList.add("invalid");
        return false;
      }
      showError("message-error", "");
      messageInput.classList.remove("invalid");
      return true;
    }

    ["blur", "input"].forEach(function (evt) {
      nameInput.addEventListener(evt, function () {
        if (nameInput.dataset.touched === "1" || evt === "blur")
          nameInput.dataset.touched = "1";
        if (nameInput.dataset.touched === "1") validateName();
      });
    });
    ["blur", "input"].forEach(function (evt) {
      emailInput.addEventListener(evt, function () {
        if (emailInput.dataset.touched === "1" || evt === "blur")
          emailInput.dataset.touched = "1";
        if (emailInput.dataset.touched === "1") validateEmail();
      });
    });
    subjectInput.addEventListener("input", validateSubject);
    subjectInput.addEventListener("blur", validateSubject);
    ["blur", "input"].forEach(function (evt) {
      messageInput.addEventListener(evt, function () {
        if (messageInput.dataset.touched === "1" || evt === "blur")
          messageInput.dataset.touched = "1";
        if (messageInput.dataset.touched === "1") validateMessage();
      });
    });

    function getPortfolioApiBase() {
      var m = document.querySelector('meta[name="portfolio-api-base"]');
      if (!m || !m.content) return "";
      return String(m.content).trim().replace(/\/$/, "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      nameInput.dataset.touched = "1";
      emailInput.dataset.touched = "1";
      messageInput.dataset.touched = "1";

      var ok =
        validateName() &&
        validateEmail() &&
        validateSubject() &&
        validateMessage();
      if (!ok) {
        if (successEl) successEl.hidden = true;
        var srvErr = $("#form-server-error");
        if (srvErr) {
          srvErr.textContent = "";
          srvErr.hidden = true;
        }
        var firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var serverErrEl = $("#form-server-error");
      if (serverErrEl) {
        serverErrEl.textContent = "";
        serverErrEl.hidden = true;
      }
      if (successEl) successEl.hidden = true;

      var submitBtn = $("#contact-submit");
      var apiBase = getPortfolioApiBase();
      var url = apiBase + "/api/contact";
      var payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: (subjectInput.value || "").trim(),
        message: messageInput.value.trim(),
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.text().then(function (text) {
            var data = {};
            try {
              data = text ? JSON.parse(text) : {};
            } catch (ignore) {
              data = {};
            }
            return { res: res, data: data };
          });
        })
        .then(function (pair) {
          var res = pair.res;
          var data = pair.data;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send message";
          }

          if (res.ok) {
            var msg =
              data.message ||
              "Thanks — your message was received.";
            if (successEl) {
              successEl.textContent = msg;
              successEl.hidden = false;
              successEl.focus({ preventScroll: true });
            }
            form.reset();
            nameInput.classList.remove("invalid");
            emailInput.classList.remove("invalid");
            messageInput.classList.remove("invalid");
            subjectInput.classList.remove("invalid");
            showError("name-error", "");
            showError("email-error", "");
            showError("subject-error", "");
            showError("message-error", "");
            return;
          }

          var errText = "Something went wrong. Please try again.";
          if (data.errors && typeof data.errors === "object") {
            var keys = Object.keys(data.errors);
            if (keys.length) errText = String(data.errors[keys[0]]);
          } else if (data.message) errText = String(data.message);
          if (serverErrEl) {
            serverErrEl.textContent = errText;
            serverErrEl.hidden = false;
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send message";
          }
          if (serverErrEl) {
            serverErrEl.textContent =
              "Cannot reach the server. Run Spring Boot (mvn spring-boot:run from spring-portfolio) or set the portfolio-api-base meta tag to your deployed API URL.";
            serverErrEl.hidden = false;
          }
        });
    });
  }

  setYear();
  initNav();
  initDarkMode();
  initAccent();
  initScrollAnimations();
  initContactForm();
})();
