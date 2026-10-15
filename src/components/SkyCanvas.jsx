import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export default function SkyCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      document.body.classList.add('no-webgl');
      window.dispatchEvent(new Event('sky-ready'));
      console.error(err);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;

    const mobile = window.innerWidth < 760;

    /* --- background gradient + ground silhouette --- */
    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const skyUniforms = {
      uTop: { value: new THREE.Color('#04060e') },
      uBot: { value: new THREE.Color('#101c3d') },
      uGround: { value: 1.0 },
    };

    bgScene.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          uniforms: skyUniforms,
          depthTest: false,
          depthWrite: false,
          vertexShader: `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
          `,
          fragmentShader: `
            uniform vec3 uTop; uniform vec3 uBot; uniform float uGround;
            varying vec2 vUv;
            float ridge(float x) {
              return 0.050 + 0.028 * sin(x * 6.0 + 0.5)
                   + 0.016 * sin(x * 13.0 + 2.0) + 0.009 * sin(x * 27.0 + 4.0);
            }
            void main() {
              vec3 col = mix(uBot, uTop, pow(vUv.y, 0.8));
              float d = distance(vUv, vec2(0.5, -0.02));
              col += uGround * vec3(0.32, 0.46, 0.85) * smoothstep(0.7, 0.0, d) * 0.30;
              float h = ridge(vUv.x) * uGround;
              float g = smoothstep(h, h - 0.004, vUv.y);
              col = mix(col, vec3(0.008, 0.012, 0.026), g * uGround);
              float n = fract(sin(dot(vUv * 900.0, vec2(12.9898, 78.233))) * 43758.5453);
              gl_FragColor = vec4(col + (n - 0.5) * 0.006, 1.0);
            }
          `,
        })
      )
    );

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 1, 6000);

    scene.add(new THREE.AmbientLight(0x8fb4ff, 0.75));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(-1, 0.9, 0.8);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x8fcaff, 1.1);
    rimLight.position.set(1, -0.3, -0.6);
    scene.add(rimLight);

    function discTexture() {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0.0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
      g.addColorStop(1.0, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    const disc = discTexture();

    /* ---------------------------------------------------------
       Procedural Earth
       --------------------------------------------------------- */
    function makeNoise(seed) {
      const perm = new Uint8Array(512);
      let s = seed;
      const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = (rnd() * (i + 1)) | 0;
        [p[i], p[j]] = [p[j], p[i]];
      }
      for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

      const fade = (t) => t * t * (3 - 2 * t);
      return function noise(x, y, wrap) {
        const xi = Math.floor(x), yi = Math.floor(y);
        const xf = x - xi, yf = y - yi;
        const u = fade(xf), v = fade(yf);
        const at = (a, b) => {
          const ax = ((a % wrap) + wrap) % wrap;
          return perm[(perm[(ax + perm[b & 255]) & 255] + b) & 255] / 255;
        };
        const n00 = at(xi, yi), n10 = at(xi + 1, yi);
        const n01 = at(xi, yi + 1), n11 = at(xi + 1, yi + 1);
        return (n00 * (1 - u) + n10 * u) * (1 - v) + (n01 * (1 - u) + n11 * u) * v;
      };
    }

    function earthTextures() {
      const W = 1024, H = 512;
      const land = document.createElement('canvas'); land.width = W; land.height = H;
      const cloud = document.createElement('canvas'); cloud.width = W; cloud.height = H;
      const lctx = land.getContext('2d'), cctx = cloud.getContext('2d');
      const limg = lctx.createImageData(W, H), cimg = cctx.createImageData(W, H);

      const nA = makeNoise(1337), nB = makeNoise(9021), nC = makeNoise(4477);

      const fbm = (fn, x, y, wrap, oct) => {
        let v = 0, amp = 0.5, f = 1;
        for (let i = 0; i < oct; i++) {
          v += fn(x * f, y * f, wrap * f) * amp;
          amp *= 0.5; f *= 2;
        }
        return v;
      };

      const BASE = 8;

      for (let y = 0; y < H; y++) {
        const lat = y / H;
        const yy = (lat - 0.5) * 2;
        for (let x = 0; x < W; x++) {
          const u = x / W;
          const gx = u * BASE, gy = lat * BASE * 0.5;
          let h = fbm(nA, gx, gy, BASE, 5);
          h = h * 1.25 - 0.30 - Math.abs(yy) * 0.10;

          const i = (y * W + x) * 4;
          let r, g, b;

          const deep = Math.min(1, Math.max(0, (0.30 - h) * 3.2));
          const or_ = 12 + (1 - deep) * 26;
          const og = 54 + (1 - deep) * 60;
          const ob = 104 + (1 - deep) * 62;

          if (h > 0.27) {
            const dry = fbm(nB, gx * 2.2, gy * 2.2, BASE * 2, 3);
            if (h > 0.50) { r = 128; g = 122; b = 104; }
            else if (dry > 0.55) { r = 176; g = 152; b = 96; }
            else { r = 58; g = 104; b = 52; }
            const shade = 0.82 + fbm(nC, gx * 5, gy * 5, BASE * 5, 2) * 0.36;
            r *= shade; g *= shade; b *= shade;
            const coast = Math.min(1, (h - 0.27) / 0.05);
            const e = coast * coast * (3 - 2 * coast);
            r = or_ * (1 - e) + r * e;
            g = og * (1 - e) + g * e;
            b = ob * (1 - e) + b * e;
          } else {
            r = or_; g = og; b = ob;
          }

          const ice = Math.max(0, (Math.abs(yy) - 0.80) / 0.20);
          if (ice > 0) {
            const t = Math.min(1, ice * 1.4);
            r = r * (1 - t) + 236 * t;
            g = g * (1 - t) + 242 * t;
            b = b * (1 - t) + 250 * t;
          }

          limg.data[i] = r; limg.data[i + 1] = g; limg.data[i + 2] = b; limg.data[i + 3] = 255;

          let c = fbm(nB, gx * 1.7 + 40, gy * 1.7, BASE * 1.7, 4);
          c = Math.max(0, c * 1.7 - 0.62) * (1 - Math.abs(yy) * 0.45);
          cimg.data[i] = 255; cimg.data[i + 1] = 255; cimg.data[i + 2] = 255;
          cimg.data[i + 3] = Math.min(255, c * 420);
        }
      }

      lctx.putImageData(limg, 0, 0);
      cctx.putImageData(cimg, 0, 0);

      const lt = new THREE.CanvasTexture(land);
      const ct = new THREE.CanvasTexture(cloud);
      lt.colorSpace = THREE.SRGBColorSpace;
      lt.wrapS = ct.wrapS = THREE.RepeatWrapping;
      return { landTex: lt, cloudTex: ct };
    }

    const { landTex, cloudTex } = earthTextures();

    /* --- starfield --- */
    const STAR_COUNT = mobile ? 2600 : 7000;
    const FIELD_DEPTH = 3000;
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const tint = new THREE.Color();

    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 140 + Math.random() * 1100;
      const a = Math.random() * Math.PI * 2;
      starPos[i * 3] = Math.cos(a) * r;
      starPos[i * 3 + 1] = Math.sin(a) * r * 0.8;
      starPos[i * 3 + 2] = -Math.random() * FIELD_DEPTH;
      const roll = Math.random();
      if (roll > 0.86) tint.set('#8fcaff');
      else if (roll > 0.78) tint.set('#ffd9b8');
      else tint.set('#ffffff');
      tint.toArray(starCol, i * 3);
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 5,
      map: disc,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    /* --- dust --- */
    const DUST = mobile ? 260 : 600;
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 900;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 700;
      dustPos[i * 3 + 2] = -Math.random() * 900;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 2.4,
      map: disc,
      color: 0xbcd8ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    /* --- nebula clouds --- */
    const nebulaGroup = new THREE.Group();
    const nebulaMats = [];
    function makeNebulaSprite(color, size, x, y, z, drift) {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0.0, color);
      g.addColorStop(0.4, color.replace('1)', '0.35)'));
      g.addColorStop(1.0, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const s = new THREE.Sprite(mat);
      s.position.set(x, y, z);
      s.scale.set(size, size, 1);
      s.userData = { drift };
      nebulaGroup.add(s);
      nebulaMats.push(mat);
    }
    makeNebulaSprite('rgba(60,110,255,1)', 1400, 300, 100, -1800, 0.08);
    makeNebulaSprite('rgba(140,70,220,1)', 1200, -400, -150, -1500, 0.06);
    makeNebulaSprite('rgba(40,160,220,1)', 1600, -200, 300, -2200, 0.05);
    scene.add(nebulaGroup);

    /* --- Earth, Moon & Satellites --- */
    const home = new THREE.Group();
    const homeSurface = new THREE.Mesh(
      new THREE.SphereGeometry(720, 64, 48),
      new THREE.MeshStandardMaterial({ map: landTex, roughness: 0.65, metalness: 0.05, transparent: true, opacity: 0 })
    );
    home.add(homeSurface);
    const homeClouds = new THREE.Mesh(
      new THREE.SphereGeometry(726, 64, 48),
      new THREE.MeshStandardMaterial({ map: cloudTex, transparent: true, opacity: 0, depthWrite: false })
    );
    home.add(homeClouds);
    scene.add(home);

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(70, 32, 24),
      new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.9, metalness: 0.05, transparent: true, opacity: 0 })
    );
    scene.add(moon);

    const satellites = [];
    for (let i = 0; i < 3; i++) {
      const satMesh = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(7, 7, 10), new THREE.MeshStandardMaterial({ color: 0xdbe6f7, roughness: 0.3, metalness: 0.8 }));
      const panelL = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 7), new THREE.MeshStandardMaterial({ color: 0x1e3f8f, roughness: 0.2, metalness: 0.6 }));
      panelL.position.x = -12;
      const panelR = panelL.clone();
      panelR.position.x = 12;
      satMesh.add(body, panelL, panelR);
      scene.add(satMesh);
      satellites.push(satMesh);
    }

    /* --- rocket --- */
    function hullTexture() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 1024;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ebf0f8'; ctx.fillRect(0, 0, 256, 1024);
      const band = (y0, y1, col) => {
        ctx.fillStyle = col;
        ctx.fillRect(0, Math.round(y0 * 1024), 256, Math.round((y1 - y0) * 1024));
      };
      band(0.000, 0.024, '#1b212b');
      band(0.435, 0.492, '#1c222c');
      band(0.492, 0.498, '#6f7886');
      band(0.905, 0.912, '#2f6fe0');
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      return t;
    }

    const rocket = new THREE.Group();
    const R_BASE = 6.0;
    const profile = [
      new THREE.Vector2(0.01, -48),
      new THREE.Vector2(R_BASE * 0.80, -47.4),
      new THREE.Vector2(R_BASE * 0.96, -45),
      new THREE.Vector2(R_BASE, -42),
      new THREE.Vector2(R_BASE, 24),
    ];
    for (let i = 1; i <= 16; i++) {
      const t = i / 16;
      profile.push(new THREE.Vector2(R_BASE * Math.pow(Math.cos(t * Math.PI * 0.5), 0.55), 24 + t * 32));
    }
    profile.push(new THREE.Vector2(0.01, 57));

    const hull = new THREE.Mesh(
      new THREE.LatheGeometry(profile, 96),
      new THREE.MeshStandardMaterial({ map: hullTexture(), roughness: 0.34, metalness: 0.42 })
    );
    rocket.add(hull);

    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1b212b, roughness: 0.42, metalness: 0.8 });
    const finMat = new THREE.MeshStandardMaterial({ color: 0xe8edf5, roughness: 0.38, metalness: 0.45 });

    const finShape = new THREE.Shape();
    finShape.moveTo(R_BASE - 0.6, -26);
    finShape.lineTo(R_BASE - 0.6, -46);
    finShape.lineTo(R_BASE + 9.5, -49);
    finShape.lineTo(R_BASE + 9.5, -40);
    finShape.lineTo(R_BASE - 0.6, -30);
    finShape.closePath();

    const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.9, bevelEnabled: false });
    finGeo.translate(0, 0, -0.45);

    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.rotation.y = (i / 4) * Math.PI * 2;
      rocket.add(fin);
    }

    const bellProfile = [
      new THREE.Vector2(1.5, -47.5),
      new THREE.Vector2(1.9, -49.5),
      new THREE.Vector2(2.7, -51.5),
      new THREE.Vector2(3.8, -53.5),
      new THREE.Vector2(5.1, -55.4),
      new THREE.Vector2(5.6, -56.2),
    ];
    rocket.add(
      new THREE.Mesh(
        new THREE.LatheGeometry(bellProfile, 48),
        new THREE.MeshStandardMaterial({ color: 0x2a3140, roughness: 0.3, metalness: 0.95, side: THREE.DoubleSide })
      )
    );

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 1.6, 2.2, 32), darkMetal);
    collar.position.y = -47;
    rocket.add(collar);

    const flameMats = [];
    function makeFlame(radius, length, color, opacity) {
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const m = new THREE.Mesh(new THREE.ConeGeometry(radius, length, 32, 1, true), mat);
      m.rotation.x = Math.PI;
      m.position.y = -57 - length / 2;
      rocket.add(m);
      flameMats.push({ mesh: m, mat, base: opacity, length });
      return m;
    }
    makeFlame(6.2, 92, 0xff7a2a, 0.26);
    makeFlame(4.0, 46, 0xffb04d, 0.70);
    makeFlame(2.0, 24, 0xdff0ff, 0.95);

    scene.add(rocket);

    const puffs = [];
    for (let i = 0; i < 22; i++) {
      const mat = new THREE.SpriteMaterial({
        map: disc,
        color: 0xffcfa0,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const sprite = new THREE.Sprite(mat);
      scene.add(sprite);
      puffs.push({ sprite, mat, life: 0, vy: 0, vx: 0, size: 20 });
    }
    let puffCursor = 0, puffTimer = 0;

    function emitPuff(x, y, z) {
      const p = puffs[puffCursor];
      puffCursor = (puffCursor + 1) % puffs.length;
      p.sprite.position.set(x + (Math.random() - 0.5) * 12, y, z + (Math.random() - 0.5) * 12);
      p.size = 15 + Math.random() * 13;
      p.vy = -1.8 - Math.random() * 1.5;
      p.vx = (Math.random() - 0.5) * 1.6;
      p.life = 1;
    }

    /* --- outer background planets --- */
    const planets = [];
    function addPlanet({ radius, color, x, y, dist, appear, ring, ringColor, spin }) {
      const group = new THREE.Group();
      group.position.set(x, y, 0);
      const surface = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 48, 32),
        new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.1, transparent: true, opacity: 0 })
      );
      group.add(surface);
      const wire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(radius * 1.02, 3),
        new THREE.MeshBasicMaterial({ color: 0xbcd8ff, wireframe: true, transparent: true, opacity: 0 })
      );
      group.add(wire);
      let ringMesh = null;
      if (ring) {
        ringMesh = new THREE.Mesh(
          new THREE.RingGeometry(radius * 1.45, radius * 2.1, 96),
          new THREE.MeshBasicMaterial({
            color: ringColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0,
            wireframe: true,
          })
        );
        ringMesh.rotation.set(1.15, 0.2, 0);
        group.add(ringMesh);
      }
      scene.add(group);
      planets.push({ group, surface, wire, ringMesh, appear, dist, spin: spin || 0.0009 });
    }

    addPlanet({ radius: 150, color: 0x2b4a86, x: 1620, y: -300, dist: 2700, appear: 0.50, ring: true, ringColor: 0xb39dff, spin: 0.0011 });
    addPlanet({ radius: 70,  color: 0x7a4a5e, x: -1480, y:  460, dist: 2500, appear: 0.60, spin: 0.0016 });
    addPlanet({ radius: 240, color: 0x1d3358, x: -1900, y: -620, dist: 3400, appear: 0.68, spin: 0.0006 });
    addPlanet({ radius: 52,  color: 0x4a6f8a, x: 1560, y:  560, dist: 2200, appear: 0.76, spin: 0.0022 });
    addPlanet({ radius: 100, color: 0x6b4a2e, x: -1320, y: -460, dist: 1900, appear: 0.84, spin: 0.0019 });

    /* ---------------------------------------------------------
       Project Worlds: 3D spheres mapped to DOM project cards
       --------------------------------------------------------- */
    const projScene = new THREE.Scene();
    let projCamera = new THREE.OrthographicCamera(
      -window.innerWidth / 2, window.innerWidth / 2,
      window.innerHeight / 2, -window.innerHeight / 2, -4000, 4000
    );

    projScene.add(new THREE.AmbientLight(0x9fb6d8, 0.55));
    const projKey = new THREE.DirectionalLight(0xfff4e8, 3.1);
    projKey.position.set(-0.55, 0.62, 0.9);
    projScene.add(projKey);
    const projRim = new THREE.DirectionalLight(0x6fa8ff, 1.35);
    projRim.position.set(0.85, -0.35, -0.5);
    projScene.add(projRim);

    function worldTexture(spec) {
      const W = 1024, H = 512;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const x = c.getContext('2d');

      const g = x.createLinearGradient(0, 0, 0, H);
      spec.base.forEach((col, i) => g.addColorStop(i / (spec.base.length - 1), col));
      x.fillStyle = g;
      x.fillRect(0, 0, W, H);

      const wrapped = (fn) => { fn(0); fn(-W); fn(W); };

      for (let i = 0; i < spec.mottle; i++) {
        const mx = Math.random() * W, my = Math.random() * H;
        const rx = 40 + Math.random() * 190, ry = 16 + Math.random() * 70;
        const tintColor = spec.mottleColors[(Math.random() * spec.mottleColors.length) | 0];
        wrapped((off) => {
          const rg = x.createRadialGradient(mx + off, my, 0, mx + off, my, rx);
          rg.addColorStop(0, tintColor);
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          x.save();
          x.globalAlpha = 0.10 + Math.random() * 0.22;
          x.translate(mx + off, my);
          x.scale(1, ry / rx);
          x.translate(-(mx + off), -my);
          x.fillStyle = rg;
          x.fillRect(mx + off - rx, my - rx, rx * 2, rx * 2);
          x.restore();
        });
      }

      if (spec.bands) {
        for (let i = 0; i < spec.bands.count; i++) {
          const y = Math.random() * H;
          const th = 6 + Math.random() * 26;
          x.globalAlpha = 0.06 + Math.random() * 0.16;
          x.fillStyle = spec.bands.colors[(Math.random() * spec.bands.colors.length) | 0];
          x.beginPath();
          x.ellipse(W / 2, y, W, th, 0, 0, Math.PI * 2);
          x.fill();
        }
        x.globalAlpha = 1;
      }

      for (let i = 0; i < spec.craters; i++) {
        const cx = Math.random() * W;
        const cy = H * (0.18 + Math.random() * 0.64);
        const r = 6 + Math.random() * 26;
        wrapped((off) => {
          x.save();
          x.globalAlpha = 0.55;
          x.fillStyle = 'rgba(0,0,0,0.85)';
          x.beginPath(); x.ellipse(cx + off, cy, r, r * 0.72, 0, 0, Math.PI * 2); x.fill();
          x.globalAlpha = 0.5;
          x.strokeStyle = spec.rim;
          x.lineWidth = Math.max(1, r * 0.16);
          x.beginPath(); x.ellipse(cx + off, cy - r * 0.08, r, r * 0.72, 0, Math.PI * 1.05, Math.PI * 2.0); x.stroke();
          x.restore();
        });
      }

      if (spec.storm) {
        const sx = W * spec.storm.x, sy = H * spec.storm.y;
        wrapped((off) => {
          const rg = x.createRadialGradient(sx + off, sy, 0, sx + off, sy, spec.storm.r);
          rg.addColorStop(0, spec.storm.hot);
          rg.addColorStop(0.55, spec.storm.cool);
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          x.save();
          x.translate(sx + off, sy); x.scale(1, 0.45); x.translate(-(sx + off), -sy);
          x.fillStyle = rg;
          x.fillRect(sx + off - spec.storm.r, sy - spec.storm.r, spec.storm.r * 2, spec.storm.r * 2);
          x.restore();
        });
      }

      if (spec.caps) {
        [[0, 1], [H, -1]].forEach(([edge, dir]) => {
          const cg = x.createLinearGradient(0, edge, 0, edge + dir * H * 0.16);
          cg.addColorStop(0, spec.caps);
          cg.addColorStop(1, 'rgba(255,255,255,0)');
          x.fillStyle = cg;
          x.fillRect(0, Math.min(edge, edge + dir * H * 0.16), W, H * 0.16);
        });
      }

      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      return t;
    }

    function ringTexture(color) {
      const W = 512, c = document.createElement('canvas');
      c.width = W; c.height = 8;
      const x = c.getContext('2d');
      for (let i = 0; i < W; i++) {
        const t = i / W;
        const gap = Math.abs(Math.sin(t * 9.1)) < 0.16 || Math.abs(t - 0.63) < 0.02;
        x.globalAlpha = gap ? 0.05 : 0.30 + 0.45 * Math.abs(Math.sin(t * 23.0));
        x.fillStyle = color;
        x.fillRect(i, 0, 1, 8);
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }

    const WORLD_SPECS = {
      cup: {
        base: ['#e9e2d6', '#d8c3ab', '#b9866a', '#8d5a44', '#c7ab94'],
        mottleColors: ['rgba(56,189,248,0.55)', 'rgba(30,63,143,0.5)', 'rgba(255,236,214,0.4)'],
        mottle: 26, craters: 30, rim: 'rgba(127,230,255,0.8)',
        caps: 'rgba(255,253,250,0.92)', tilt: 0.22,
      },
      wordle: {
        base: ['#4c1d95', '#3b1774', '#2e1065', '#1e1b4b', '#312e81'],
        mottleColors: ['rgba(139,92,246,0.5)', 'rgba(167,139,250,0.42)', 'rgba(0,0,0,0.5)'],
        mottle: 24, craters: 35, rim: 'rgba(196,181,253,0.75)', tilt: -0.16,
      },
      drum: {
        base: ['#065f46', '#047857', '#064e3b', '#022c22', '#0f766e'],
        mottleColors: ['rgba(16,185,129,0.55)', 'rgba(52,211,153,0.3)', 'rgba(6,78,59,0.6)'],
        mottle: 22, craters: 12, rim: 'rgba(110,231,183,0.6)',
        bands: { count: 16, colors: ['rgba(5,150,105,0.5)', 'rgba(4,120,87,0.5)'] },
        storm: { x: 0.34, y: 0.46, r: 120, hot: 'rgba(167,243,208,0.85)', cool: 'rgba(16,185,129,0.7)' },
        tilt: 0.3,
      },
      weather: {
        base: ['#831843', '#9d174d', '#701a75', '#4c0519', '#be185d'],
        mottleColors: ['rgba(236,72,153,0.45)', 'rgba(244,114,182,0.55)', 'rgba(251,207,232,0.4)'],
        mottle: 26, craters: 8, rim: 'rgba(244,114,182,0.5)',
        bands: { count: 26, colors: ['rgba(219,39,119,0.4)', 'rgba(157,23,77,0.5)'] },
        storm: { x: 0.36, y: 0.42, r: 105, hot: 'rgba(253,242,248,0.95)', cool: 'rgba(236,72,153,0.6)' },
        tilt: -0.24,
      },
      todo: {
        base: ['#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b'],
        mottleColors: ['rgba(245,158,11,0.5)', 'rgba(251,191,36,0.5)', 'rgba(254,243,199,0.4)'],
        mottle: 20, craters: 14, rim: 'rgba(252,211,77,0.7)',
        bands: { count: 12, colors: ['rgba(251,191,36,0.3)', 'rgba(180,83,9,0.32)'] },
        caps: 'rgba(254,243,199,0.85)', tilt: 0.34,
      },
      qr: {
        base: ['#4c0519', '#881337', '#9f1239', '#e11d48', '#fb7185'],
        mottleColors: ['rgba(244,63,94,0.5)', 'rgba(251,113,133,0.3)', 'rgba(0,0,0,0.6)'],
        mottle: 24, craters: 26, rim: 'rgba(253,164,175,0.6)', tilt: -0.3,
      },
    };

    const worlds = [];

    function buildWorlds() {
      document.querySelectorAll('.planet-slot').forEach((slot) => {
        const key = (slot.dataset.world || '').replace('p-', '');
        const spec = WORLD_SPECS[key];
        if (!spec) return;

        const group = new THREE.Group();
        group.rotation.z = spec.tilt || 0;

        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(1, 72, 48),
          new THREE.MeshStandardMaterial({ map: worldTexture(spec), roughness: 0.88, metalness: 0.04 })
        );
        group.add(sphere);

        const card = slot.closest('.planet-card');
        const ringColor = card && getComputedStyle(card).getPropertyValue('--ring').trim();
        if (ringColor) {
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(1.42, 2.15, 128, 1),
            new THREE.MeshBasicMaterial({
              map: ringTexture(ringColor),
              color: 0xffffff,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.75,
              depthWrite: false,
            })
          );
          const uv = ring.geometry.attributes.uv, pos = ring.geometry.attributes.position;
          for (let i = 0; i < uv.count; i++) {
            const r = Math.hypot(pos.getX(i), pos.getY(i));
            uv.setXY(i, (r - 1.42) / 0.73, 0.5);
          }
          uv.needsUpdate = true;
          ring.rotation.x = Math.PI / 2 - 0.34;
          group.add(ring);
        }

        projScene.add(group);

        const w = { slot, group, sphere, spin: 0.0016 + Math.random() * 0.0014, hover: 0, hoverT: 0 };
        if (card) {
          card.addEventListener('pointerenter', () => { w.hoverT = 1; });
          card.addEventListener('pointerleave', () => { w.hoverT = 0; });
          card.addEventListener('focusin', () => { w.hoverT = 1; });
          card.addEventListener('focusout', () => { w.hoverT = 0; });
        }
        worlds.push(w);
      });
    }

    let worldsVisible = false;

    function syncWorlds() {
      const vw = window.innerWidth, vh = window.innerHeight;
      worldsVisible = false;
      for (const w of worlds) {
        const r = w.slot.getBoundingClientRect();
        if (r.width === 0 || r.bottom < -240 || r.top > vh + 240) {
          w.group.visible = false;
          continue;
        }
        w.group.visible = true;
        worldsVisible = true;

        w.hover += (w.hoverT - w.hover) * 0.12;
        const rad = (r.width / 2) * (1 + w.hover * 0.09);
        w.group.position.set(r.left + r.width / 2 - vw / 2, vh / 2 - (r.top + r.height / 2), 0);
        w.group.scale.setScalar(rad);
        w.sphere.rotation.y += w.spin;
      }
    }

    /* --- meteors --- */
    const meteors = [];
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1, 0, 0)]);
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      meteors.push({ line, mat, life: 0, wait: 60 + Math.random() * 500, vx: 0, vy: 0 });
    }

    function launchMeteor(m) {
      const len = 90 + Math.random() * 130;
      m.line.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-len, -len * 0.55, 0)]);
      m.line.position.set((Math.random() - 0.5) * 900, 150 + Math.random() * 350, -300 - Math.random() * 700);
      m.vx = -5 - Math.random() * 4;
      m.vy = m.vx * 0.55;
      m.life = 1;
    }

    const NEAR_TOP = new THREE.Color('#04060e'), NEAR_BOT = new THREE.Color('#101c3d');
    const FAR_TOP  = new THREE.Color('#020309'), FAR_BOT  = new THREE.Color('#070a18');

    let camX = 0, camY = 0, time = 0, visible = true;
    const usePost = !reduce && window.innerWidth >= 900;

    const GradeShader = {
      uniforms: {
        tDiffuse: { value: null },
        uTime:    { value: 0 },
        uGrain:   { value: 0.032 },
        uVignette:{ value: 0.9 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime; uniform float uGrain; uniform float uVignette;
        varying vec2 vUv;

        float hash(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * 0.1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
        }

        void main() {
          vec3 col = texture2D(tDiffuse, vUv).rgb;
          float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
          col = mix(col * vec3(0.94, 0.98, 1.10), col, smoothstep(0.0, 0.55, l));
          col = clamp((col - 0.5) * 1.06 + 0.5, 0.0, 1.0);
          vec2 d = vUv - 0.5;
          col *= 1.0 - uVignette * 0.55 * dot(d, d);
          float g = hash(gl_FragCoord.xy + fract(uTime) * 311.7) - 0.5;
          col += g * uGrain * (1.0 - 0.6 * l);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    };

    let composer = null, gradePass = null, bloomPass = null;

    if (usePost) {
      composer = new EffectComposer(renderer);

      const bgPass = new RenderPass(bgScene, bgCamera);
      composer.addPass(bgPass);

      const mainPass = new RenderPass(scene, camera);
      mainPass.clear = false;
      mainPass.clearDepth = true;
      composer.addPass(mainPass);

      const projPass = new RenderPass(projScene, projCamera);
      projPass.clear = false;
      projPass.clearDepth = true;
      composer.addPass(projPass);

      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.62,
        0.62,
        0.72
      );
      composer.addPass(bloomPass);

      gradePass = new ShaderPass(GradeShader);
      composer.addPass(gradePass);
      composer.addPass(new OutputPass());
    }

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      projCamera.left = -window.innerWidth / 2;
      projCamera.right = window.innerWidth / 2;
      projCamera.top = window.innerHeight / 2;
      projCamera.bottom = -window.innerHeight / 2;
      projCamera.updateProjectionMatrix();
      if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
        bloomPass.resolution.set(window.innerWidth, window.innerHeight);
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    const sat = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));

    window.__skyUpdate = function (state) {
      if (!visible) return;
      const p = state.progress;
      const L = state.launchT;
      const clutter = state.clutter === undefined ? 1 : state.clutter;
      time += 0.016;

      const far = sat(p, 0.05, 0.45);
      skyUniforms.uTop.value.copy(NEAR_TOP).lerp(FAR_TOP, far);
      skyUniforms.uBot.value.copy(NEAR_BOT).lerp(FAR_BOT, far);
      skyUniforms.uGround.value = L < 0 ? 1 : Math.max(0, 1 - L * 2.6);

      const flyZ = reduce ? 0 : -p * (FIELD_DEPTH * 0.6);

      starMat.opacity = 0.35 + 0.65 * sat(L < 0 ? 0 : L, 0.1, 0.7);
      dustMat.opacity = 0.5 * sat(p, 0.1, 0.4);
      dust.position.z = flyZ;

      const neb = sat(p, 0.25, 0.6);
      nebulaMats.forEach((m, i) => { m.opacity = neb * (0.022 + i * 0.007) * clutter; });
      nebulaGroup.children.forEach((s, i) => {
        s.position.x += Math.sin(time * 0.12 + i) * s.userData.drift * 0.5;
        s.position.y += Math.cos(time * 0.09 + i) * s.userData.drift * 0.3;
      });

      /* ---- Earth ---- */
      const homeIn = (L < 0 ? 0 : sat(L, 0.35, 0.9)) * (1 - sat(p, 0.06, 0.34));
      homeSurface.material.opacity = homeIn;
      homeClouds.material.opacity = homeIn * 0.85;
      home.visible = homeIn > 0.01;
      home.rotation.y += 0.00035;
      homeClouds.rotation.y += 0.00012;
      home.position.set(0, -1150 - p * 900, -700 + flyZ * 0.35);

      const ma = time * 0.06;
      moon.position.set(
        home.position.x + Math.cos(ma) * 1500,
        home.position.y + 700 + Math.sin(ma) * 220,
        home.position.z + Math.sin(ma) * 900
      );
      moon.material.opacity = homeIn;
      moon.visible = homeIn > 0.01;

      /* ---- satellites ---- */
      const satIn = (L < 0 ? 0 : sat(L, 0.5, 1)) * (1 - sat(p, 0.10, 0.24));
      satellites.forEach((s, i) => {
        const t = time * (0.05 + i * 0.02) + i * 2.2;
        s.position.set(
          Math.sin(t) * (360 + i * 170),
          Math.cos(t * 0.8) * (170 + i * 80) + 60,
          -620 - i * 300 + flyZ * 0.5
        );
        s.rotation.y = t * 0.6;
        s.rotation.x = Math.sin(t * 0.4) * 0.3;
        s.visible = satIn > 0.02;
        s.traverse((o) => { if (o.material) o.material.opacity = satIn; });
      });

      /* ---- outer planets ---- */
      for (const pl of planets) {
        const inView = sat(p, pl.appear, pl.appear + 0.12) * clutter;
        pl.surface.material.opacity = inView * 0.5;
        pl.wire.material.opacity = inView * 0.05;
        if (pl.ringMesh) pl.ringMesh.material.opacity = inView * 0.22;
        pl.group.position.z = flyZ - pl.dist;
        pl.group.rotation.y += pl.spin;
        pl.group.visible = inView > 0.01;
      }

      /* ---- the rocket ---- */
      let thrust, stretch;
      const halfW = Math.tan(THREE.MathUtils.degToRad(31)) * 290 * camera.aspect;

      if (reduce) {
        rocket.visible = false; thrust = 0; stretch = 1;
      } else if (L < 0) {
        rocket.position.set(halfW * 0.60, -80, -250);
        rocket.rotation.z = 0;
        rocket.visible = true;
        thrust = 0.16; stretch = 0.9;
      } else if (L < 1) {
        rocket.position.set(halfW * 0.60, -80 + Math.pow(L, 1.8) * 900, -250);
        rocket.rotation.z = -L * 0.22;
        rocket.visible = true;
        thrust = 1; stretch = 1 + L * 0.9;
      } else {
        rocket.visible = false; thrust = 0; stretch = 1;
      }

      const flick = 0.86 + Math.sin(time * 41) * 0.14;
      for (const f of flameMats) {
        f.mesh.scale.set(thrust * flick, thrust * stretch * flick, thrust * flick);
        f.mat.opacity = thrust * f.base * flick;
      }

      if (rocket.visible && thrust > 0.3 && --puffTimer <= 0) {
        puffTimer = 2;
        emitPuff(rocket.position.x, rocket.position.y - 60, rocket.position.z);
      }
      for (const q of puffs) {
        if (q.life <= 0) { q.mat.opacity = 0; continue; }
        q.life -= 0.016;
        q.sprite.position.y += q.vy;
        q.sprite.position.x += q.vx;
        const grow = q.size * (1 + (1 - q.life) * 1.6);
        q.sprite.scale.set(grow, grow, 1);
        q.mat.opacity = Math.max(0, q.life * q.life * 0.20);
      }

      /* ---- camera ---- */
      camX = camX + (state.mouseX * 42 - camX) * 0.045;
      camY = camY + (-state.mouseY * 28 - camY) * 0.045;
      const shake = (L >= 0 && L < 1) ? sat(L, 0, 0.06) * (1 - sat(L, 0.1, 0.4)) * 4.5 : 0;
      const sx = shake ? (Math.random() - 0.5) * shake : 0;
      const sy = shake ? (Math.random() - 0.5) * shake : 0;
      camera.position.set(camX + sx, camY + sy, flyZ + 40);
      camera.lookAt(camX * 0.3, camY * 0.3, flyZ - 400);

      /* ---- meteors ---- */
      if (p > 0.3 && !reduce) {
        for (const m of meteors) {
          if (m.life > 0) {
            m.line.position.x += m.vx;
            m.line.position.y += m.vy;
            m.life -= 0.014;
            m.mat.opacity = Math.max(0, Math.sin(m.life * Math.PI)) * 0.85;
          } else if (--m.wait <= 0) {
            m.wait = 200 + Math.random() * 900;
            launchMeteor(m);
          }
        }
      }

      syncWorlds();

      if (composer) {
        gradePass.uniforms.uTime.value = time;
        composer.render();
      } else {
        renderer.clear();
        renderer.render(bgScene, bgCamera);
        renderer.clearDepth();
        renderer.render(scene, camera);
        if (worldsVisible) {
          renderer.clearDepth();
          renderer.render(projScene, projCamera);
        }
      }
    };

    // Build worlds when DOM is ready
    buildWorlds();
    window.__skyUpdate({ progress: 0, launchT: -1, clutter: 1, mouseX: 0, mouseY: 0 });
    window.dispatchEvent(new Event('sky-ready'));

    const fallbackTimeout = setTimeout(() => {
      if (!window.__skyUpdate) document.body.classList.add('no-webgl');
    }, 3500);

    return () => {
      clearTimeout(fallbackTimeout);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.__skyUpdate = null;
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="sky-canvas" ref={canvasRef}></canvas>
      <div id="sky-fallback"></div>
      <div className="vignette"></div>
    </>
  );
}
