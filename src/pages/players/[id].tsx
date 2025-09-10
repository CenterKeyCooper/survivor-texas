import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Player, Tribe } from '@/types/data';
import { fetchPlayers, fetchTribes, getTribeColor } from '@/lib/data';
import styles from './PlayerDetailPage.module.css';

export default function PlayerDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [player, setPlayer] = useState<Player | null>(null);
  const [tribes, setTribes] = useState<Record<string, Tribe>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlayer() {
      if (!id || typeof id !== 'string') return;
      
      try {
        const [playersData, tribesData] = await Promise.all([
          fetchPlayers(),
          fetchTribes()
        ]);
        
        const foundPlayer = playersData[id];
        
        if (foundPlayer) {
          setPlayer(foundPlayer);
        } else {
          setError('Player not found');
        }
        setTribes(tribesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load player data');
        setLoading(false);
      }
    }
    loadPlayer();
  }, [id]);

  const getPlacementText = (placement: number) => {
    if (placement === 1) return 'Winner';
    if (placement === 2) return 'Runner-up';
    if (placement === 3) return '3rd Place';
    return `${placement}th Place`;
  };

  const getPlacementClass = (placement: number) => {
    if (placement === 1) return styles.winner;
    if (placement <= 3) return styles.finalist;
    return styles.placement;
  };

  const getPlayerTribeColor = () => {
    if (!player || !tribes || player.tribes.length === 0) return '#FFFFFF';
    return getTribeColor(tribes, player.tribes[0]);
  };

  const getTribeNameColor = (tribeId: string) => {
    if (!tribes) return '#FFFFFF';
    return getTribeColor(tribes, tribeId);
  };

  if (loading) return <div className={styles.loading}>Loading player...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!player) return <div className={styles.error}>Player not found</div>;

  return (
    <div className={styles.playerDetailPage}>
      <div className={styles.playerHeader}>
        <div 
          className={styles.playerImage}
          style={{ backgroundImage: `url(/images/players/${player.image || 'placeholder.jpg'})` }}
        />
        <div className={styles.playerInfo}>
          <h1 style={{ color: getPlayerTribeColor() }}>{player.name}</h1>
          <p className={`${styles.placement} ${getPlacementClass(player.placement)}`}>
            {getPlacementText(player.placement)}
          </p>
          <div className={styles.details}>
            <p><strong>Season:</strong> {player.seasons.join(', ')}</p>
            <p><strong>Tribes:</strong> {player.tribes.map((tribe, index) => (
              <span key={tribe} style={{ color: getTribeNameColor(tribe) }}>
                {tribe}{index < player.tribes.length - 1 ? ', ' : ''}
              </span>
            ))}</p>
          </div>
        </div>
      </div>

      {player.bio && (
        <div className={styles.bioSection}>
          <h2>Biography</h2>
          <p>{player.bio}</p>
        </div>
      )}

      {player.memorableMoments.length > 0 && (
        <div className={styles.momentsSection}>
          <h2>Memorable Moments</h2>
          <ul>
            {player.memorableMoments.map((moment, index) => (
              <li key={index}>{moment}</li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(player.stats).length > 0 && (
        <div className={styles.statsSection}>
          <h2>Statistics</h2>
          <div className={styles.statsGrid}>
            {Object.entries(player.stats).map(([key, value]) => (
              <div key={key} className={styles.statItem}>
                <span className={styles.statLabel}>{key}:</span>
                <span className={styles.statValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
