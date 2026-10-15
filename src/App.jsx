import React, { useEffect } from 'react';
import { state } from './state.js';
import SkyCanvas from './components/SkyCanvas.jsx';
import MouseTrail from './components/MouseTrail.jsx';
import CursorReticle from './components/CursorReticle.jsx';
import Preloader from './components/Preloader.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Experience from './components/Experience.jsx';
import EducationJourney from './components/EducationJourney.jsx';
import SkillsCloud from './components/SkillsCloud.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const range = (v, from, to) => clamp01((v - from) / (to - from));

export default function App() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const root = document.documentElement;

    /* ---------------------------------------------------------
       Inertia scrolling
       --------------------------------------------------------- */
    const smooth = {
      enabled: finePointer && !reduceMotion,
      target: 0,
      current: 0,
      ease: 0.09,
      lastSet: -1,
      running: false,
    };

    function maxScroll() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    let smoothFrameId;
    function smoothTick() {
      const diff = smooth.target - smooth.current;
      if (Math.abs(diff) < 0.35) {
        smooth.current = smooth.target;
        smooth.running = false;
      } else {
        smooth.current += diff * smooth.ease;
      }
      smooth.lastSet = Math.round(smooth.current);
      window.scrollTo(0, smooth.current);
      if (smooth.running) {
        smoothFrameId = requestAnimationFrame(smoothTick);
      }
    }

    function startSmooth() {
      if (!smooth.running) {
        smooth.running = true;
        smoothFrameId = requestAnimationFrame(smoothTick);
      }
    }

    const onWheel = (e) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? window.innerHeight : 1;
      smooth.target = Math.min(maxScroll(), Math.max(0, smooth.target + e.deltaY * unit));
      startSmooth();
    };

    const onScroll = () => {
      if (Math.abs(window.scrollY - smooth.lastSet) > 2) {
        smooth.target = smooth.current = window.scrollY;
      }
    };

    if (smooth.enabled) {
      smooth.target = smooth.current = window.scrollY;
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    function scrollToY(y) {
      const dest = Math.min(maxScroll(), Math.max(0, y));
      if (smooth.enabled) {
        smooth.target = dest;
        startSmooth();
      } else {
        window.scrollTo({ top: dest, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }

    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      scrollToY(el.getBoundingClientRect().top + window.scrollY - 10);
    };
    document.addEventListener('click', onAnchorClick);

    /* ---------------------------------------------------------
       Pointer coordinates for 3D camera parallax
       --------------------------------------------------------- */
    const onPointerMove = (e) => {
      state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    /* ---------------------------------------------------------
       Reveal on scroll
       --------------------------------------------------------- */
    let pendingReveals = Array.from(document.querySelectorAll('.reveal'));

    function sweepReveals() {
      if (!pendingReveals.length) return;
      const line = window.innerHeight * 0.88;
      pendingReveals = pendingReveals.filter((el) => {
        if (el.getBoundingClientRect().top > line) return true;
        el.classList.add('show');
        return false;
      });
    }

    /* ---------------------------------------------------------
       The main loop
       --------------------------------------------------------- */
    const heroPin = document.getElementById('hero-pin');
    const skillsSection = document.getElementById('skills');
    let loopId;

    function tick() {
      state.scrollY = window.scrollY;
      const max = maxScroll();
      state.progress = max > 0 ? clamp01(state.scrollY / max) : 0;
      root.style.setProperty('--p', state.progress.toFixed(4));

      if (heroPin) {
        const hp = heroPin.getBoundingClientRect();
        root.style.setProperty(
          '--hero-out',
          clamp01(-hp.top / (hp.height - window.innerHeight || 1)).toFixed(4)
        );
      }

      if (skillsSection) {
        const skillsTop = skillsSection.getBoundingClientRect().top + state.scrollY;
        state.clutter =
          1 -
          range(
            state.scrollY,
            skillsTop - window.innerHeight * 1.4,
            skillsTop - window.innerHeight * 0.35
          );
      }

      if (window.__renderNameSat) {
        window.__renderNameSat(performance.now() * 0.00042);
      }
      if (window.__renderConstellation) {
        window.__renderConstellation();
      }
      sweepReveals();
      if (window.__renderCloud) {
        window.__renderCloud();
      }
      if (window.__skyUpdate) {
        window.__skyUpdate(state);
      }

      loopId = requestAnimationFrame(tick);
    }

    loopId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(loopId);
      cancelAnimationFrame(smoothFrameId);
      if (smooth.enabled) {
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('scroll', onScroll);
      }
      document.removeEventListener('click', onAnchorClick);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <SkyCanvas />
      <MouseTrail />
      <Preloader />
      <CursorReticle />
      <Header />

      <main id="top">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <EducationJourney />
        <SkillsCloud />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
