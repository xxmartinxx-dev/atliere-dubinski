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
const portTabBtns = document.querySelectorAll('.port-tab-btn');
const portfolioViews = document.querySelectorAll('.portfolio-view-panel');
const atelierContactForm = document.getElementById('atelierContactForm');
const formSuccessState = document.getElementById('formSuccessState');
const workLightbox = document.getElementById('workLightbox');
const btnCloseLightbox = document.getElementById('btnCloseLightbox');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const lbTitle = document.getElementById('lbTitle');
const lbCat = document.getElementById('lbCat');
const lbSpec = document.getElementById('lbSpec');

window.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initFilmGrain();
  initCustomCursor();
  initHeroLight();
  initScrollytellingTimelines();
  initNarrativeTracker();
  initPortfolioTabs();
  initGalleryLightbox();
  initContactForm();
  initEventListeners();
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

  const hoverables = document.querySelectorAll('a, button, input, textarea, .work-show-card, .process-deck-item, .craft-side-card');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// Interactive Light Beam in Hero
function initHeroLight() {
  const hero = document.getElementById('stage-hero');
  const lightBeam = document.getElementById('heroLightBeam');
  if (!hero || !lightBeam) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    lightBeam.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(227, 178, 90, 0.28) 0%, rgba(7, 7, 6, 0.4) 40%, rgba(7, 7, 6, 0.92) 80%)`;
  });
}

// GSAP SCROLLYTELLING PINNED TIMELINES
function initScrollytellingTimelines() {
  // 1. HERO PINNED TIMELINE
  const heroStage = document.getElementById('stage-hero');
  const heroImg = document.getElementById('heroPortraitImg');
  const heroGrain = document.getElementById('heroMacroGrain');
  const step1 = document.getElementById('heroStep1');
  const step2 = document.getElementById('heroStep2');
  const step3 = document.getElementById('heroStep3');

  if (heroStage && heroImg && step1 && step2 && step3) {
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroStage,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });

    // Step 1: ŚWIATŁO (starts visible) -> fades out
    heroTl.to(step1, { opacity: 0, y: -25, duration: 0.8, ease: 'power1.inOut' }, 0.6)
      // Step 2: PORTRET -> fades in and out
      .fromTo(step2, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power1.inOut' }, 0.9)
      .to(step2, { opacity: 0, y: -25, duration: 0.8, ease: 'power1.inOut' }, 2.0)
      // Step 3: MATERIAŁ -> fades in
      .fromTo(step3, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power1.inOut' }, 2.3)
      // Hero image zoom + grain reveal
      .to(heroImg, { scale: 1.65, ease: 'none', duration: 3.2 }, 0)
      .to(heroGrain, { opacity: 0.65, ease: 'none', duration: 3.2 }, 0);
  }

  // 2. MATERIAL PINNED TIMELINE (PAPIER HAHNEMÜHLE)
  const matStage = document.getElementById('stage-material');
  const matWord1 = document.getElementById('matWord1');
  const matWord2 = document.getElementById('matWord2');
  const matWord3 = document.getElementById('matWord3');
  const matImg = document.getElementById('materialMacroImg');
  const matCard = document.querySelector('.mat-spec-card');

  if (matStage && matWord1 && matWord2 && matWord3) {
    const matTl = gsap.timeline({
      scrollTrigger: {
        trigger: matStage,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });

    matTl.set(matWord1, { opacity: 1, color: '#f7f4ed' })
      .set(matWord2, { opacity: 0.35, color: '#9c9588' })
      .set(matWord3, { opacity: 0.35, color: '#9c9588' })
      // Highlight FAKTURA
      .to(matWord1, { opacity: 0.35, color: '#9c9588', duration: 0.8 }, 0.8)
      .to(matWord2, { opacity: 1, color: '#f7f4ed', duration: 0.8 }, 0.8)
      // Highlight MATERIAŁ
      .to(matWord2, { opacity: 0.35, color: '#9c9588', duration: 0.8 }, 1.8)
      .to(matWord3, { opacity: 1, color: '#e3b25a', duration: 0.8 }, 1.8)
      // Subtle macro parallax & spec card elevation
      .to(matImg, { scale: 1.15, y: -20, ease: 'none', duration: 2.8 }, 0)
      .fromTo(matCard, { y: 30, opacity: 0.6 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power1.out' }, 0.5);
  }

  // 3. WOOD TRANSITION PINNED TIMELINE (PAPIER -> DREWNO)
  const woodStage = document.getElementById('stage-wood-trans');
  const layerPaper = document.getElementById('transLayerPaper');
  const layerTimber = document.getElementById('transLayerTimber');
  const woodContent = document.querySelector('.wood-trans-content');

  if (woodStage && layerPaper && layerTimber) {
    const woodTl = gsap.timeline({
      scrollTrigger: {
        trigger: woodStage,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });

    woodTl.set(layerPaper, { opacity: 0.85 })
      .set(layerTimber, { opacity: 0 })
      .to(layerPaper, { opacity: 0.1, duration: 2, ease: 'power1.inOut' }, 0)
      .to(layerTimber, { opacity: 0.9, duration: 2, ease: 'power1.inOut' }, 0.4)
      .fromTo(woodContent, { scale: 0.95, opacity: 0.7 }, { scale: 1.05, opacity: 1, duration: 2.2, ease: 'power1.out' }, 0);
  }

  // 4. 3D EXPLODED ARTWORK ASSEMBLY TIMELINE
  const assemblyStage = document.getElementById('stage-assembly');
  const deck = document.getElementById('explodedDeck');
  const exFrame = document.getElementById('exLayerFrame');
  const exGlass = document.getElementById('exLayerGlass');
  const exMat = document.getElementById('exLayerMat');
  const exPrint = document.getElementById('exLayerPrint');
  const exBack = document.getElementById('exLayerBack');
  const annotations = document.querySelectorAll('.layer-annotation');

  if (assemblyStage && deck && exFrame && exGlass && exMat && exPrint && exBack) {
    const assemblyTl = gsap.timeline({
      scrollTrigger: {
        trigger: assemblyStage,
        start: 'top top',
        end: '+=240%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
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
      
      // Animate rotation towards flat front + collapse layers together
      .to(deck, { rotateX: 0, rotateY: 0, rotateZ: 0, duration: 3, ease: 'power1.inOut' }, 0.5)
      .to(exFrame, { z: 8, duration: 3, ease: 'power1.inOut' }, 0.5)
      .to(exGlass, { z: 6, duration: 3, ease: 'power1.inOut' }, 0.5)
      .to(exMat, { z: 4, duration: 3, ease: 'power1.inOut' }, 0.5)
      .to(exPrint, { z: 2, duration: 3, ease: 'power1.inOut' }, 0.5)
      .to(exBack, { z: 0, duration: 3, ease: 'power1.inOut' }, 0.5)
      .to(annotations, { opacity: 0, duration: 1.5, ease: 'power1.inOut' }, 1.2);
  }

  // 5. SCALE IN ARCHITECTURE TIMELINE
  const scaleStage = document.getElementById('stage-scale');
  const scalePhoto = document.getElementById('scaleInteriorPhoto');
  const scaleCard = document.querySelector('.scale-statement-card');

  if (scaleStage && scalePhoto) {
    const scaleTl = gsap.timeline({
      scrollTrigger: {
        trigger: scaleStage,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });

    scaleTl.fromTo(scalePhoto, { scale: 2.3 }, { scale: 1.0, duration: 3, ease: 'power1.inOut' }, 0)
      .fromTo(scaleCard, { y: 40, opacity: 0.4 }, { y: 0, opacity: 1, duration: 2, ease: 'power1.out' }, 0.5);
  }
}

// Global Header Narrative Tracker (01 to 10)
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

// Portfolio Tabs Switcher (Portret, Boudoir, Fine Art)
function initPortfolioTabs() {
  portTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');

      portTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      portfolioViews.forEach((view) => {
        if (view.id === `view-${cat}`) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });
    });
  });
}

// Work Gallery Lightbox
function initGalleryLightbox() {
  const workCards = document.querySelectorAll('.work-show-card');
  
  workCards.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const cat = card.getAttribute('data-cat');
      const spec = card.getAttribute('data-spec');

      if (lightboxImg) lightboxImg.src = img;
      if (lbTitle) lbTitle.textContent = title;
      if (lbCat) lbCat.textContent = cat;
      if (lbSpec) lbSpec.innerHTML = spec;

      if (workLightbox) {
        workLightbox.classList.add('open');
        workLightbox.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
}

function closeLightbox() {
  if (workLightbox) {
    workLightbox.classList.remove('open');
    workLightbox.setAttribute('aria-hidden', 'true');
  }
}

// Contact Form Handler
function initContactForm() {
  if (!atelierContactForm) return;

  atelierContactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    atelierContactForm.style.display = 'none';
    if (formSuccessState) {
      formSuccessState.style.display = 'block';
    }
  });
}

// General Listeners
function initEventListeners() {
  // Soundscape Toggle
  if (btnSound) {
    btnSound.addEventListener('click', () => {
      const isPlaying = soundscape.toggle();
      btnSound.classList.toggle('playing', isPlaying);
      if (soundLabel) {
        soundLabel.textContent = isPlaying ? 'DŹWIĘK: WŁ.' : 'DŹWIĘK: WYŁ.';
      }
    });
  }

  // Mobile Drawer Toggle
  if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    const closeLinks = document.querySelectorAll('[data-close-drawer]');
    closeLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // ESC Key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    }
  });
}
