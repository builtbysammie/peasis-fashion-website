/* ═══════════════════════════════════════════════════════════════
   PEASIS FASHION — script.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Footer year ─────────────────────────────────────────────── */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Navbar scroll state ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
function updateNav() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

/* ── Mobile menu ─────────────────────────────────────────────── */
const toggle    = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose   = document.getElementById('mobileClose');
const mobileLinks   = document.querySelectorAll('.mobile-link');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

toggle && toggle.addEventListener('click', openMenu);
mobileClose && mobileClose.addEventListener('click', closeMenu);
mobileOverlay && mobileOverlay.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

/* ── Hero slideshow ──────────────────────────────────────────── */
const allHeroImgs = Array.from(document.querySelectorAll('.hero-img'));
const heroDots    = document.querySelectorAll('.hero-dot');
let heroTimer;
let heroIndex = 0; // index within the *visible* slides array

// Returns only the slides visible at the current breakpoint
function visibleHeroSlides() {
  return allHeroImgs.filter(img => {
    const style = window.getComputedStyle(img);
    return style.display !== 'none';
  });
}

function syncDots(slides) {
  heroDots.forEach((dot, i) => {
    dot.style.display = i < slides.length ? '' : 'none';
    dot.classList.toggle('active', i === heroIndex);
  });
}

function goToSlide(idx) {
  const slides = visibleHeroSlides();
  if (!slides.length) return;
  // Remove active from all
  allHeroImgs.forEach(img => img.classList.remove('active'));
  heroIndex = ((idx % slides.length) + slides.length) % slides.length;
  slides[heroIndex].classList.add('active');
  syncDots(slides);
}

function startHero() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => goToSlide(heroIndex + 1), 5000);
}

// Initialise — set first visible slide as active
function initHero() {
  allHeroImgs.forEach(img => img.classList.remove('active'));
  heroIndex = 0;
  const slides = visibleHeroSlides();
  if (slides.length) slides[0].classList.add('active');
  syncDots(slides);
  startHero();
}

heroDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(heroTimer);
    goToSlide(i);
    startHero();
  });
});

// Init on load, re-init on resize (breakpoint may change visible set)
initHero();
let resizeHeroTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeHeroTimer);
  resizeHeroTimer = setTimeout(initHero, 200);
});

/* ── Scroll reveal (IntersectionObserver) ────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Carousel A (Signature Occasionwear) ─────────────────────── */
(function initCarouselA() {
  const wrapper  = document.getElementById('carousel-a');
  if (!wrapper) return;

  const track    = wrapper.querySelector('.carousel-track');
  const slides   = wrapper.querySelectorAll('.carousel-slide');
  const prevBtn  = wrapper.querySelector('.carousel-prev');
  const nextBtn  = wrapper.querySelector('.carousel-next');
  const dotsBar  = wrapper.querySelector('.carousel-dots-bar');

  const visibleCount = () => window.innerWidth <= 900 ? 1 : 3;
  let current = 0;

  // Build dots
  function buildDots() {
    dotsBar.innerHTML = '';
    const total = slides.length - visibleCount() + 1;
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'c-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => go(i));
      dotsBar.appendChild(d);
    }
  }

  function updateDots() {
    dotsBar.querySelectorAll('.c-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function go(idx) {
    const max = slides.length - visibleCount();
    current = Math.max(0, Math.min(idx, max));
    const slideW = slides[0].offsetWidth + 16; // gap=16
    track.style.transform = `translateX(-${current * slideW}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));

  buildDots();

  // Touch/swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener('resize', () => { buildDots(); go(0); });
})();

/* ── Cinematic Slider C (Black Edit) ─────────────────────────── */
(function initSliderC() {
  const wrapper  = document.getElementById('slider-c');
  if (!wrapper) return;

  const track    = wrapper.querySelector('.cinematic-track');
  const slides   = wrapper.querySelectorAll('.cinematic-slide');
  const prevBtn  = wrapper.querySelector('.cin-prev');
  const nextBtn  = wrapper.querySelector('.cin-next');
  const bar      = wrapper.querySelector('.cin-progress-bar');

  const visible = () => window.innerWidth <= 900 ? 1 : 2;
  let current = 0;

  function updateBar() {
    const max = slides.length - visible();
    const pct = max > 0 ? ((current / max) * 100) : 100;
    bar.style.width = pct + '%';
  }

  function go(idx) {
    const max = slides.length - visible();
    current = Math.max(0, Math.min(idx, max));
    const slideW = slides[0].offsetWidth + 24; // gap=24
    track.style.transform = `translateX(-${current * slideW}px)`;
    updateBar();
  }

  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));

  updateBar();

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener('resize', () => go(0));
})();

/* ── Video Carousel (PEASIS In Motion) ───────────────────────── */
(function initVideoCarousel() {
  const track   = document.getElementById('videoCarouselTrack');
  if (!track) return;

  const cards   = track.querySelectorAll('.video-card');
  const prevBtn = document.getElementById('vcPrev');
  const nextBtn = document.getElementById('vcNext');
  const barEl   = document.getElementById('vcProgressBar');
  const dotsEl  = document.getElementById('vcDots');

  // How many cards visible at once
  const visibleCount = () => window.innerWidth <= 900 ? 1 : 3;
  let current = 0;

  // Build dots
  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const total = Math.max(1, cards.length - visibleCount() + 1);
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'vc-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to video ${i + 1}`);
      d.addEventListener('click', () => go(i));
      dotsEl.appendChild(d);
    }
  }

  function updateUI() {
    // Progress bar
    const max = Math.max(1, cards.length - visibleCount());
    if (barEl) barEl.style.width = (current / max * 100) + '%';
    // Dots
    if (dotsEl) {
      dotsEl.querySelectorAll('.vc-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }
  }

  function go(idx) {
    const max = Math.max(0, cards.length - visibleCount());
    current = Math.max(0, Math.min(idx, max));
    // Card width + gap (20px)
    const cardW = cards[0].offsetWidth + 20;
    track.style.transform = `translateX(-${current * cardW}px)`;
    updateUI();
  }

  prevBtn && prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => go(current + 1));

  buildDots();
  updateUI();

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener('resize', () => { buildDots(); go(0); });
})();

/* ── Process timeline — scissors animation ───────────────────── */
(function initProcess() {
  const steps    = document.querySelectorAll('.process-step');
  const lineFill = document.getElementById('processLineFill');
  if (!steps.length || !lineFill) return;

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' });

  steps.forEach(s => stepObserver.observe(s));

  let lastPct = 0;
  let snipTimer;

  function updateProcessOnScroll() {
    const timelineEl = document.querySelector('.process-timeline');
    if (!timelineEl) return;

    const tlRect  = timelineEl.getBoundingClientRect();
    const windowH = window.innerHeight;
    const tlTop   = tlRect.top;
    const tlHeight = tlRect.height;

    const scrolled = Math.max(0, windowH * 0.6 - tlTop);
    const pct = Math.min(100, (scrolled / tlHeight) * 100);
    lineFill.style.height = pct + '%';

    // Trigger scissors snip when the line crosses a step marker
    if (pct > lastPct + 4) {
      clearTimeout(snipTimer);
      lineFill.classList.remove('snipping');
      // Force reflow so animation restarts
      void lineFill.offsetWidth;
      lineFill.classList.add('snipping');
      snipTimer = setTimeout(() => lineFill.classList.remove('snipping'), 400);
      lastPct = pct;
    }

    steps.forEach(step => {
      const rect = step.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      if (midpoint < windowH * 0.72) {
        step.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateProcessOnScroll, { passive: true });
  updateProcessOnScroll();
})();

/* ── Smooth anchor scrolling (offset for fixed nav) ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar ? navbar.offsetHeight : 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Horizontal scroll drag for Ankara cards ─────────────────── */
(function initDragScroll() {
  const el = document.querySelector('.horizontal-cards-scroll');
  if (!el) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  el.addEventListener('mousedown', e => {
    isDown = true;
    el.style.cursor = 'grabbing';
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });
  el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = ''; });
  el.addEventListener('mouseup',    () => { isDown = false; el.style.cursor = ''; });
  el.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.4;
    el.scrollLeft = scrollLeft - walk;
  });
})();

/* ── Lazy-load images via IntersectionObserver ───────────────── */
(function lazyImages() {
  if (!('IntersectionObserver' in window)) return;
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
        io.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  imgs.forEach(img => io.observe(img));
})();