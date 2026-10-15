import React from 'react';

export default function Header() {
  return (
    <>
      <div className="scroll-rail">
        <i></i>
      </div>

      <header className="site-header">
        <nav className="nav-inner">
          <a className="logo" href="#top">
            <b>Varun</b>
          </a>
          <ul className="nav-links">
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
        </nav>
      </header>
    </>
  );
}
