import React, { useEffect, useRef } from 'react';

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function SkillsCloud() {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const tags = Array.from(stage.querySelectorAll('.cloud-tag'));
    const cloud = {
      rx: 200,
      ry: 200,
      maxHalf: 110,
      angleX: -0.25,
      angleY: 0,
      velX: 0.0012,
      velY: 0.0028,
      dragging: false,
      flat: false,
      lastX: 0,
      lastY: 0,
      points: [],
    };

    function sizeCloud() {
      cloud.flat = false;
      stage.classList.remove('flat');
      const r = stage.getBoundingClientRect();
      const isMobile = r.width < 580;

      const FONT_MAP = isMobile
        ? { 3: 0.74, 2: 0.60, 1: 0.50 }
        : { 3: 0.9, 2: 0.7, 1: 0.56 };

      for (const p of cloud.points) {
        p.el.style.fontSize = FONT_MAP[p.el.dataset.weight] + 'rem';
      }

      const K = isMobile ? 1.08 : 1.2;
      const OVAL = isMobile ? 1.05 : 1.18;
      const maxH = isMobile ? 65 : (cloud.maxHalf || 110);
      const roomX = (r.width / 2 - maxH - 6) / (K * OVAL);
      const roomY = (r.height / 2 - 14) / K;
      const rad = isMobile
        ? Math.max(90, Math.min(r.width * 0.35, roomX > 70 ? roomX : 105, roomY))
        : Math.max(110, Math.min(r.width * 0.36, roomX, roomY));
      cloud.rx = rad * OVAL;
      cloud.ry = rad;
    }

    function buildCloud() {
      const n = tags.length;
      cloud.points = tags.map((tag, i) => {
        const phi = Math.acos(-1 + (2 * i + 1) / n);
        const theta = Math.sqrt(n * Math.PI) * phi;
        return {
          el: tag,
          x: Math.cos(theta) * Math.sin(phi),
          y: Math.sin(theta) * Math.sin(phi),
          z: Math.cos(phi),
        };
      });
      cloud.maxHalf = Math.max(...tags.map((t) => t.offsetWidth)) / 2;
      sizeCloud();
    }

    let cloudOnScreen = false;
    const observer = new IntersectionObserver(
      ([e]) => {
        cloudOnScreen = e.isIntersecting;
      },
      { rootMargin: '15% 0px' }
    );
    observer.observe(stage);

    window.__renderCloud = function () {
      if (!cloudOnScreen || cloud.flat) return;
      const w = stage.clientWidth,
        h = stage.clientHeight;
      const cx = w / 2,
        cy = h / 2;
      const fov = cloud.rx * 1.9;

      if (!cloud.dragging) {
        cloud.angleY += cloud.velY;
        cloud.angleX += cloud.velX;
        cloud.velY = lerp(cloud.velY, 0.0028, 0.02);
        cloud.velX = lerp(cloud.velX, 0.0012, 0.02);
      }

      const cosY = Math.cos(cloud.angleY),
        sinY = Math.sin(cloud.angleY);
      const cosX = Math.cos(cloud.angleX),
        sinX = Math.sin(cloud.angleX);

      for (const p of cloud.points) {
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const X = x1 * cloud.rx,
          Y = y2 * cloud.ry,
          Z = z2 * cloud.rx;
        const scale = fov / (fov + Z);

        p.el.style.left = cx + X * scale + 'px';
        p.el.style.top = cy + Y * scale + 'px';
        p.el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        p.el.style.zIndex = Math.round(scale * 200);
        if (!p.el.classList.contains('dim')) {
          const depth = clamp01((scale - 0.5) / 0.85);
          p.el.style.opacity = (0.12 + 0.88 * depth * depth).toFixed(3);
        }
      }
    };

    const onPointerDown = (e) => {
      cloud.dragging = true;
      cloud.lastX = e.clientX;
      cloud.lastY = e.clientY;
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onPointerMove = (e) => {
      if (!cloud.dragging) return;
      const dx = e.clientX - cloud.lastX,
        dy = e.clientY - cloud.lastY;
      cloud.lastX = e.clientX;
      cloud.lastY = e.clientY;
      cloud.angleY += dx * 0.005;
      cloud.angleX -= dy * 0.005;
      cloud.velY = dx * 0.0016;
      cloud.velX = -dy * 0.0016;
    };

    const stopDragging = (e) => {
      cloud.dragging = false;
      if (e && e.pointerId) {
        try {
          stage.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
    };

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', stopDragging);
    stage.addEventListener('pointercancel', stopDragging);
    stage.addEventListener('pointerleave', stopDragging);

    const onResize = () => {
      sizeCloud();
    };
    window.addEventListener('resize', onResize);

    const filterBtns = document.querySelectorAll('.skills-filter');
    const onFilterClick = (btn) => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      tags.forEach((tag) => {
        const matches = cat === 'all' || tag.dataset.cat === cat;
        tag.classList.toggle('dim', !matches);
        tag.classList.toggle('match', matches && cat !== 'all');
      });
    };

    const handlers = [];
    filterBtns.forEach((btn) => {
      const h = () => onFilterClick(btn);
      btn.addEventListener('click', h);
      handlers.push({ btn, h });
    });

    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      buildCloud();
    });

    return () => {
      observer.disconnect();
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerup', stopDragging);
      stage.removeEventListener('pointercancel', stopDragging);
      stage.removeEventListener('pointerleave', stopDragging);
      window.removeEventListener('resize', onResize);
      handlers.forEach(({ btn, h }) => btn.removeEventListener('click', h));
      window.__renderCloud = null;
    };
  }, []);

  return (
    <section className="section" id="skills">
      <h2 className="section-title reveal" data-delay="1">
        Skills
      </h2>

      <div className="skills-filters" id="skills-filters">
        <button className="skills-filter active" data-filter="all">
          All
        </button>
        <button className="skills-filter" data-filter="languages">
          <span className="filter-dot" data-cat="languages"></span>Languages
        </button>
        <button className="skills-filter" data-filter="frontend">
          <span className="filter-dot" data-cat="frontend"></span>Frontend
        </button>
        <button className="skills-filter" data-filter="backend">
          <span className="filter-dot" data-cat="backend"></span>Backend &amp; DB
        </button>
        <button className="skills-filter" data-filter="cloud">
          <span className="filter-dot" data-cat="cloud"></span>Cloud &amp; DevOps
        </button>
        <button className="skills-filter" data-filter="other">
          <span className="filter-dot" data-cat="other"></span>AI &amp; Other
        </button>
      </div>

      <div className="cloud-stage" id="cloud-stage" ref={stageRef}>
        <div className="cloud-sphere" id="cloud-sphere">
          {/* Languages */}
          <span className="cloud-tag" data-cat="languages" data-weight="3">
            C++
          </span>
          <span className="cloud-tag" data-cat="languages" data-weight="3">
            C
          </span>
          <span className="cloud-tag" data-cat="languages" data-weight="3">
            Python
          </span>
          <span className="cloud-tag" data-cat="languages" data-weight="3">
            JavaScript
          </span>
          <span className="cloud-tag" data-cat="languages" data-weight="3">
            TypeScript
          </span>
          <span className="cloud-tag" data-cat="languages" data-weight="2">
            SQL
          </span>
          <span className="cloud-tag" data-cat="languages" data-weight="3">
            JAVA
          </span>

          {/* Frontend */}
          <span className="cloud-tag" data-cat="frontend" data-weight="3">
            React
          </span>
          <span className="cloud-tag" data-cat="frontend" data-weight="3">
            Next.js
          </span>
          <span className="cloud-tag" data-cat="frontend" data-weight="3">
            Tailwind CSS
          </span>
          <span className="cloud-tag" data-cat="frontend" data-weight="2">
            HTML
          </span>
          <span className="cloud-tag" data-cat="frontend" data-weight="2">
            CSS
          </span>
          <span className="cloud-tag" data-cat="frontend" data-weight="2">
            Vite
          </span>

          {/* Backend & Databases */}
          <span className="cloud-tag" data-cat="backend" data-weight="3">
            Node.js
          </span>
          <span className="cloud-tag" data-cat="backend" data-weight="3">
            Express.js
          </span>
          <span className="cloud-tag" data-cat="backend" data-weight="3">
            MongoDB
          </span>
          <span className="cloud-tag" data-cat="backend" data-weight="2">
            Mongoose
          </span>
          <span className="cloud-tag" data-cat="backend" data-weight="3">
            PostgreSQL
          </span>
          <span className="cloud-tag" data-cat="backend" data-weight="2">
            MySQL
          </span>

          {/* Cloud & DevOps */}
          <span className="cloud-tag" data-cat="cloud" data-weight="3">
            AWS
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="3">
            Docker
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="3">
            Linux
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="3">
            Kubernetes
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="3">
            Terraform
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="2">
            ArgoCD
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="3">
            Git
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="2">
            GitLab
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="3">
            GitHub
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="2">
            Jenkins
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="2">
            GitHub Actions
          </span>
          <span className="cloud-tag" data-cat="cloud" data-weight="2">
            Nginx
          </span>

          {/* Other / AI */}
          <span className="cloud-tag" data-cat="other" data-weight="3">
            REST APIs
          </span>
          <span className="cloud-tag" data-cat="other" data-weight="3">
            Google Gemini AI
          </span>
          <span className="cloud-tag" data-cat="other" data-weight="2">
            Appwrite
          </span>
          <span className="cloud-tag" data-cat="other" data-weight="2">
            Kaggle
          </span>
        </div>
      </div>
      <p className="cloud-hint">Drag to spin</p>
    </section>
  );
}
