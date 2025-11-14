import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
    return (
      <header className={styles.hero}>
        <div className={styles['hero-content']}>
          <h1>Outwit. Outplay. Outlast.</h1>
          <p>The college Survivor experience</p>
          <Link  href="/seasons" className="btn">Explore Seasons</Link>
        </div>
      </header>
    );
  }