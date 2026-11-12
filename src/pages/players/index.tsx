import { useState, useEffect, useMemo } from 'react';
import { Player, Tribe } from '@/types/data';
import { fetchPlayers, fetchTribes } from '@/lib/data';
import PlayerCard from '@/components/players/PlayerCard';
import SpoilerGate from '@/components/common/SpoilerGate';
import { useSpoilers } from '@/lib/SpoilerContext';
import { applySpoilers } from '@/lib/spoilers';
import SearchBar from '@/components/common/SearchBar';

export default function PlayersPage() {
  const { data } = useSpoilers();
  const [players, setPlayers] = useState<Player[]>([]);
  const [query, setQuery] = useState('');
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
        setPlayers(Object.values(playersData));
        setTribes(tribesData);
        setLoading(false);
      } catch {
        setError('Failed to load players data');
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Players with a known placement sort by placement (ties: oldest season first);
  // players whose placement is still hidden go last, alphabetically.
  const filteredPlayers = useMemo(() => {
    const q = query.toLowerCase();
    return players
      .map(p => applySpoilers(p, data))
      .filter(player =>
        player.name.toLowerCase().includes(q) ||
        player.tribes.some(tribe => tribe.toLowerCase().includes(q)) ||
        player.seasons.some(season => season.toString().includes(query))
      )
      .sort((a, b) => {
        if (a.placement == null && b.placement == null) return a.name.localeCompare(b.name);
        if (a.placement == null) return 1;
        if (b.placement == null) return -1;
        if (a.placement === b.placement) return Math.max(...a.seasons) - Math.max(...b.seasons);
        return a.placement - b.placement;
      });
  }, [players, data, query]);

  const handleSearch = (q: string) => setQuery(q);

  if (loading) return <div className="loading">Loading players...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h1 className="title">Meet the Players</h1>
      <p className="subtitle">The contestants who competed for the title of Sole Survivor</p>

      <SpoilerGate />
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
