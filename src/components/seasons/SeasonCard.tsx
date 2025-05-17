import Link from 'next/link';
import { Season } from '@/types/data';
import styles from './SeasonCard.module.css';

interface SeasonCardProps {
  season: Season;
  isFeatured?: boolean;
}

export default function SeasonCard({ season, isFeatured = false }: SeasonCardProps) {
  if (isFeatured) {
    return (
      <div className={styles.seasonCard}>
        <div 
          className={styles.seasonCardImage} 
          style={{ backgroundImage: `url(/images/seasons/${season.seasonNumber}/${season.banner || 'placeholder-banner.jpg'})` }}
        />
        <div className={styles.seasonCardContent}>
          <h3>Season {season.seasonNumber}: {season.title}</h3>
          <div className={styles.seasonMeta}>
            <span>{season.location}</span>
            <span>{season.players.length} Players</span>
            <span>Winner: {season.winner || 'TBD'}</span>
          </div>
          <p className={styles.seasonDesc}>
            {season.description || 'An epic season of Survivor Texas with intense challenges and strategic gameplay.'}
          </p>
          <Link href={`/seasons/${season.seasonNumber}`} className={styles.btn}>
            View Season
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gridItem}>
      <div 
        className={styles.gridItemImage}
        style={{ backgroundImage: `url(/images//seasons/${season.seasonNumber}/${season.cover || 'placeholder-banner.jpg'})` }}
      />
      <div className={styles.gridItemContent}>
        <h3>Season {season.seasonNumber}</h3>
        <p className={styles.meta}>{season.title}</p>
        <p>{season.location} • {season.players.length} Players</p>
        <Link href={`/seasons/${season.seasonNumber}`} className={`${styles.btn} ${styles.small}`}>
          View Season
        </Link>
      </div>
    </div>
  );
}