import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundscape } from './soundscape.js';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

// DOM Elements
const cursorDot = document.getElementById('cursorDot');
const cursorCircle = document.getElementById('cursorCircle');
const grainCanvas = document.getElementById('grainCanvas');
const siteHeader = document.getElementById('siteHeader');
const currentTrackNum = document.getElementById('currentTrackNum');
const currentTrackLabel = document.getElementById('currentTrackLabel');
const btnSound = document.getElementById('btnSound');
const soundLabel = document.getElementById('soundLabel');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const atelierContactForm = document.getElementById('atelierContactForm');
const formSuccessState = document.getElementById('formSuccessState');

window.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initFilmGrain();
  initCustomCursor();
  initHeroBackgroundSwitcher();
  initHeroInteractiveLight();
  init3DAssemblyTimeline();
  initNarrativeTracker();
  initFaqAccordion();
  initContactForm();
  initMobileDrawer();
  initSoundscape();
});

// Smooth Scroll with Lenis
function initLenis() {
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.2,
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenisInstance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// Procedural Canvas Film Grain
function initFilmGrain() {
  if (!grainCanvas) return;
  const ctx = grainCanvas.getContext('2d');
  let width, height;

  function resize() {
    width = grainCanvas.width = window.innerWidth * 0.5;
    height = grainCanvas.height = window.innerHeight * 0.5;
  }
  resize();
  window.addEventListener('resize', resize);

  function generateNoise() {
    const imgData = ctx.createImageData(width, height);
    const buffer = new Uint32Array(imgData.data.buffer);
    const len = buffer.length;
    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.08) {
        buffer[i] = 0x12ffffff;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  let frame = 0;
  function loop() {
    if (frame % 3 === 0) generateNoise();
    frame++;
    requestAnimationFrame(loop);
  }
  loop();
}

// Custom Inertia Cursor
function initCustomCursor() {
  if (!cursorDot || !cursorCircle) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let circleX = mouseX;
  let circleY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function updateCursor() {
    circleX += (mouseX - circleX) * 0.18;
    circleY += (mouseY - circleY) * 0.18;
    cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  const hoverables = document.querySelectorAll('a, button, input, textarea, .black-framed-box, .bg-switch-btn, .fear-item-card, .faq-question-btn');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// --------------------------------------------------------------------------
// 3 RÓŻNE ZDJĘCIA W TLE HERO (SWITCHER & AUTO-CYCLE)
// --------------------------------------------------------------------------
function initHeroBackgroundSwitcher() {
  const slides = document.querySelectorAll('.hero-bg-slide');
  const buttons = document.querySelectorAll('.bg-switch-btn');
  const btnPrev = document.getElementById('btnPrevBg');
  const btnNext = document.getElementById('btnNextBg');

  if (!slides.length) return;

  let currentIndex = 0;
  let cycleTimer = null;

  function setSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    buttons.forEach((btn, idx) => {
      if (idx === currentIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function startAutoCycle() {
    stopAutoCycle();
    cycleTimer = setInterval(() => {
      setSlide(currentIndex + 1);
    }, 6500);
  }

  function stopAutoCycle() {
    if (cycleTimer) {
      clearInterval(cycleTimer);
      cycleTimer = null;
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-target-slide'), 10);
      setSlide(target);
      startAutoCycle();
    });
  });

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      setSlide(currentIndex - 1);
      startAutoCycle();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      setSlide(currentIndex + 1);
      startAutoCycle();
    });
  }

  // Keyboard navigation when in hero
  window.addEventListener('keydown', (e) => {
    if (window.scrollY < window.innerHeight * 0.8) {
      if (e.key === 'ArrowRight') {
        setSlide(currentIndex + 1);
        startAutoCycle();
      } else if (e.key === 'ArrowLeft') {
        setSlide(currentIndex - 1);
        startAutoCycle();
      }
    }
  });

  startAutoCycle();
}

// Interactive Light Beam in Hero
function initHeroInteractiveLight() {
  const hero = document.getElementById('stage-hero');
  const lightBeam = document.getElementById('heroLightBeam');
  if (!hero || !lightBeam) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    lightBeam.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(227, 178, 90, 0.22) 0%, rgba(7, 7, 6, 0.35) 45%, rgba(7, 7, 6, 0.94) 85%)`;
  });
}

// --------------------------------------------------------------------------
// 3D EXPLODED ARTWORK ASSEMBLY TIMELINE (SEKCJA 09 — DZIEŁO)
// --------------------------------------------------------------------------
function init3DAssemblyTimeline() {
  const dzieloStage = document.getElementById('stage-dzielo');
  const deck = document.getElementById('explodedDeck');
  const exFrame = document.getElementById('exLayerFrame');
  const exGlass = document.getElementById('exLayerGlass');
  const exMat = document.getElementById('exLayerMat');
  const exPrint = document.getElementById('exLayerPrint');
  const exBack = document.getElementById('exLayerBack');
  const annotations = document.querySelectorAll('#stage-dzielo .layer-annotation');

  if (dzieloStage && deck && exFrame && exGlass && exMat && exPrint && exBack) {
    const assemblyTl = gsap.timeline({
      scrollTrigger: {
        trigger: dzieloStage,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1.2
      }
    });

    // Start exploded in 3D
    assemblyTl.set(deck, { rotateX: 24, rotateY: -26, rotateZ: 5 })
      .set(exFrame, { z: 180 })
      .set(exGlass, { z: 100 })
      .set(exMat, { z: 30 })
      .set(exPrint, { z: -40 })
      .set(exBack, { z: -120 })
      .set(annotations, { opacity: 1 })
      
      // Animate rotation towards flat front + collapse layers together into finished black frame
      .to(deck, { rotateX: 0, rotateY: 0, rotateZ: 0, duration: 3, ease: 'power1.inOut' }, 0.2)
      .to(exFrame, { z: 8, duration: 3, ease: 'power1.inOut' }, 0.2)
      .to(exGlass, { z: 6, duration: 3, ease: 'power1.inOut' }, 0.2)
      .to(exMat, { z: 4, duration: 3, ease: 'power1.inOut' }, 0.2)
      .to(exPrint, { z: 2, duration: 3, ease: 'power1.inOut' }, 0.2)
      .to(exBack, { z: 0, duration: 3, ease: 'power1.inOut' }, 0.2)
      .to(annotations, { opacity: 0, duration: 1.5, ease: 'power1.inOut' }, 1.0);
  }
}

// --------------------------------------------------------------------------
// GLOBAL HEADER NARRATIVE TRACKER (13 STAGES)
// --------------------------------------------------------------------------
function initNarrativeTracker() {
  const stages = document.querySelectorAll('.story-stage, .story-stage-auto');
  
  stages.forEach((stage) => {
    const num = stage.getAttribute('data-track-num');
    const label = stage.getAttribute('data-track-label');

    ScrollTrigger.create({
      trigger: stage,
      start: 'top 45%',
      end: 'bottom 45%',
      onEnter: () => updateTracker(num, label),
      onEnterBack: () => updateTracker(num, label)
    });
  });

  ScrollTrigger.create({
    start: 'top -50',
    onUpdate: (self) => {
      if (self.progress > 0) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  });
}

function updateTracker(num, label) {
  if (currentTrackNum && num) currentTrackNum.textContent = num;
  if (currentTrackLabel && label) currentTrackLabel.textContent = label;
}

// --------------------------------------------------------------------------
// SEKCJA 12 — FAQ ACCORDION INTERACTIVITY
// --------------------------------------------------------------------------
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item-box');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer-pane');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordions
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question-btn');
          const otherAns = other.querySelector('.faq-answer-pane');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = '0px';
        }
      });

      if (isActive) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });
}

// --------------------------------------------------------------------------
// CONTACT FORM
// --------------------------------------------------------------------------
function initContactForm() {
  if (!atelierContactForm) return;

  atelierContactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = atelierContactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'PRZESYŁANIE WIADOMOŚCI...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      atelierContactForm.style.display = 'none';
      if (formSuccessState) {
        formSuccessState.style.display = 'block';
        gsap.fromTo(formSuccessState, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 });
      }
    }, 900);
  });
}

// Mobile Drawer Navigation
function initMobileDrawer() {
  if (!mobileMenuToggle || !mobileDrawer) return;

  mobileMenuToggle.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const drawerLinks = document.querySelectorAll('[data-close-drawer]');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

// Workshop Soundscape
function initSoundscape() {
  if (!btnSound || !soundLabel) return;

  btnSound.addEventListener('click', async () => {
    if (soundscape.isPlaying) {
      soundscape.stop();
      btnSound.classList.remove('playing');
      soundLabel.textContent = 'DŹWIĘK';
    } else {
      await soundscape.start();
      btnSound.classList.add('playing');
      soundLabel.textContent = 'DŹWIĘK: WŁ.';
    }
  });
}
