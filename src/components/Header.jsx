import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="scroll-rail">
        <i></i>
      </div>

      <header className="site-header">
        <nav className="nav-inner">
          <a className="logo" href="#top" onClick={handleLinkClick}>
            <b>Varun</b>
          </a>

          {/* Desktop Nav Links */}
          <ul className="nav-links desktop-nav">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#experience">Experience</a>
            </li>
            <li>
              <a href="#journey">Journey</a>
            </li>
            <li>
              <a href="#skills">Skills</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className={`hamburger-btn ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span className="hamburger-line line-1"></span>
            <span className="hamburger-line line-2"></span>
            <span className="hamburger-line line-3"></span>
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <>
          <div
            className="mobile-menu-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="mobile-menu-drawer" role="dialog" aria-modal="true">
            <div className="mobile-menu-header">
              <span className="mobile-menu-label">NAVIGATION</span>
              <button
                className="mobile-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <ul className="mobile-nav-list">
              <li>
                <a href="#about" onClick={handleLinkClick}>
                  <span className="nav-num">01</span> About
                </a>
              </li>
              <li>
                <a href="#projects" onClick={handleLinkClick}>
                  <span className="nav-num">02</span> Projects
                </a>
              </li>
              <li>
                <a href="#experience" onClick={handleLinkClick}>
                  <span className="nav-num">03</span> Experience
                </a>
              </li>
              <li>
                <a href="#journey" onClick={handleLinkClick}>
                  <span className="nav-num">04</span> Journey
                </a>
              </li>
              <li>
                <a href="#skills" onClick={handleLinkClick}>
                  <span className="nav-num">05</span> Skills
                </a>
              </li>
              <li>
                <a href="#contact" onClick={handleLinkClick}>
                  <span className="nav-num">06</span> Contact
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
