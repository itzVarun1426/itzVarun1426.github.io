import React, { useEffect, useRef } from 'react';

const lerp = (a, b, t) => a + (b - a) * t;

const JOBS = [
  { org: 'NewGen Software Tech', role: 'Software Engineer', when: 'Recent' },
  { org: 'EWB Company', role: 'AWS Intern', when: 'Recent' },
  { org: 'GDGC DYPCOE', role: 'DSA & CP Lead', when: '2023 – Present' },
  { org: 'AI & CV Research', role: 'Signature Verification & Cheque Fraud Detection', when: '2024' },
  { org: 'UAV Flight Systems', role: '3D UAV Flight Path Optimization Research', when: '2024' },
  { org: 'LeetCode / CP', role: '600+ Solved // Contest Rating 1400+', when: 'Active' },
];

const ART = '/main site/img/constellations/';

const FORMATIONS = [
  {
    name: 'Orion',
    art: 'orion.png',
    stars: [
      [0.1, 0.1],
      [0.685, 0.149],
      [0.549, 0.461],
      [0.471, 0.503],
      [0.374, 0.538],
      [0.237, 0.9],
      [0.9, 0.831],
    ],
    lines: [
      [0, 1],
      [0, 4],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [2, 6],
    ],
    jobs: [0, 1, 2, 3, 4, 5],
  },
  {
    name: 'Cassiopeia',
    art: 'cassiopeia.png',
    stars: [
      [0.1, 0.1],
      [0.314, 0.486],
      [0.534, 0.43],
      [0.664, 0.9],
      [0.9, 0.606],
      [0.78, 0.35],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
    jobs: [0, 1, 2, 3, 4, 5],
  },
  {
    name: 'Ursa Major',
    art: 'ursamajor.png',
    stars: [
      [0.889, 0.1],
      [0.899, 0.446],
      [0.647, 0.618],
      [0.545, 0.403],
      [0.356, 0.472],
      [0.21, 0.538],
      [0.1, 0.9],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
    jobs: [0, 1, 2, 3, 4, 5],
  },
  {
    name: 'Perseus',
    art: 'perseus.png',
    stars: [
      [0.9, 0.1],
      [0.609, 0.315],
      [0.328, 0.439],
      [0.852, 0.844],
      [0.1, 0.9],
      [0.48, 0.7],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 4],
      [1, 3],
      [2, 5],
    ],
    jobs: [0, 1, 2, 3, 4, 5],
  },
  {
    name: 'Leo',
    art: 'leo.png',
    stars: [
      [0.9, 0.1],
      [0.679, 0.367],
      [0.755, 0.9],
      [0.327, 0.32],
      [0.1, 0.724],
      [0.52, 0.65],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
      [4, 2],
      [3, 5],
    ],
    jobs: [0, 1, 2, 3, 4, 5],
  },
];

export default function Experience() {
  const stageRef = useRef(null);
  const constLinesRef = useRef(null);
  const constTiesRef = useRef(null);
  const constMinorRef = useRef(null);
  const constFigRef = useRef(null);
  const constImgRef = useRef(null);
  const constNameRef = useRef(null);
  const constSubRef = useRef(null);
  const constDotsRef = useRef(null);

  useEffect(() => {
    const constStage = stageRef.current;
    const constLines = constLinesRef.current;
    const constTies = constTiesRef.current;
    const constMinor = constMinorRef.current;
    const constFig = constFigRef.current;
    const constImg = constImgRef.current;
    const constNameEl = constNameRef.current;
    const constSubEl = constSubRef.current;
    const constDots = constDotsRef.current;
    if (!constStage || !constLines || !constTies || !constMinor || !constFig || !constNameEl || !constSubEl || !constDots) {
      return;
    }

    const SVGNS = 'http://www.w3.org/2000/svg';
    let formIndex = 0;
    let figTimer = 0;
    const stars = [];
    const pos = JOBS.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));
    const labelOff = JOBS.map(() => ({ dx: 16, dy: -20, w: 0, h: 0 }));

    // Create star elements in stage
    JOBS.forEach((job, i) => {
      const star = document.createElement('div');
      star.className = 'star';
      star.innerHTML =
        '<button class="star-hit" aria-label="' +
        job.org +
        '"></button>' +
        '<span class="star-dot"></span>' +
        '<span class="star-label"><span class="star-org"></span>' +
        '<span class="star-role"></span><span class="star-when"></span></span>';
      star.querySelector('.star-org').textContent = job.org;
      star.querySelector('.star-role').textContent = job.role;
      star.querySelector('.star-when').textContent = job.when;
      const hit = star.querySelector('.star-hit');
      const on = () => stars.forEach((s, n) => s.classList.toggle('on', n === i));
      hit.addEventListener('pointerenter', on);
      hit.addEventListener('focus', on);
      constStage.appendChild(star);
      stars.push(star);
    });

    // Create dots
    constDots.replaceChildren();
    FORMATIONS.forEach((f, i) => {
      const d = document.createElement('button');
      d.setAttribute('aria-label', f.name);
      d.addEventListener('click', () => setFormation(i));
      constDots.appendChild(d);
    });

    function constBox() {
      const r = constStage.getBoundingClientRect();
      const padX = Math.min(170, r.width * 0.17);
      const padY = Math.min(70, r.height * 0.11);
      const availW = Math.max(60, r.width - padX * 2);
      const availH = Math.max(60, r.height - padY * 2);
      let w = availW,
        h = w * 0.75;
      if (h > availH) {
        h = availH;
        w = h / 0.75;
      }
      return { x: (r.width - w) / 2, y: (r.height - h) / 2, w, h, sw: r.width, sh: r.height };
    }

    function layoutLabels(box) {
      const placed = [];
      const order = stars.map((_, i) => i).sort((a, b) => pos[a].ty - pos[b].ty);

      for (const i of order) {
        const el = stars[i].querySelector('.star-label');
        const lw = el.offsetWidth,
          lh = el.offsetHeight;
        const sx = pos[i].tx,
          sy = pos[i].ty;
        const gap = 16;
        const sides = sx > box.sw / 2 ? ['left', 'right'] : ['right', 'left'];

        const cands = [];
        for (const side of sides) {
          for (const dy of [0, -0.55, 0.55, -1.05, 1.05, -1.6, 1.6, -2.2, 2.2, -2.9, 2.9]) {
            cands.push({
              side,
              lx: side === 'right' ? sx + gap : sx - gap - lw,
              ly: sy - lh / 2 + dy * lh,
            });
          }
        }
        for (const dx of [0, -0.3, 0.3]) {
          cands.push({ side: 'right', lx: sx - lw / 2 + dx * lw, ly: sy - lh - 20 });
          cands.push({ side: 'right', lx: sx - lw / 2 + dx * lw, ly: sy + 20 });
        }

        const overlapArea = (c) =>
          placed.reduce((sum, p) => {
            const ox = Math.min(c.lx + lw, p.x + p.w) - Math.max(c.lx, p.x);
            const oy = Math.min(c.ly + lh, p.y + p.h) - Math.max(c.ly, p.y);
            return sum + (ox > 0 && oy > 0 ? ox * oy : 0);
          }, 0);

        let best = null,
          bestScore = Infinity;
        for (const c of cands) {
          if (c.lx < 2 || c.lx + lw > box.sw - 2 || c.ly < 2 || c.ly + lh > box.sh - 2) continue;
          const score = overlapArea(c);
          if (score === 0) {
            best = c;
            break;
          }
          if (score < bestScore) {
            bestScore = score;
            best = c;
          }
        }
        if (!best) {
          best = { ...cands[0] };
          best.lx = Math.max(2, Math.min(best.lx, box.sw - lw - 2));
          best.ly = Math.max(2, Math.min(best.ly, box.sh - lh - 2));
        }

        placed.push({ x: best.lx, y: best.ly, w: lw, h: lh });
        stars[i].dataset.side = best.side;
        el.style.setProperty('--lx', (best.lx - sx).toFixed(1) + 'px');
        el.style.setProperty('--ly', (best.ly - sy).toFixed(1) + 'px');
        labelOff[i] = { dx: best.lx - sx, dy: best.ly - sy, w: lw, h: lh };
      }
    }

    function setFormation(i) {
      formIndex = (i + FORMATIONS.length) % FORMATIONS.length;
      const f = FORMATIONS[formIndex];
      constNameEl.textContent = f.name;
      constSubEl.textContent = formIndex + 1 + ' of ' + FORMATIONS.length;
      Array.from(constDots.children).forEach((d, n) =>
        d.setAttribute('aria-current', n === formIndex ? 'true' : 'false')
      );
      if (constImg) {
        constImg.style.opacity = '0';
        clearTimeout(figTimer);
        figTimer = setTimeout(() => {
          constImg.src = ART + f.art;
          constImg.style.opacity = '0.88';
        }, 180);
      }

      const box = constBox();
      const grow = 0.22;
      constFig.style.left = box.x - (box.w * grow) / 2 + 'px';
      constFig.style.top = box.y - (box.h * grow) / 2 + 'px';
      constFig.style.width = box.w * (1 + grow) + 'px';
      constFig.style.height = box.h * (1 + grow) + 'px';

      f.jobs.forEach((si, n) => {
        pos[n].tx = box.x + f.stars[si][0] * box.w;
        pos[n].ty = box.y + f.stars[si][1] * box.h;
      });

      constMinor.replaceChildren();
      f.stars.forEach((pt, si) => {
        if (f.jobs.includes(si)) return;
        const c = document.createElementNS(SVGNS, 'circle');
        c.setAttribute('cx', box.x + pt[0] * box.w);
        c.setAttribute('cy', box.y + pt[1] * box.h);
        c.setAttribute('r', 2.6);
        c.setAttribute('class', 'const-minor-star');
        constMinor.appendChild(c);
      });

      constTies.replaceChildren();
      stars.forEach(() => {
        const l = document.createElementNS(SVGNS, 'line');
        l.setAttribute('class', 'const-tie');
        constTies.appendChild(l);
      });

      constLines.replaceChildren();
      f.lines.forEach(() => {
        const l = document.createElementNS(SVGNS, 'line');
        l.setAttribute('class', 'const-line');
        constLines.appendChild(l);
      });

      constStage.dataset.box = JSON.stringify(box);
      layoutLabels(box);
    }

    function starXY(f, si, box) {
      const j = f.jobs.indexOf(si);
      if (j >= 0) return [pos[j].x, pos[j].y];
      return [box.x + f.stars[si][0] * box.w, box.y + f.stars[si][1] * box.h];
    }

    window.__renderConstellation = function () {
      if (!constStage.offsetWidth) return;
      for (const p of pos) {
        p.x = lerp(p.x, p.tx, 0.09);
        p.y = lerp(p.y, p.ty, 0.09);
      }
      stars.forEach((s, i) => {
        s.style.transform = `translate(${pos[i].x}px, ${pos[i].y}px)`;
      });

      const f = FORMATIONS[formIndex];
      const box = constStage.dataset.box ? JSON.parse(constStage.dataset.box) : constBox();

      const ties = constTies.children;
      stars.forEach((_, i) => {
        const t = ties[i];
        if (!t) return;
        const o = labelOff[i];
        const sx = pos[i].x,
          sy = pos[i].y;
        const cx = Math.max(sx + o.dx, Math.min(sx, sx + o.dx + o.w));
        const cy = Math.max(sy + o.dy, Math.min(sy, sy + o.dy + o.h));
        const far = Math.hypot(cx - sx, cy - sy) > 13;
        t.setAttribute('x1', sx);
        t.setAttribute('y1', sy);
        t.setAttribute('x2', cx);
        t.setAttribute('y2', cy);
        t.style.opacity = far ? 1 : 0;
      });

      const segs = constLines.children;
      f.lines.forEach((seg, n) => {
        const a = starXY(f, seg[0], box),
          b = starXY(f, seg[1], box);
        const l = segs[n];
        if (!l) return;
        l.setAttribute('x1', a[0]);
        l.setAttribute('y1', a[1]);
        l.setAttribute('x2', b[0]);
        l.setAttribute('y2', b[1]);
      });
    };

    const prevBtn = document.getElementById('const-prev');
    const nextBtn = document.getElementById('const-next');
    const onPrev = () => setFormation(formIndex - 1);
    const onNext = () => setFormation(formIndex + 1);
    if (prevBtn) prevBtn.addEventListener('click', onPrev);
    if (nextBtn) nextBtn.addEventListener('click', onNext);

    let startX = null,
      startY = null,
      done = false;
    const onPointerDown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
      done = false;
    };
    const onPointerMove = (e) => {
      if (startX === null || done) return;
      const dx = e.clientX - startX,
        dy = e.clientY - startY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
        setFormation(formIndex + (dx < 0 ? 1 : -1));
        done = true;
      }
    };
    const onPointerEnd = () => {
      startX = null;
    };
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') setFormation(formIndex - 1);
      if (e.key === 'ArrowRight') setFormation(formIndex + 1);
    };

    constStage.addEventListener('pointerdown', onPointerDown);
    constStage.addEventListener('pointermove', onPointerMove);
    constStage.addEventListener('pointerup', onPointerEnd);
    constStage.addEventListener('pointercancel', onPointerEnd);
    constStage.addEventListener('pointerleave', onPointerEnd);
    constStage.addEventListener('keydown', onKeyDown);

    const onResize = () => {
      setFormation(formIndex);
    };
    window.addEventListener('resize', onResize);

    // Preload constellation images
    FORMATIONS.forEach((f) => {
      const img = new Image();
      img.src = ART + f.art;
    });

    setFormation(0);

    return () => {
      clearTimeout(figTimer);
      if (prevBtn) prevBtn.removeEventListener('click', onPrev);
      if (nextBtn) nextBtn.removeEventListener('click', onNext);
      constStage.removeEventListener('pointerdown', onPointerDown);
      constStage.removeEventListener('pointermove', onPointerMove);
      constStage.removeEventListener('pointerup', onPointerEnd);
      constStage.removeEventListener('pointercancel', onPointerEnd);
      constStage.removeEventListener('pointerleave', onPointerEnd);
      constStage.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      window.__renderConstellation = null;
      stars.forEach((s) => s.remove());
    };
  }, []);

  return (
    <section className="section" id="experience">
      <h2 className="section-title reveal" data-delay="1">
        Experience
      </h2>

      <div className="reveal" data-delay="2">
        <div
          className="const-stage"
          id="const-stage"
          ref={stageRef}
          tabIndex={0}
          role="group"
          aria-label="Constellation of roles. Use left and right arrow keys to change formation."
        >
          <div
            className="const-figure"
            id="const-fig"
            ref={constFigRef}
            aria-hidden="true"
            style={{
              pointerEvents: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
          >
            <img
              id="const-img"
              ref={constImgRef}
              className="const-art-img"
              alt=""
              src="/main site/img/constellations/orion.png"
              draggable="false"
              style={{
                pointerEvents: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                WebkitUserDrag: 'none',
              }}
            />
          </div>
          <svg className="const-svg" id="const-svg" aria-hidden="true">
            <g id="const-ties" ref={constTiesRef}></g>
            <g id="const-lines" ref={constLinesRef}></g>
            <g id="const-minor" ref={constMinorRef}></g>
          </svg>
        </div>

        <div className="const-head">
          <button className="const-arrow" id="const-prev" aria-label="Previous constellation">
            &#8592;
          </button>
          <div className="const-title">
            <p className="const-name" id="const-name" ref={constNameRef}>
              Orion
            </p>
            <p className="const-sub" id="const-sub" ref={constSubRef}>
              1 of 5
            </p>
          </div>
          <button className="const-arrow" id="const-next" aria-label="Next constellation">
            &#8594;
          </button>
        </div>
        <div className="const-dots" id="const-dots" ref={constDotsRef}></div>
      </div>
    </section>
  );
}
