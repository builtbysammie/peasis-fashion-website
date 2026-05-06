const loader = document.getElementById("pageLoader");
const header = document.getElementById("siteHeader");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

window.addEventListener("load", () => {
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 650);
  }
});

window.addEventListener("scroll", () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 30);
  }
});

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuBtn.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.classList.remove("open");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -80px 0px",
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const prev = carousel.querySelector(".prev");
  const next = carousel.querySelector(".next");

  if (!track || !prev || !next) return;

  const scrollAmount = () => {
    const firstCard = track.querySelector(":scope > *");
    return firstCard ? firstCard.getBoundingClientRect().width + 18 : 320;
  };

  prev.addEventListener("click", () => {
    track.scrollBy({
      left: -scrollAmount(),
      behavior: "smooth",
    });
  });

  next.addEventListener("click", () => {
    track.scrollBy({
      left: scrollAmount(),
      behavior: "smooth",
    });
  });
});