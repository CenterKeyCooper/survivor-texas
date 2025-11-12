import Link from 'next/link';
import { Player, Tribe } from '@/types/data';
import { getTribeColor } from '@/lib/data';
import Card from '../common/Card'
import styles from './PlayerCard.module.css';
import playerStyles from '../../styles/players.module.css';

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
    if (placement === 1) return playerStyles.winner;
    if (placement <= 3) return playerStyles.finalist;
    return playerStyles.placement;
  };

  const getPlayerTribeColor = () => {
    if (!tribes || player.tribes.length === 0) return '#FFFFFF';
    return getTribeColor(tribes, player.tribes[0]);
  };

  const getTribeNameColor = (tribeId: string) => {
    if (!tribes) return '#FFFFFF';
    return getTribeColor(tribes, tribeId);
  };

  const cardContent = (
    <>
      <p className={`${getPlacementClass(player.placement)}`}>
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
    </>
  )
  return (
    <Card
      imageURL={`/images/players/${player.image}`}
      title={player.name}
      titleStyle={{ color: getPlayerTribeColor() }}
      content={cardContent}
    />
  );
}
