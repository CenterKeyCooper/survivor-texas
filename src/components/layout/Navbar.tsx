import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoContainer}>
          <Image 
            src="/images/logos/lined_orange.png" 
            alt="Survivor Texas Logo"
            width={100} 
            height={100}
            className={styles.logoImage}
          />
          <span className={styles.logoText}>Survivor Texas</span>
        </Link>
        
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <Link 
            href="/" 
            className={router.pathname === '/' ? styles.active : ''}
          >
            Home
          </Link>
          <Link 
            href="/seasons" 
            className={router.pathname === '/seasons' ? styles.active : ''}
          >
            Seasons
          </Link>
          <Link 
            href="/players" 
            className={router.pathname === '/players' ? styles.active : ''}
          >
            Players
          </Link>
          <Link 
            href="/crew" 
            className={router.pathname === '/crew' ? styles.active : ''}
          >
            Crew
          </Link>
          <Link 
            href="/about" 
            className={router.pathname === '/about' ? styles.active : ''}
          >
            About
          </Link>
        </div>
        
        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} 
          aria-label="Menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}