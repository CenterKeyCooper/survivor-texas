import { Season } from '@/types/data';
import SeasonCard from './SeasonCard';
import styles from './SeasonGrid.module.css';

interface SeasonGridProps {
  seasons: Season[];
  title?: string;
}

export default function SeasonGrid({ seasons, title }: SeasonGridProps) {
  return (
    <div>
      {title && <h2>{title}</h2>}
      <div className="grid">
        {seasons.map(season => (
          <SeasonCard key={season.seasonNumber} season={season} />
        ))}
      </div>
    </div>
  );
}