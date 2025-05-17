import { Season } from '@/types/data';
import SeasonCard from './SeasonCard';
import styles from './SeasonGrid.module.css';

interface SeasonGridProps {
  seasons: Season[];
  title?: string;
}

export default function SeasonGrid({ seasons, title = 'Previous Seasons' }: SeasonGridProps) {
  return (
    <section className={styles.seasonGrid}>
      <div className="container">
        <h2>{title}</h2>
        <div className={styles.grid}>
          {seasons.map(season => (
            <SeasonCard key={season.seasonNumber} season={season} />
          ))}
        </div>
      </div>
    </section>
  );
}