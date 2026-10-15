import React from 'react';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="about-grid">
        <div className="reveal">
          <div className="porthole-wrap" id="porthole-wrap">
            <svg className="porthole-arc" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="48"></circle>
            </svg>
            <div className="porthole" id="porthole">
              <div
                className="porthole-glass"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#070c1e',
                  color: '#38bdf8',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '2rem',
                  fontWeight: 700,
                }}
              >
                <img
                  src="/main site/img/Varun_Nagote.png"
                  alt="Picture of me"
                  className="me_pic"
                />
              </div>
              <span className="porthole-sweep" aria-hidden="true"></span>
            </div>
          </div>
        </div>

        <div className="about-body">
          <h2 className="section-title reveal" data-delay="1">
            About Me
          </h2>

          <div className="record reveal" data-delay="2">
            <div className="record-row">
              <span className="record-key">Name</span>
              <span className="record-sep">:</span>
              <span className="record-val">Varun Nagote</span>
            </div>
            <div className="record-row">
              <span className="record-key">Institution</span>
              <span className="record-sep">:</span>
              <span className="record-val">DY Patil College of Engineering, Akurdi, Pune</span>
            </div>
            <div className="record-row">
              <span className="record-key">Program</span>
              <span className="record-sep">:</span>
              <span className="record-val">B.E. Computer Engineering (2023 – Present)</span>
            </div>
            <div className="record-row">
              <span className="record-key">CGPA</span>
              <span className="record-sep">:</span>
              <span className="record-val">9.08</span>
            </div>
            <div className="record-row">
              <span className="record-key">Focus</span>
              <span className="record-sep">:</span>
              <span className="record-val">Full-Stack Development, AI/GenAI &amp; Cloud Systems</span>
            </div>
            <div className="record-row">
              <span className="record-key">Research</span>
              <span className="record-sep">:</span>
              <span className="record-val">
                Offline Signature Verification &amp; Cheque Fraud Detection Using Siamese CNNs &middot; 3D Flight Path Optimization for UAVs Using Nature-Inspired Optimization
              </span>
            </div>
            <div className="record-row">
              <span className="record-key">Achievements</span>
              <span className="record-sep">:</span>
              <span className="record-val">
                SIH Finalist 2025 &middot; 600+ LeetCode Solved &middot; Claude Foundations &middot; AWS Cloud Practitioner &middot; Git Foundation &middot; IBM Data Analytics
              </span>
            </div>
          </div>

          <div className="social-card reveal" data-delay="3">
            <a href="mailto:varunnagote@gmail.com" aria-label="Email">
              <svg
                className="stroked"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <path d="m3 7 9 6 9-6"></path>
              </svg>
            </a>
            <a
              href="https://github.com/itzVarun1426"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/varunn26/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
              </svg>
            </a>
            <a
              href="https://leetcode.com/u/Coder_Vilgax/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LeetCode"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.8rem',
                textDecoration: 'none',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                viewBox="0 0 24 24"
                id="leetcode"
              >
                <path
                  d="M20.1,16.007h-9.187c-1.047,0-1.899-0.897-1.899-2s0.853-2,1.899-2H20.1c1.048,0,1.9,0.897,1.9,2S21.147,16.007,20.1,16.007z M10.913,13.507c-0.217,0-0.399,0.229-0.399,0.5s0.183,0.5,0.399,0.5H20.1c0.217,0,0.4-0.229,0.4-0.5s-0.184-0.5-0.4-0.5H10.913z"
                  fill="#ffffff"
                ></path>
                <path
                  d="M10.538,24c-1.621,0-3.011-0.55-4.021-1.589l-3.949-4.09C1.557,17.278,1,15.803,1,14.167c0-1.61,0.557-3.072,1.568-4.117l9.174-9.47C12.104,0.206,12.592,0,13.113,0c0,0,0,0,0.001,0c0.54,0,1.049,0.218,1.434,0.614c0.766,0.792,0.78,2.061,0.032,2.828l-1.443,1.511C13.549,5.18,13.985,5.5,14.511,5.95l2.361,1.963c0.804,0.824,0.788,2.093,0.024,2.882c-0.386,0.397-0.895,0.615-1.435,0.615c-0.001,0-0.001,0-0.002,0c-0.521,0-1.007-0.207-1.367-0.581l-2.377-1.876c-0.668-0.497-0.783-0.534-1.19-0.534c-0.422,0-0.803,0.159-1.164,0.486l-3.886,4.069c-0.282,0.291-0.43,0.702-0.43,1.191c0,0.498,0.155,0.945,0.427,1.226l3.937,4.091c0.251,0.26,0.627,0.392,1.116,0.392c0.49,0,0.866-0.132,1.116-0.392l2.461-2.454c0.351-0.363,0.836-0.569,1.357-0.57c0,0,0.001,0,0.002,0c0.539,0,1.049,0.219,1.434,0.616c0.765,0.79,0.78,2.058,0.034,2.825l-2.365,2.469C13.542,23.422,12.113,24,10.538,24z M13.113,1.5c-0.079,0-0.194,0.021-0.294,0.124l-9.173,9.469C2.907,11.856,2.5,12.948,2.5,14.167c0,1.244,0.407,2.349,1.146,3.11c0.001,0.001,0.001,0.001,0.001,0.002l3.948,4.089c0.72,0.74,1.737,1.132,2.943,1.132c1.183,0,2.202-0.405,2.946-1.173l2.365-2.469c0.188-0.193,0.172-0.531-0.032-0.741c-0.1-0.103-0.226-0.159-0.356-0.159l0,0c-0.078,0-0.192,0.021-0.29,0.122l-2.46,2.454c-0.526,0.546-1.285,0.84-2.186,0.84c-0.898,0-1.658-0.294-2.195-0.85l-3.937-4.091c-0.546-0.565-0.848-1.371-0.848-2.268c0-0.874,0.302-1.667,0.849-2.231l3.921-4.104c0.67-0.609,1.421-0.912,2.21-0.912c0.878,0,1.315,0.258,2.104,0.845l2.468,1.957c0.172,0.168,0.285,0.189,0.364,0.189l0,0c0.131,0,0.258-0.057,0.357-0.159c0.202-0.21,0.219-0.549,0.034-0.739l-2.311-1.915c-1.026-0.881-1.474-1.02-1.844-1.086c-0.271-0.05-0.51-0.247-0.595-0.51c-0.086-0.263-0.036-0.554,0.155-0.753l2.241-2.347c0.189-0.195,0.173-0.533-0.03-0.743C13.372,1.557,13.245,1.5,13.113,1.5z"
                  fill="#ffffff"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
