/* Harbor Holdings IP — small interactions (no frameworks) */

(function () {
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  // Mobile menu
  const menuBtn = $("#menuBtn");
  const mobilePanel = $("#mobilePanel");
  const closeMobile = () => {
    mobilePanel?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  };
  const openMobile = () => {
    mobilePanel?.classList.add("open");
    menuBtn?.setAttribute("aria-expanded", "true");
  };

  menuBtn?.addEventListener("click", () => {
    const isOpen = mobilePanel.classList.contains("open");
    isOpen ? closeMobile() : openMobile();
  });

  document.addEventListener("click", (e) => {
    if (!mobilePanel || !menuBtn) return;
    const t = e.target;
    if (mobilePanel.contains(t) || menuBtn.contains(t)) return;
    closeMobile();
  });

  // Smooth scrolling for in-page anchors
  const scrollToHash = (hash) => {
    const el = document.querySelector(hash);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      closeMobile();
      history.pushState(null, "", href);
      scrollToHash(href);
    });
  });

  // Active nav state (IntersectionObserver)
  const navLinks = $$('[data-nav-link]');
  const sections = $$("section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.02 }
    );
    sections.forEach((s) => io.observe(s));
  }

  // Reveal animations
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const rio = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.15 }
    );
    reveals.forEach((r) => rio.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add("is-visible"));
  }

  // Contact form: demo-only toast
  const form = $("#contactForm");
  const toast = (msg) => {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.setAttribute("role", "status");
      el.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%);
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(11,16,32,0.92);
        color: rgba(255,255,255,0.92);
        box-shadow: 0 18px 60px rgba(0,0,0,0.45);
        z-index: 99;
        max-width: min(520px, calc(100vw - 40px));
        font-size: 14px;
        letter-spacing: 0.01em;
      `;
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    clearTimeout(el._t);
    el._t = setTimeout(() => (el.style.opacity = "0"), 3200);
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Error delivering email - please try again");
    form.reset();
  });

  // Footer year
  const y = new Date().getFullYear();
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(y);

  // If arriving with hash, scroll with offset
  if (location.hash) {
    setTimeout(() => scrollToHash(location.hash), 80);
  }
})();
