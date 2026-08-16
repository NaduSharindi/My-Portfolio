/**
 * Nadunika Sharindi — Portfolio interactions
 * - Dark mode toggle (persisted in localStorage)
 * - Mobile nav
 * - Smooth active-section highlighting
 * - Scroll fade/slide-in via Intersection Observer
 */

(() => {
  "use strict";

  /* ---------- Theme (dark / light) ---------- */
  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const THEME_KEY = "portfolio-theme";

  const getPreferredTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      const next = theme === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-label", `Switch to ${next} mode`);
    }
  };

  applyTheme(getPreferredTheme());

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  /* ---------- Mobile navigation ---------- */
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector("#nav-menu");

  const setMenuOpen = (open) => {
    nav?.classList.toggle("is-open", open);
    navToggle?.setAttribute("aria-expanded", String(open));
    navToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  navToggle?.addEventListener("click", () => {
    setMenuOpen(!nav?.classList.contains("is-open"));
  });

  // Close menu after clicking a nav link (mobile)
  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Active nav link while scrolling ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav__menu a[href^="#"]');

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const match = link.getAttribute("href") === `#${id}`;
            link.toggleAttribute("aria-current", match);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Back to top ---------- */
  // Hash links to a sticky header do not scroll the page; scroll window instead.
  const scrollToTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (history.replaceState) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener("click", scrollToTop);
  });
})();
