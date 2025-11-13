import { useState, useEffect } from 'react';
import { Player, Tribe } from '@/types/data';
import { fetchPlayers, fetchTribes } from '@/lib/data';
import PlayerCard from '@/components/players/PlayerCard';
import SearchBar from '@/components/common/SearchBar';

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
        // Sort by seasons and placement (newest to oldest)
        const sortPlayers = (a: Player, b: Player) => {
          const mostRecentSeasonA = a.seasons.sort().at(a.seasons.length - 1) ?? -1
          const mostRecentSeasonB = b.seasons.sort().at(b.seasons.length - 1) ?? -1
          // if (mostRecentSeasonA == mostRecentSeasonB) {
          //   return a.placement - b.placement
          // }
          // return mostRecentSeasonB - mostRecentSeasonA
          if (a.placement == b.placement) {
            return mostRecentSeasonA - mostRecentSeasonB
          }
          return a.placement - b.placement
        }
        const sortedPlayers = playersArray.sort(sortPlayers);
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

  if (loading) return <div className="loading">Loading players...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h1 className="title">Meet the Players</h1>
      <p className="subtitle">The contestants who competed for the title of Sole Survivor</p>
      
      <SearchBar onSearch={handleSearch} placeholder="Search players by name, tribe, or season..." />

      <div className="grid vertical-padding">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <PlayerCard key={player.id} player={player} tribes={tribes} />
          ))
        ) : (
          <div className="noResults">No players found matching your search</div>
        )}
      </div>
    </div>
  );
}
