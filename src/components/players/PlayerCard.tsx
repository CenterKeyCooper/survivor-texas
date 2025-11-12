import Link from 'next/link';
import { Player, Tribe } from '@/types/data';
import { getTribeColor } from '@/lib/data';
import styles from './PlayerCard.module.css';

interface PlayerCardProps {
  player: Player;
  tribes?: Record<string, Tribe>;
}

export default function PlayerCard({ player, tribes }: PlayerCardProps) {
  const getPlacementText = (placement: number) => {
    if (placement === 1) return 'Winner';
    if (placement === 2) return 'Runner-up';
    if (placement === 3) return '3rd Place';
    return `${placement}th Place`;
  };

  const getPlacementClass = (placement: number) => {
    if (placement === 1) return "winner";
    if (placement <= 3) return "finalist";
    return "placement";
  };

  const getPlayerTribeColor = () => {
    if (!tribes || player.tribes.length === 0) return '#FFFFFF';
    return getTribeColor(tribes, player.tribes[0]);
  };

  const getTribeNameColor = (tribeId: string) => {
    if (!tribes) return '#FFFFFF';
    return getTribeColor(tribes, tribeId);
  };

  return (
    <div className="card">
      <div 
        className={`cardImage ${styles.playerImage}`}
        style={{ backgroundImage: `url(/images/players/${player.image || 'placeholder.png'})` }}
      />
      <div className={`cardContent ${styles.playerContent}`}>
        <h3 style={{ color: getPlayerTribeColor() }}>{player.name}</h3>
        <p className={`placement ${getPlacementClass(player.placement)}`}>
          {getPlacementText(player.placement)}
        </p>
        <p className={styles.seasons}>Season {player.seasons.join(', ')}</p>
        <p className={styles.tribes}>
          Tribes: {player.tribes.map((tribe, index) => (
            <span key={tribe} style={{ color: getTribeNameColor(tribe) }}>
              {tribe}{index < player.tribes.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        <Link 
          href={`/players/${player.id}`} 
          className="small-btn"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
