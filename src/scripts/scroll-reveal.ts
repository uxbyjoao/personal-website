function initScrollReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-up");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => {
    (el as HTMLElement).style.opacity = "0";
    observer.observe(el);
  });
}

// Run on initial load and after view transitions
initScrollReveal();
document.addEventListener("astro:after-swap", initScrollReveal);
