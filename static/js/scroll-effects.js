document.addEventListener("DOMContentLoaded", function () {
  /* ---- 1. Pick an animation style for each section ---- */
  var variants = {
    ".hero-text": "left",
    ".hero-stats": "right",
    ".category": "zoom",
    ".detail-container": "zoom",
    ".register-wrapper": "zoom",
    ".contact-container": "right"
  };

  Object.keys(variants).forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.setAttribute("data-anim", variants[selector]);
    });
  });

  /* ---- 2. Stagger cards that sit next to each other ---- */
  document.querySelectorAll(".re-scroll-animate").forEach(function (el) {
    if (!el.parentElement) return;
    var siblings = Array.prototype.filter.call(
      el.parentElement.children,
      function (c) { return c.classList.contains("re-scroll-animate"); }
    );
    var index = siblings.indexOf(el);
    el.style.setProperty("--re-delay", (index % 4) * 100 + "ms");
  });

  /* ---- 3. Progress bar, navbar shadow, back-to-top ---- */
  var bar = document.createElement("div");
  bar.className = "re-scroll-progress";
  document.body.appendChild(bar);

  var topBtn = document.createElement("button");
  topBtn.className = "re-back-top";
  topBtn.type = "button";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.textContent = "↑";
  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.appendChild(topBtn);

  var navbar = document.querySelector(".main-navbar");
  var ticking = false;

  function update() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? scrollTop / max : 0) + ")";
    if (navbar) navbar.classList.toggle("is-scrolled", scrollTop > 20);
    topBtn.classList.toggle("is-visible", scrollTop > 400);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
});
/* Fade up each mobile carousel as a whole */
document.addEventListener("DOMContentLoaded", function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var viewports = document.querySelectorAll(".re-home-carousel-viewport");
  if (!viewports.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle("re-vp-visible", entry.isIntersecting);
    });
  }, { threshold: 0, rootMargin: "0px 0px 15% 0px" });

  viewports.forEach(function (vp) {
    vp.classList.add("re-vp-animate");
    io.observe(vp);
  });
});
/* Mobile: once an element has been revealed, it never hides again */
document.addEventListener("DOMContentLoaded", function () {
  if (!window.matchMedia("(max-width: 900px)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("re-seen");
        seen.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px 15% 0px" });

  // Wait a moment so animation.js has already added its classes
  setTimeout(function () {
    document
      .querySelectorAll(".re-scroll-animate, .re-vp-animate")
      .forEach(function (el) { seen.observe(el); });
  }, 100);
});
/* Phone: reveal blocks as they scroll into view */
document.addEventListener("DOMContentLoaded", function () {
  if (!window.matchMedia("(max-width: 900px)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var selector = [
    ".hero-stats",
    ".section-header",
    ".category",
    ".property-card",
    ".why-card",
    ".center",
    ".footer-container > *"
  ].join(",");

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.remove("ph-hide");
      } else if (entry.boundingClientRect.top > 0) {
        // only hide again when it is below the screen (scrolling back up)
        entry.target.classList.add("ph-hide");
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(selector).forEach(function (el) {
    el.classList.add("ph-reveal");
    // hide at the start only if it is below the first screen
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add("ph-hide");
    }
    io.observe(el);
  });
});