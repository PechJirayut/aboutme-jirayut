// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Navbar shadow on scroll
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  navbar.style.boxShadow = window.scrollY > 50
    ? "0 10px 30px rgba(0,0,0,0.10)"
    : "0 2px 10px rgba(0,0,0,0.08)";
});

// Fade-in on scroll
const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => observer.observe(section));

// Simple mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';

    navLinks.style.flexDirection = 'column';
    navLinks.style.gap = '14px';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.right = '20px';
    navLinks.style.background = '#fff';
    navLinks.style.padding = '14px';
    navLinks.style.borderRadius = '12px';
    navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
    navLinks.style.zIndex = '2000';
  });
}

/* ==========================
   Certificates Slider (PDF)
   Requires: certificates.js
   HTML needs:
   - #certTrack, #certDots, #certCounter
   - .cert-slider .cert-nav.prev/.next
========================== */
(function initCertSliderFromList() {
  const slider = document.querySelector('.cert-slider');
  const track = document.getElementById('certTrack');
  const dotsWrap = document.getElementById('certDots');
  const counter = document.getElementById('certCounter');

  if (!slider || !track || !dotsWrap) return;

  const certs = (window.CERTS || []).filter(x => x && x.src);
  if (!certs.length) {
    track.innerHTML = `<p style="padding:18px;color:#fff;text-align:center;">No certificates found</p>`;
    return;
  }

  // Build slides
  track.innerHTML = certs.map((c) => `
    <figure class="slide">
      <iframe class="cert-pdf" src="${c.src}" title="${c.title || 'Certificate'}"></iframe>
      <figcaption>${c.title || ''}</figcaption>
    </figure>
  `).join('');

  const slides = Array.from(track.querySelectorAll('.slide'));
  const prevBtn = slider.querySelector('.cert-nav.prev');
  const nextBtn = slider.querySelector('.cert-nav.next');

  let index = 0;

  // Build dots
  dotsWrap.innerHTML = '';
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cert-dot';
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function render() {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  prevBtn && prevBtn.addEventListener('click', prev);
  nextBtn && nextBtn.addEventListener('click', next);

  render();
})();






/* =========================
   Certificates Slider (IMG)
   Requires: certificates.js (window.CERTS)
========================= */
(function initCertSlider(){
  const slider = document.querySelector('.cert-slider');
  const track = document.getElementById('certTrack');
  const dotsWrap = document.getElementById('certDots');
  const counter = document.getElementById('certCounter');

  if (!slider || !track || !dotsWrap) return;

  const certs = (window.CERTS || []).filter(x => x && x.src);
  if (!certs.length) {
    track.innerHTML = `<p style="padding:18px;color:#fff;text-align:center;">No certificates found</p>`;
    return;
  }

  // Build slides
  track.innerHTML = certs.map((c) => `
    <figure class="cert-slide">
      <img class="cert-img" src="${c.src}" alt="${c.title || 'Certificate'}" loading="lazy">
      <figcaption class="cert-caption">${c.title || ''}</figcaption>
    </figure>
  `).join('');

  const slides = Array.from(track.querySelectorAll('.cert-slide'));
  const prevBtn = slider.querySelector('.cert-nav.prev');
  const nextBtn = slider.querySelector('.cert-nav.next');

  let index = 0;
  let timer = null;

  // Build dots
  dotsWrap.innerHTML = '';
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cert-dot';
    b.setAttribute('aria-label', `Go to certificate ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function render(){
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    render();
  }

  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  prevBtn && prevBtn.addEventListener('click', prev);
  nextBtn && nextBtn.addEventListener('click', next);

  // Keyboard support (optional)
  window.addEventListener('keydown', (e) => {
    if (!slider) return;
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  // Optional autoplay
  const autoplay = slider.dataset.autoplay === 'true';
  const interval = Number(slider.dataset.interval || 4500);

  function start(){
    if (!autoplay) return;
    stop();
    timer = setInterval(next, interval);
  }
  function stop(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  render();
  start();
})();
