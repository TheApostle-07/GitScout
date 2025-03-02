// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [hoveredLink, setHoveredLink] = React.useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Update the header style to use a light background and dark text
  const headerStyle = {
    backgroundColor: '#f7f7f7',
    width: '100%',
    padding: '1rem',
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const headerInnerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  };

  // Logo styling with dark text
  const logoStyle = {
    color: '#333',
    margin: 0,
    fontWeight: '600',
    fontSize: '1.5rem',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  const navStyle = {
    display: 'flex',
    gap: '1rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  // Base style for nav links now with dark text on light background
  const navButtonBaseStyle = {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    border: '0px solid transparent',
    borderRadius: '4px',
    margin: 0,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#333',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    fontWeight: '400',
    boxSizing: 'border-box',
  };

  // Update hover and active styles accordingly:
  const getNavButtonStyle = (path) => {
    if (hoveredLink === path) {
      return {
        ...navButtonBaseStyle,
        backgroundColor: '#e0e0e0',
      };
    }
    if (isActive(path)) {
      return {
        ...navButtonBaseStyle,
        border: '1px solid #333',
      };
    }
    return navButtonBaseStyle;
  };

  return (
    <header style={headerStyle}>
      <div style={headerInnerStyle}>
        <h2 style={{ margin: 0 }}>
          <Link to="/" style={logoStyle}>
            GitScout
          </Link>
        </h2>
        <ul style={navStyle}>
          <li>
            <Link
              to="/"
              style={getNavButtonStyle('/')}
              onMouseEnter={() => setHoveredLink('/')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              style={getNavButtonStyle('/about')}
              onMouseEnter={() => setHoveredLink('/about')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              style={getNavButtonStyle('/contact')}
              onMouseEnter={() => setHoveredLink('/contact')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;