import React from 'react';

export default function Contact() {
  return (
    <section className="section" id="contact">
      <h2 className="section-title reveal" data-delay="1">
        Contact
      </h2>
      <p
        className="reveal"
        data-delay="2"
        style={{
          fontFamily: "'Inter Tight', sans-serif",
          color: '#94a3b8',
          marginBottom: '1.5rem',
        }}
      >
        Get in touch for cloud and devops engineering roles, collaborative projects, or technical inquiries.
      </p>

      <div className="contact-grid reveal" data-delay="3">
        <a href="mailto:varunnagote@example.com" className="contact-card">
          <span>Email</span> &rarr;
        </a>
        <a
          href="https://github.com/itzVarun1426"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <span>GitHub</span> &rarr;
        </a>
        <a
          href="https://www.linkedin.com/in/varunn26/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <span>LinkedIn</span> &rarr;
        </a>
        <a
          href="https://leetcode.com/u/Coder_Vilgax/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <span>LeetCode</span> &rarr;
        </a>
        <a
          href="https://wa.me/8605866254"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <span>WhatsApp</span> &rarr;
        </a>
        <a
          href="https://drive.google.com/file/d/1NYzKZVEK61hjrTiyJXbT4GjgL_sDe14Y/view"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <span>Resume PDF</span> &rarr;
        </a>
      </div>
    </section>
  );
}
