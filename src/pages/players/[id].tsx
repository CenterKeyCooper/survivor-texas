import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Player, Tribe } from '@/types/data';
import { fetchPlayers, fetchTribes, getTribeColor } from '@/lib/data';
import { useMediaQuery } from 'react-responsive';
import styles from './PlayerDetailPage.module.css';
import playerStyles from '../../styles/players.module.css';

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
      } catch {
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
    if (placement === 1) return playerStyles.winner;
    if (placement <= 3) return playerStyles.finalist;
    return playerStyles.placement;
  };

  const getPlayerTribeColor = () => {
    if (!player || !tribes || player.tribes.length === 0) return '#FFFFFF';
    return getTribeColor(tribes, player.tribes[0]);
  };

  const getTribeNameColor = (tribeId: string) => {
    if (!tribes) return '#FFFFFF';
    return getTribeColor(tribes, tribeId);
  };

  const isMobile = useMediaQuery({ query: `(max-width: 768px)` })
  if (loading) return <div className="loading">Loading player...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!player) return <div className="error">Player not found</div>;

  return (
    <div className="page">
      <div className={styles.playerHeader}>
      {!isMobile ? 
        <div className="horizontal-flex">
          <div 
            className={styles.playerImage}
            style={{ backgroundImage: `url(/images/players/${player.image || 'placeholder.jpg'})` }}
          />
          <div className="vertical-flex">
            <div>
              <h1 style={{ color: getPlayerTribeColor() }}>{player.name}</h1>
              <p className={`${getPlacementClass(player.placement)}`}>
                {getPlacementText(player.placement)}
              </p>
              <div className={`horizontal-flex ${styles.details}`}>
                <p><strong>Season:</strong> {player.seasons.join(', ')}</p>
                <p><strong>Tribes:</strong> {player.tribes.map((tribe, index) => (
                  <span key={tribe} style={{ color: getTribeNameColor(tribe) }}>
                    {tribe}{index < player.tribes.length - 1 ? ', ' : ''}
                  </span>
                ))}</p>
              </div>
            </div>
            {player.bio && (
                <p>{player.bio}</p>
              )}
          </div>
        </div>
       :
       <div className="vertical-flex align-center">
        <div 
            className={styles.playerImage}
            style={{ backgroundImage: `url(/images/players/${player.image || 'placeholder.jpg'})` }}
          />
              <h1 style={{ color: getPlayerTribeColor() }}>{player.name}</h1>
              <div className={`horizontal-flex ${styles.details}`}>
              <p className={`${getPlacementClass(player.placement)}`}>
                {getPlacementText(player.placement)}
              </p>
                <p><strong>Season:</strong> {player.seasons.join(', ')}</p>
                <p><strong>Tribes:</strong> {player.tribes.map((tribe, index) => (
                  <span key={tribe} style={{ color: getTribeNameColor(tribe) }}>
                    {tribe}{index < player.tribes.length - 1 ? ', ' : ''}
                  </span>
                ))}</p>
              </div>
            {player.bio && (
              <div className="text-center">
                <p>{player.bio}</p>
                </div>
              )}
        </div>}
      </div>

      {player.memorableMoments.length > 0 && (
        <div className={`sectionWithBorder ${styles.momentsSection}`}>
          <h2>Memorable Moments</h2>
          <ul>
            {player.memorableMoments.map((moment, index) => (
              <li key={index} className="listItemWithBullet">{moment}</li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(player.stats).length > 0 && (
        <div className={`sectionWithBorder ${styles.statsSection}`}>
          <h2>Statistics</h2>
          <div className={styles.statsGrid}>
            {Object.entries(player.stats).map(([key, value]) => (
              <div key={key} className={styles.statItem}>
                <span className={`statLabel ${styles.statLabel}`}>{key}:</span>
                <span className={`statValue ${styles.statValue}`}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
