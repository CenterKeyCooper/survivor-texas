import styles from './Hero.module.css';

export default function Hero() {
    return (
      <header className={styles.hero}>
        <div className={styles['hero-content']}>
          <h1>Outwit. Outplay. Outlast.</h1>
          <p>The college Survivor experience</p>
          <a href="/seasons" className="btn">Explore Seasons</a>
        </div>
      </header>
    );
  }