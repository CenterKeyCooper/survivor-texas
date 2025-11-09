import { useState, useEffect } from 'react';
import { Player, Tribe } from '@/types/data';
import { fetchPlayers, fetchTribes } from '@/lib/data';
import PlayerCard from '@/components/players/PlayerCard';
import SearchBar from '@/components/common/SearchBar';
import styles from './PlayersPage.module.css';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [tribes, setTribes] = useState<Record<string, Tribe>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [playersData, tribesData] = await Promise.all([
          fetchPlayers(),
          fetchTribes()
        ]);
        
        // Convert the object to an array
        const playersArray = Object.values(playersData);
        // Sort by placement (winners first, then by placement)
        const sortedPlayers = playersArray.sort((a, b) => a.placement - b.placement);
        setPlayers(sortedPlayers);
        setFilteredPlayers(sortedPlayers);
        setTribes(tribesData);
        setLoading(false);
      } catch {
        setError('Failed to load players data');
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = players.filter(player => 
      player.name.toLowerCase().includes(query.toLowerCase()) ||
      player.tribes.some(tribe => tribe.toLowerCase().includes(query.toLowerCase())) ||
      player.seasons.some(season => season.toString().includes(query))
    );
    setFilteredPlayers(filtered);
  };

  if (loading) return <div className={styles.loading}>Loading players...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.playersPage}>
      <h1>Survivor Texas Players</h1>
      <p className={styles.subtitle}>Meet the contestants who competed for the title of Sole Survivor</p>
      
      <SearchBar onSearch={handleSearch} placeholder="Search players by name, tribe, or season..." />
      
      <div className={styles.playersGrid}>
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <PlayerCard key={player.id} player={player} tribes={tribes} />
          ))
        ) : (
          <div className={styles.noResults}>No players found matching your search</div>
        )}
      </div>
    </div>
  );
}
