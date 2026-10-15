import React, { useEffect, useRef } from 'react';
import { state } from '../state.js';

const lerp = (a, b, t) => a + (b - a) * t;

export default function Preloader() {
  const preloaderRef = useRef(null);
  const preFillRef = useRef(null);
  const preStatusRef = useRef(null);
  const preCountRef = useRef(null);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const preFill = preFillRef.current;
    const preStatus = preStatusRef.current;
    const preCount = preCountRef.current;
    if (!preloader || !preFill || !preStatus || !preCount) return;

    let loaded = 0;
    let shown = 0;
    const bump = () => {
      loaded = Math.min(100, loaded + 100 / 3);
    };

    (document.fonts ? document.fonts.ready : Promise.resolve()).then(bump);
    Promise.all(
      Array.from(document.images).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.addEventListener('load', res, { once: true });
              img.addEventListener('error', res, { once: true });
            })
      )
    ).then(bump);

    window.addEventListener('sky-ready', bump, { once: true });
    const maxTimeout = setTimeout(() => {
      loaded = 100;
    }, 2500);

    const LAUNCH_MS = 2400;
    let counting = true;
    let preTickId;
    let launchFlyId;

    function beginLaunch() {
      if (!counting) return;
      counting = false;
      const t0 = performance.now();
      preCount.textContent = '100';
      preStatus.textContent = 'Ignition';

      function fly(now) {
        const t = Math.min(1, (now - t0) / LAUNCH_MS);
        state.launchT = t;
        if (t > 0.12 && preStatus.textContent !== 'Liftoff') {
          preStatus.textContent = 'Liftoff';
        }
        if (t > 0.45) {
          preloader.classList.add('done');
          document.body.classList.remove('loading');
          const heroName = document.getElementById('hero-name');
          if (heroName) heroName.classList.add('lit');
          window.dispatchEvent(new CustomEvent('launchReady'));
        }
        if (t < 1) {
          launchFlyId = requestAnimationFrame(fly);
        } else {
          state.launchT = 1;
          preloader.style.display = 'none';
        }
      }

      launchFlyId = requestAnimationFrame(fly);
    }

    function preTick() {
      if (!counting) return;
      shown = lerp(shown, loaded, 0.08);
      if (loaded >= 100 && shown > 99) shown = 100;
      preFill.style.right = 100 - shown + '%';
      preCount.textContent = String(Math.min(99, Math.round(shown))).padStart(2, '0');
      if (shown >= 99.5) {
        setTimeout(() => {
          if (counting) beginLaunch();
        }, 180);
      } else {
        preTickId = requestAnimationFrame(preTick);
      }
    }

    preTickId = requestAnimationFrame(preTick);

    return () => {
      clearTimeout(maxTimeout);
      cancelAnimationFrame(preTickId);
      cancelAnimationFrame(launchFlyId);
      window.removeEventListener('sky-ready', bump);
    };
  }, []);

  return (
    <div className="preloader" id="preloader" ref={preloaderRef}>
      <div className="pre-inner">
        <p className="pre-mark">Varun Nagote</p>
        <div className="pre-rule">
          <span id="pre-bar-fill" ref={preFillRef}></span>
        </div>
        <div className="pre-foot">
          <span className="pre-status" id="pre-status" ref={preStatusRef}>
            Systems check
          </span>
          <span className="pre-count" id="pre-count" ref={preCountRef}>
            00
          </span>
        </div>
      </div>
    </div>
  );
}
