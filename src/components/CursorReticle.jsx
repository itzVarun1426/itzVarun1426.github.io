import React, { useEffect, useRef } from 'react';

const lerp = (a, b, t) => a + (b - a) * t;

export default function CursorReticle() {
  const dotRef = useRef(null);
  const retRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) return;

    const dot = dotRef.current;
    const ret = retRef.current;
    if (!dot || !ret) return;

    const R = { x: 0, y: 0, w: 26, h: 26 };
    const T = { x: 0, y: 0, w: 26, h: 26 };
    let locked = null;

    const onPointerMove = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      document.body.classList.add('cursor-on');
      if (!locked) {
        T.x = e.clientX;
        T.y = e.clientY;
        T.w = 26;
        T.h = 26;
      }
    };

    const onPointerOver = (e) => {
      const hit = e.target.closest('a, button');
      if (!hit) return;
      locked = hit;
      ret.classList.add('locked');
    };

    const onPointerOut = (e) => {
      if (locked && !e.relatedTarget?.closest?.('a, button')) {
        locked = null;
        ret.classList.remove('locked');
      }
    };

    const onPointerLeave = () => {
      document.body.classList.remove('cursor-on');
    };

    window.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    document.addEventListener('pointerleave', onPointerLeave);

    let animId;
    function reticleTick() {
      if (locked) {
        const b = locked.getBoundingClientRect();
        T.x = b.left + b.width / 2;
        T.y = b.top + b.height / 2;
        T.w = b.width + 16;
        T.h = b.height + 16;
      }
      R.x = lerp(R.x, T.x, 0.34);
      R.y = lerp(R.y, T.y, 0.34);
      R.w = lerp(R.w, T.w, 0.28);
      R.h = lerp(R.h, T.h, 0.28);

      ret.style.width = R.w + 'px';
      ret.style.height = R.h + 'px';
      ret.style.transform = `translate(${R.x - R.w / 2}px, ${R.y - R.h / 2}px)`;
      animId = requestAnimationFrame(reticleTick);
    }

    reticleTick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.body.classList.remove('cursor-on');
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" id="cursor-dot" ref={dotRef}></div>
      <div className="reticle" id="reticle" ref={retRef}>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </>
  );
}
