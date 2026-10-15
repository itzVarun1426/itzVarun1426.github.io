import React, { useEffect, useRef } from 'react';

export default function EducationJourney() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const waves = containerRef.current.querySelectorAll('.dsn-wave');
    waves.forEach((wave, i) => {
      const STEP = 2,
        HALF = 100,
        MID = 11;
      let seed = (i + 1) * 9301;
      const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

      const vals = [];
      for (let x = 0; x <= HALF - STEP; x += STEP) {
        const burst = rand() > 0.86 ? 1 : 0.28;
        vals.push(MID + (rand() - 0.5) * 17 * burst);
      }

      const pts = [];
      for (let copy = 0; copy < 2; copy++) {
        vals.forEach((v, k) => pts.push(copy * HALF + k * STEP + ',' + v.toFixed(1)));
      }
      pts.push(2 * HALF + ',' + vals[0].toFixed(1));

      wave.innerHTML =
        '<svg viewBox="0 0 200 22" preserveAspectRatio="none">' +
        '<polyline points="' +
        pts.join(' ') +
        '"/>' +
        '</svg>';
    });
  }, []);

  return (
    <section className="section" id="journey" ref={containerRef}>
      <h2 className="section-title reveal" data-delay="1">
        Education &amp; Credentials
      </h2>

      <div className="edu-cert-grid reveal" data-delay="2">
        {/* LEFT: Education Journey */}
        <div className="dsn-panel edu-panel">
          <h3 className="dsn-panel-title">Education Journey</h3>
          <div className="dsn">
            <div className="dsn-head">
              <span className="dsn-tag">Academic Telemetry</span>
              <span className="dsn-head-rule"></span>
              <span className="dsn-status">
                <i className="dsn-led"></i>Signal lock &middot; 03 records
              </span>
            </div>

            <div className="dsn-list">
              <div className="dsn-row" style={{ '--sig': '100%' }} tabIndex={-1}>
                <span className="dsn-id">EDU&#8209;01</span>
                <span className="dsn-body">
                  <span className="dsn-name">B.E. Computer Engineering</span>
                  <span className="dsn-sub">
                    DY Patil College of Engineering, Akurdi, Pune (2023 &ndash; Present) &middot; CGPA: 9.08
                  </span>
                </span>
                <span className="dsn-wave" aria-hidden="true"></span>
                <span className="dsn-meta">
                  <span className="dsn-sig" aria-hidden="true">
                    <i></i>
                  </span>
                  <span className="dsn-fmt">CGPA 9.08</span>
                </span>
              </div>

              <div className="dsn-row" style={{ '--sig': '86%' }} tabIndex={-1}>
                <span className="dsn-id">EDU&#8209;02</span>
                <span className="dsn-body">
                  <span className="dsn-name">12th HSC Science</span>
                  <span className="dsn-sub">
                    Maharashtra State Board (2023) &middot; 80% with distinction in Physics, Chemistry &amp; Math
                  </span>
                </span>
                <span className="dsn-wave" aria-hidden="true"></span>
                <span className="dsn-meta">
                  <span className="dsn-sig" aria-hidden="true">
                    <i></i>
                  </span>
                  <span className="dsn-fmt">80%</span>
                </span>
              </div>

              <div className="dsn-row" style={{ '--sig': '90%' }} tabIndex={-1}>
                <span className="dsn-id">EDU&#8209;03</span>
                <span className="dsn-body">
                  <span className="dsn-name">10th SSC General Academics</span>
                  <span className="dsn-sub">
                    Maharashtra State Board (2021) &middot; 86% with strong foundation in Science &amp; Math
                  </span>
                </span>
                <span className="dsn-wave" aria-hidden="true"></span>
                <span className="dsn-meta">
                  <span className="dsn-sig" aria-hidden="true">
                    <i></i>
                  </span>
                  <span className="dsn-fmt">86%</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Certifications */}
        <div className="dsn-panel cert-panel">
          <h3 className="dsn-panel-title">Certifications</h3>
          <div className="dsn">
            <div className="dsn-head">
              <span className="dsn-tag">Verified Credentials</span>
              <span className="dsn-head-rule"></span>
              <span className="dsn-status">
                <i className="dsn-led"></i>Auth lock &middot; 05 credentials
              </span>
            </div>

            <div className="dsn-list">
              <div className="dsn-row cert-row" style={{ '--sig': '100%' }} tabIndex={-1}>
                <span className="dsn-id">CRT&#8209;01</span>
                <span className="dsn-body">
                  <span className="dsn-name">Cloud Practitioner Essentials by AWS</span>
                </span>
                <span className="dsn-meta">
                  <span className="dsn-sig" aria-hidden="true">
                    <i></i>
                  </span>
                  <span className="dsn-fmt">AWS</span>
                </span>
              </div>

              <div className="dsn-row cert-row" style={{ '--sig': '100%' }} tabIndex={-1}>
                <span className="dsn-id">CRT&#8209;02</span>
                <span className="dsn-body">
                  <span className="dsn-name">Solutions Architect Essentials by AWS</span>
                </span>
                <span className="dsn-meta">
                  <span className="dsn-sig" aria-hidden="true">
                    <i></i>
                  </span>
                  <span className="dsn-fmt">AWS</span>
                </span>
              </div>

              <div className="dsn-row cert-row" style={{ '--sig': '95%' }} tabIndex={-1}>
                <span className="dsn-id">CRT&#8209;03</span>
                <span className="dsn-body">
                  <span className="dsn-name">Linux Administration by TuteDude</span>
                </span>
                <span className="dsn-meta">
                  <span className="dsn-sig" aria-hidden="true">
                    <i></i>
                  </span>
                  <span className="dsn-fmt">TuteDude</span>
                </span>
              </div>

              <div className="dsn-row cert-row" style={{ '--sig': '95%' }} tabIndex={-1}>
                <span className="dsn-id">CRT&#8209;04</span>
                <span className="dsn-body">
                  <span className="dsn-name">Git Administration by Microsoft</span>
                </span>
                <span className="dsn-meta">
                  <span className="dsn-sig" aria-hidden="true">
                    <i></i>
                  </span>
                  <span className="dsn-fmt">Microsoft</span>
                </span>
              </div>

              <div className="dsn-row cert-row" style={{ '--sig': '90%' }} tabIndex={-1}>
                <span className="dsn-id">CRT&#8209;05</span>
                <span className="dsn-body">
                  <span className="dsn-name">SQL and Relational Databases 101 by IBM</span>
                </span>
                <span className="dsn-meta">
                  <span className="dsn-sig" aria-hidden="true">
                    <i></i>
                  </span>
                  <span className="dsn-fmt">IBM</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
