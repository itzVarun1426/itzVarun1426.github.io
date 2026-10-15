import React, { useEffect, useRef } from 'react';

export default function MouseTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!finePointer || reduceMotion) return;

    const tCanvas = canvasRef.current;
    if (!tCanvas) return;

    const tCtx = tCanvas.getContext('2d');
    let tw = (tCanvas.width = window.innerWidth);
    let th = (tCanvas.height = window.innerHeight);

    const onResize = () => {
      tw = tCanvas.width = window.innerWidth;
      th = tCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const trailPts = Array.from({ length: 18 }, () => ({ x: tw / 2, y: th / 2 }));
    const mousePos = { x: tw / 2, y: th / 2 };

    const onMouseMove = (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let animId;
    function renderTrail() {
      tCtx.clearRect(0, 0, tw, th);
      trailPts[0].x += (mousePos.x - trailPts[0].x) * 0.45;
      trailPts[0].y += (mousePos.y - trailPts[0].y) * 0.45;

      for (let i = 1; i < trailPts.length; i++) {
        trailPts[i].x += (trailPts[i - 1].x - trailPts[i].x) * 0.35;
        trailPts[i].y += (trailPts[i - 1].y - trailPts[i].y) * 0.35;
      }

      if (trailPts.length > 2) {
        tCtx.beginPath();
        tCtx.moveTo(trailPts[0].x, trailPts[0].y);
        for (let i = 1; i < trailPts.length - 1; i++) {
          const xc = (trailPts[i].x + trailPts[i + 1].x) / 2;
          const yc = (trailPts[i].y + trailPts[i + 1].y) / 2;
          tCtx.quadraticCurveTo(trailPts[i].x, trailPts[i].y, xc, yc);
        }
        const grad = tCtx.createLinearGradient(
          trailPts[0].x,
          trailPts[0].y,
          trailPts[trailPts.length - 1].x,
          trailPts[trailPts.length - 1].y
        );
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.25)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        tCtx.strokeStyle = grad;
        tCtx.lineWidth = 3;
        tCtx.lineCap = 'round';
        tCtx.lineJoin = 'round';
        tCtx.stroke();
      }
      animId = requestAnimationFrame(renderTrail);
    }

    renderTrail();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <canvas id="trail-canvas" ref={canvasRef}></canvas>;
}
