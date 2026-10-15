import React, { useEffect, useRef } from 'react';

export default function Hero() {
  const heroTagTextRef = useRef(null);
  const heroTagRef = useRef(null);
  const heroNameRef = useRef(null);
  const heroNameWrapRef = useRef(null);
  const nameSatRef = useRef(null);

  useEffect(() => {
    // 1. Aceternity Encrypted Text
    const el = heroTagTextRef.current;
    const container = heroTagRef.current;

    const targetText = 'Cloud & DevOps Engineer // AI & Cloud Systems';
    const DEFAULT_CHARSET =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?';
    const revealDelayMs = 45;
    const flipDelayMs = 40;
    const holdTimeMs = 4500;

    function getRandomChar(charset) {
      return charset.charAt(Math.floor(Math.random() * charset.length));
    }

    function generateGibberish(original, charset) {
      let res = '';
      for (let i = 0; i < original.length; i++) {
        res += original[i] === ' ' ? ' ' : getRandomChar(charset);
      }
      return res;
    }

    function escapeHtml(s) {
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    let animFrame = null;
    let repeatTimer = null;
    let isEncrypting = false;

    function runEncryption() {
      if (!el) return;
      if (animFrame) cancelAnimationFrame(animFrame);
      if (repeatTimer) clearTimeout(repeatTimer);

      isEncrypting = true;
      const totalLen = targetText.length;
      const scrambleChars = generateGibberish(targetText, DEFAULT_CHARSET).split('');
      const startTime = performance.now();
      let lastFlip = startTime;

      function render(revealedCount) {
        let out = '';
        for (let i = 0; i < totalLen; i++) {
          const char = targetText[i];
          if (i < revealedCount) {
            out +=
              '<span class="aceternity-revealed">' +
              (char === ' ' ? '&nbsp;' : escapeHtml(char)) +
              '</span>';
          } else {
            const disp =
              char === ' ' ? '&nbsp;' : escapeHtml(scrambleChars[i] || getRandomChar(DEFAULT_CHARSET));
            out += '<span class="aceternity-encrypted">' + disp + '</span>';
          }
        }
        el.innerHTML = out;
      }

      function step(now) {
        const elapsed = now - startTime;
        const currentReveal = Math.min(totalLen, Math.floor(elapsed / revealDelayMs));

        if (now - lastFlip >= flipDelayMs) {
          for (let i = currentReveal; i < totalLen; i++) {
            if (targetText[i] !== ' ') {
              scrambleChars[i] = getRandomChar(DEFAULT_CHARSET);
            }
          }
          lastFlip = now;
        }

        render(currentReveal);

        if (currentReveal < totalLen) {
          animFrame = requestAnimationFrame(step);
        } else {
          isEncrypting = false;
          repeatTimer = setTimeout(() => {
            runEncryption();
          }, holdTimeMs);
        }
      }

      animFrame = requestAnimationFrame(step);
    }

    const onLaunchReadyEnc = () => {
      setTimeout(runEncryption, 100);
    };
    window.addEventListener('launchReady', onLaunchReadyEnc, { once: true });
    const fallbackEnc = setTimeout(() => {
      if (!isEncrypting && el && el.children.length === 0) runEncryption();
    }, 1200);

    const onMouseEnterEnc = () => {
      if (!isEncrypting) runEncryption();
    };
    const onClickEnc = () => {
      runEncryption();
    };

    if (container) {
      container.addEventListener('mouseenter', onMouseEnterEnc);
      container.addEventListener('click', onClickEnc);
    }

    // 2. Aceternity Typewriter Effect
    const heroName = heroNameRef.current;
    let stopTypewriter = false;

    if (heroName) {
      const rawText = heroName.dataset.text || 'Varun Nagote';
      const words = rawText.split(' ');
      const typeSpeedMs = 95;
      const backSpeedMs = 40;
      const holdTimeMsType = 3500;
      const pauseBeforeMs = 500;

      heroName.innerHTML = '';
      const charNodes = [];

      words.forEach((word, wIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'typewriter-word';

        for (let i = 0; i < word.length; i++) {
          const cSpan = document.createElement('span');
          cSpan.className = 'typewriter-char';
          cSpan.textContent = word[i];
          wordSpan.appendChild(cSpan);
          charNodes.push(cSpan);
        }
        heroName.appendChild(wordSpan);

        if (wIdx < words.length - 1) {
          const spSpan = document.createElement('span');
          spSpan.className = 'typewriter-space';
          spSpan.innerHTML = '&nbsp;';
          heroName.appendChild(spSpan);
          charNodes.push(spSpan);
        }
      });

      const cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      heroName.appendChild(cursor);

      function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
      }

      async function runTypewriterLoop() {
        while (!stopTypewriter) {
          for (let i = 0; i < charNodes.length; i++) {
            if (stopTypewriter) return;
            charNodes[i].classList.add('typed');
            await sleep(typeSpeedMs);
          }

          await sleep(holdTimeMsType);
          if (stopTypewriter) return;

          for (let i = charNodes.length - 1; i >= 0; i--) {
            if (stopTypewriter) return;
            charNodes[i].classList.remove('typed');
            await sleep(backSpeedMs);
          }

          await sleep(pauseBeforeMs);
        }
      }

      let hasStarted = false;
      const startTypewriter = () => {
        if (hasStarted) return;
        hasStarted = true;
        runTypewriterLoop();
      };

      window.addEventListener('launchReady', () => setTimeout(startTypewriter, 200), { once: true });
      setTimeout(startTypewriter, 1200);
    }

    // 3. Satellite in orbit
    const nameWrap = heroNameWrapRef.current;
    const nameSat = nameSatRef.current;
    let satCachedW = 0,
      satCachedH = 0;

    window.__renderNameSat = function (t) {
      if (!nameWrap || !nameSat || !nameWrap.offsetWidth) return;
      if (nameWrap.offsetWidth > satCachedW) satCachedW = nameWrap.offsetWidth;
      if (nameWrap.offsetHeight > satCachedH) satCachedH = nameWrap.offsetHeight;
      const w = satCachedW || nameWrap.offsetWidth,
        h = satCachedH || nameWrap.offsetHeight;
      const a = t * 0.5;
      const depth = (Math.cos(a) + 1) / 2;
      const x = w / 2 + Math.sin(a) * (w * 0.56);
      const y = h / 2 + Math.cos(a) * (h * 0.62);
      const scale = 0.65 + depth * 0.5;

      nameSat.style.transform = `translate(${x}px, ${y}px) scale(${scale.toFixed(3)}) rotate(${(Math.sin(a) * 16).toFixed(2)}deg)`;
      nameSat.style.zIndex = depth > 0.5 ? 3 : 1;
      nameSat.style.filter = `brightness(${(0.55 + depth * 0.45).toFixed(2)})`;
    };

    // 4. Hero glow
    const onMouseMoveGlow = (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!nameWrap) return;
      const rect = nameWrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      nameWrap.style.setProperty('--mouse-x', Math.max(-50, Math.min(150, x)) + '%');
      nameWrap.style.setProperty('--mouse-y', Math.max(-50, Math.min(150, y)) + '%');
    };
    document.addEventListener('mousemove', onMouseMoveGlow);

    return () => {
      clearTimeout(fallbackEnc);
      if (animFrame) cancelAnimationFrame(animFrame);
      if (repeatTimer) clearTimeout(repeatTimer);
      if (container) {
        container.removeEventListener('mouseenter', onMouseEnterEnc);
        container.removeEventListener('click', onClickEnc);
      }
      stopTypewriter = true;
      document.removeEventListener('mousemove', onMouseMoveGlow);
      window.__renderNameSat = null;
    };
  }, []);

  return (
    <section className="hero-pin" id="hero-pin">
      <div className="hero-stage">
        <div className="hero-inner">
          <div
            className="hero-tag"
            id="hero-tag"
            ref={heroTagRef}
            title="Click or hover to re-encrypt"
          >
            <i aria-hidden="true"></i>
            <span className="hero-tag-text" id="hero-tag-text" ref={heroTagTextRef}>
              <h3>
                <b>Cloud &amp; DevOps Engineer // AI &amp; Cloud Systems</b>
              </h3>
            </span>
          </div>

          <div className="hero-name-wrap" id="hero-name-wrap" ref={heroNameWrapRef}>
            <h1
              className="hero-name"
              id="hero-name"
              ref={heroNameRef}
              data-text="Varun Nagote"
            ></h1>

            <div className="name-sat" id="name-sat" ref={nameSatRef} aria-hidden="true">
              <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* solar panels */}
                <rect
                  x="2"
                  y="22"
                  width="30"
                  height="16"
                  rx="1.5"
                  fill="#1e3f8f"
                  stroke="#8fcaff"
                  strokeWidth="1.2"
                />
                <line x1="12" y1="22" x2="12" y2="38" stroke="#8fcaff" strokeWidth="0.8" />
                <line x1="22" y1="22" x2="22" y2="38" stroke="#8fcaff" strokeWidth="0.8" />
                <rect
                  x="68"
                  y="22"
                  width="30"
                  height="16"
                  rx="1.5"
                  fill="#1e3f8f"
                  stroke="#8fcaff"
                  strokeWidth="1.2"
                />
                <line x1="78" y1="22" x2="78" y2="38" stroke="#8fcaff" strokeWidth="0.8" />
                <line x1="88" y1="22" x2="88" y2="38" stroke="#8fcaff" strokeWidth="0.8" />
                {/* booms */}
                <line x1="32" y1="30" x2="40" y2="30" stroke="#cddffa" strokeWidth="1.6" />
                <line x1="60" y1="30" x2="68" y2="30" stroke="#cddffa" strokeWidth="1.6" />
                {/* bus */}
                <rect
                  x="40"
                  y="20"
                  width="20"
                  height="20"
                  rx="2.5"
                  fill="#dbe6f7"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
                <rect x="44" y="24" width="12" height="6" rx="1" fill="#3b86ff" />
                {/* dish */}
                <ellipse
                  cx="50"
                  cy="14"
                  rx="8"
                  ry="4"
                  fill="#eef4ff"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <line x1="50" y1="18" x2="50" y2="21" stroke="#ffffff" strokeWidth="1.4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="scroll-cue">
          <span>Scroll</span>
          <i></i>
        </div>
      </div>
    </section>
  );
}
