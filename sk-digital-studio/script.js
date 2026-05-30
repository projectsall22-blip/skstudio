// ===== PRELOADER =====
function hidePreloader() {
  document.getElementById('preloader').classList.add('hidden');
}
setTimeout(hidePreloader, 4000);
window.addEventListener('load', () => setTimeout(hidePreloader, 4000));

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();
document.querySelectorAll('a, button, .service-card, .portfolio-item, .filter-btn, .package-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}
dots.forEach(dot => dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index))));
setInterval(() => goToSlide((currentSlide + 1) % slides.length), 5500);

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + '+';
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      if (show) {
        item.style.display = 'block';
        item.style.opacity = '0'; item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1'; item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.opacity = '0'; item.style.transform = 'scale(0.9)';
        setTimeout(() => { item.style.display = 'none'; }, 400);
      }
    });
  });
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lightboxImages = [], lightboxIndex = 0;
document.querySelectorAll('.portfolio-zoom').forEach((btn, i) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    lightboxImages = Array.from(document.querySelectorAll('.portfolio-item img')).map(img => img.src);
    lightboxIndex = i;
    lightboxImg.src = lightboxImages[lightboxIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
document.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  lightboxImg.src = lightboxImages[lightboxIndex];
});
document.querySelector('.lightbox-next').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  lightboxImg.src = lightboxImages[lightboxIndex];
});
function closeLightbox() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
  if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
});

// ===== TESTIMONIALS SLIDER =====
const track = document.getElementById('testimonialTrack');
const cards = track.querySelectorAll('.testimonial-card');
const tDotsContainer = document.getElementById('tDots');
let tIndex = 0;
let cardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
const totalDots = Math.ceil(cards.length / cardsPerView);
for (let i = 0; i < totalDots; i++) {
  const d = document.createElement('span');
  d.classList.add('t-dot');
  if (i === 0) d.classList.add('active');
  d.addEventListener('click', () => goToTestimonial(i));
  tDotsContainer.appendChild(d);
}
function goToTestimonial(index) {
  tIndex = index;
  const cardWidth = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${tIndex * cardsPerView * cardWidth}px)`;
  document.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === tIndex));
}
document.querySelector('.t-prev').addEventListener('click', () => { tIndex = (tIndex - 1 + totalDots) % totalDots; goToTestimonial(tIndex); });
document.querySelector('.t-next').addEventListener('click', () => { tIndex = (tIndex + 1) % totalDots; goToTestimonial(tIndex); });
setInterval(() => { tIndex = (tIndex + 1) % totalDots; goToTestimonial(tIndex); }, 4500);

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '<span>🙏 बुकिंग Request मिल गई!</span> <i class="fas fa-check"></i>';
  btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
  btn.style.borderColor = '#2ecc71';
  setTimeout(() => {
    btn.innerHTML = '<span>🕉️ बुकिंग Request भेजें</span> <i class="fas fa-paper-plane"></i>';
    btn.style.background = '';
    btn.style.borderColor = '';
    e.target.reset();
  }, 3500);
});

// ===== BACK TO TOP =====
document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.classList.toggle('active-link', scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight);
  });
});
