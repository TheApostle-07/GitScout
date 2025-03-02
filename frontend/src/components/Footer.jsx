import React, { useState } from 'react';
import '../styles/Footer.css';

function Footer() {
  const [hover, setHover] = useState(false);

  return (
    <footer
      className={`footer ${hover ? 'footer-hover' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p>© {new Date().getFullYear()} GitScout. All rights reserved.</p>
    </footer>
  );
}

export default Footer;