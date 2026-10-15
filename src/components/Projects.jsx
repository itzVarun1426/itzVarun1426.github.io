import React from 'react';

export default function Projects() {
  return (
    <section className="section" id="projects">
      <h2 className="section-title reveal" data-delay="1">
        Projects
      </h2>

      <div className="system">
        {/* Project 1: GenAI Interview Platform */}
        <a
          className="planet-card reveal"
          href="https://github.com/itzVarun1426/gen-ai-interview-project"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            '--glow': 'rgba(56,189,248,.5)',
            '--size': '170px',
            '--fallback': '#1e3f8f',
            '--ring': '#7fe6ff',
          }}
        >
          <div className="planet-slot" data-world="p-cup"></div>
          <p className="planet-name">GenAI Interview Platform</p>
          <div className="planet-info">
            <span className="planet-drop"></span>
            <span className="planet-rule"></span>
            <div className="planet-readout">
              <p className="planet-desc">
                GenAI Interview Platform with real-time video/audio recording, Gemini AI evaluation &amp; Web Speech API.
              </p>
              <span className="planet-cta">React &middot; Node &middot; Gemini AI &rarr;</span>
            </div>
          </div>
        </a>

        {/* Project 2: Signature Verification and Fraud Detection System */}
        <a
          className="planet-card reveal"
          data-delay="1"
          href="https://github.com/itzVarun1426/signature-verification-and-cheque-fraud-detection-system"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            '--glow': 'rgba(139,92,246,.5)',
            '--size': '150px',
            '--fallback': '#4c1d95',
          }}
        >
          <div className="planet-slot" data-world="p-wordle"></div>
          <p className="planet-name">Signature Verification &amp; Fraud Detection</p>
          <div className="planet-info">
            <span className="planet-drop"></span>
            <span className="planet-rule"></span>
            <div className="planet-readout">
              <p className="planet-desc">
                Siamese CNN deep learning system for genuine vs forged offline signature authentication &amp; cheque verification.
              </p>
              <span className="planet-cta">PyTorch &middot; CNN &middot; OpenCV &rarr;</span>
            </div>
          </div>
        </a>

        {/* Project 3: Portfolio */}
        <a
          className="planet-card reveal"
          data-delay="2"
          href="https://github.com/itzVarun1426/vxrun.me"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            '--glow': 'rgba(16,185,129,.5)',
            '--size': '158px',
            '--fallback': '#065f46',
          }}
        >
          <div className="planet-slot" data-world="p-drum"></div>
          <p className="planet-name">Portfolio (vxrun.me)</p>
          <div className="planet-info">
            <span className="planet-drop"></span>
            <span className="planet-rule"></span>
            <div className="planet-readout">
              <p className="planet-desc">
                Deep space interactive developer portfolio featuring procedural WebGL shaders, Three.js 3D cosmos &amp; Tailwind CSS.
              </p>
              <span className="planet-cta">React &middot; Three.js &middot; Tailwind &rarr;</span>
            </div>
          </div>
        </a>

        {/* Project 4: FitFusion */}
        <a
          className="planet-card reveal"
          href="https://github.com/itzVarun1426/fitfusion"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            '--glow': 'rgba(236,72,153,.5)',
            '--size': '142px',
            '--fallback': '#831843',
            '--ring': '#f472b6',
          }}
        >
          <div className="planet-slot" data-world="p-weather"></div>
          <p className="planet-name">FitFusion</p>
          <div className="planet-info">
            <span className="planet-drop"></span>
            <span className="planet-rule"></span>
            <div className="planet-readout">
              <p className="planet-desc">
                Comprehensive fitness tracking and workout management platform with personalized routines and telemetry.
              </p>
              <span className="planet-cta">React &middot; Node.js &middot; Fitness App &rarr;</span>
            </div>
          </div>
        </a>

        {/* Project 5: Kochi Metro Rail Dashboard */}
        <a
          className="planet-card reveal"
          data-delay="1"
          href="https://github.com/itzVarun1426/KochiRailMetro"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            '--glow': 'rgba(245,158,11,.5)',
            '--size': '148px',
            '--fallback': '#78350f',
            '--ring': '#fbbf24',
          }}
        >
          <div className="planet-slot" data-world="p-todo"></div>
          <p className="planet-name">Kochi Metro Rail Dashboard</p>
          <div className="planet-info">
            <span className="planet-drop"></span>
            <span className="planet-rule"></span>
            <div className="planet-readout">
              <p className="planet-desc">
                Interactive real-time transit telemetry, metro line tracking, and operational analytics dashboard for Kochi Metro.
              </p>
              <span className="planet-cta">React &middot; Dashboard &middot; Analytics &rarr;</span>
            </div>
          </div>
        </a>

        {/* Project 6: Converted Computer into Server */}
        <a
          className="planet-card reveal"
          data-delay="2"
          href="https://github.com/itzVarun1426/building-my-own-server"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            '--glow': 'rgba(244,63,94,.5)',
            '--size': '140px',
            '--fallback': '#4c0519',
          }}
        >
          <div className="planet-slot" data-world="p-qr"></div>
          <p className="planet-name">Home Server Infrastructure</p>
          <div className="planet-info">
            <span className="planet-drop"></span>
            <span className="planet-rule"></span>
            <div className="planet-readout">
              <p className="planet-desc">
                Repurposed personal computer transformed into a self-hosted Linux home server with Docker, tunnels &amp; reverse proxy.
              </p>
              <span className="planet-cta">Linux &middot; Docker &middot; DevOps &rarr;</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
