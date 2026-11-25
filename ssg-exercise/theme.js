(function () {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;

  // Read the saved theme.
  function readSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch (err) {
      console.warn("Could not read theme preference:", err);
    }
    return null;
  }

  // save the theme.
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      console.warn("Could not save theme preference:", err);
    }
  }

  // Set the logo to the correct theme
  function updateLogo(theme) {
    const sources = document.querySelectorAll(
      'picture source[srcset*="logo-dark"]',
    );
    sources.forEach(function (source) {
      source.media = theme === "dark" ? "all" : "not all";
    });
  }

  // The label describes the action the button performs.
  function updateButton(theme) {
    const button = document.getElementById("theme-toggle");
    if (!button) {
      return;
    }
    button.textContent =
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    updateLogo(theme);
    updateButton(theme);
  }

  // Default to light
  let currentTheme = readSavedTheme() || "light";

  // Runs immediately in <head>
  applyTheme(currentTheme);

  function setUpToggle() {
    const header = document.querySelector("header");
    if (!header) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.id = "theme-toggle";
    header.appendChild(button);

    button.addEventListener("click", function () {
      currentTheme = currentTheme === "dark" ? "light" : "dark";

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // apply first, so it works even if saving fails
      if (document.startViewTransition && !reduceMotion) {
        // View Transition API: cross-fade from the old theme to the new one
        document.startViewTransition(function () {
          applyTheme(currentTheme);
        });
      } else {
        // No API support or reduced motion requested, switch instantly
        applyTheme(currentTheme);
      }

      saveTheme(currentTheme);
    });

    // now DOM exists, update the logo and button label too.
    applyTheme(currentTheme);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setUpToggle);
  } else {
    setUpToggle();
  }
})();
