import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="logo">Survivor Texas</Link>
        
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            href="/" 
            className={router.pathname === '/' ? 'active' : ''}
          >
            Home
          </Link>
          <Link 
            href="/seasons" 
            className={router.pathname === '/seasons' ? 'active' : ''}
          >
            Seasons
          </Link>
          <Link 
            href="/players" 
            className={router.pathname === '/players' ? 'active' : ''}
          >
            Players
          </Link>
          <Link 
            href="/crew" 
            className={router.pathname === '/crew' ? 'active' : ''}
          >
            Crew
          </Link>
          <Link 
            href="/about" 
            className={router.pathname === '/about' ? 'active' : ''}
          >
            About
          </Link>
        </div>
        
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
          aria-label="Menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <style jsx>{`
        .navbar {
          background-color: var(--bg-darker);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          background-image: var(--wood-texture);
          background-blend-mode: overlay;
        }
        
        .navbar .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          color: var(--accent-orange);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        
        .nav-links a {
          color: var(--text-light);
          font-weight: bold;
          letter-spacing: 1px;
          position: relative;
        }
        
        .nav-links a.active {
          color: var(--accent-orange);
        }
        
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--accent-orange);
          transition: width 0.3s ease;
        }
        
        .nav-links a:hover::after {
          width: 100%;
        }
        
        .hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px;
        }
        
        .hamburger span {
          display: block;
          width: 25px;
          height: 3px;
          background-color: var(--text-light);
          margin: 4px 0;
          transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .nav-links {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background-color: var(--bg-darker);
            flex-direction: column;
            align-items: center;
            padding: 2rem 0;
            transition: left 0.3s ease;
          }
        
          .nav-links.active {
            left: 0;
          }
        
          .hamburger {
            display: block;
          }
        
          .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
          }
        
          .hamburger.active span:nth-child(2) {
            opacity: 0;
          }
        
          .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
          }
        }
      `}</style>
    </nav>
  );
}