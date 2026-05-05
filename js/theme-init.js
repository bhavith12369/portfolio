(function () {
  try {
    if (localStorage.getItem("portfolio-dark") === "1") {
      document.documentElement.classList.add("dark");
    }
    var accent = localStorage.getItem("portfolio-accent");
    if (accent) {
      document.documentElement.style.setProperty("--accent", accent);
    }
  } catch (e) {
    /* ignore */
  }
})();
