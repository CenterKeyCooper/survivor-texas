import Image from 'next/image';
import Link from 'next/link';
import { Season } from '@/types/data';
import styles from './SeasonHero.module.css';

interface SeasonHeroProps {
  season: Season;
  numberOfPlayers: number;
  viewMore?: boolean;
}

export default function SeasonHero({ season, numberOfPlayers, viewMore = false }: SeasonHeroProps) {
  return (
    <div className={styles.hero}>
        <div 
        className={styles.heroImage}
        style={{ backgroundImage: `url(/images/seasons/${season.seasonNumber}/${season.banner})` }}
        />
        <div className={styles.heroOverlay}>
        <div className={styles.heroContent}>
            <div className={styles.seasonLogo}>
            {season.logo && (
                <Image
                src={`/images/logos/${season.logo}`}
                alt={`Season ${season.seasonNumber} Logo`}
                width={200}
                height={200}
                className={styles.logoImage}
                />
            )}
            </div>
            <h1>Season {season.seasonNumber}</h1>
            <h2>{season.title}</h2>
            <div className={styles.seasonMeta}>
            <span>{season.location}</span>
            <span>{season.semesterFilmed}</span>
            <span>{numberOfPlayers} Players</span>
            </div>
            {viewMore && (
                <div className="container">
                    <Link href={`/seasons/${season.seasonNumber}`} className="btn">
                        View More
                    </Link>
                </div>
            )}
        </div>
        </div>
    </div>
  );
}