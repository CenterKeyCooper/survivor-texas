import { useState, useEffect } from 'react';
import { CrewMember } from '@/types/data';
import { fetchCrew, sortCrewBySeasons } from '@/lib/data';
import CrewCard from '@/components/crew/CrewCard';
import SearchBar from '@/components/common/SearchBar';

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [filteredCrew, setFilteredCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const crewData = await fetchCrew();
        const sortedCrew = sortCrewBySeasons(crewData);
        setCrew(sortedCrew);
        setFilteredCrew(sortedCrew);
        setLoading(false);
      } catch {
        setError('Failed to load crew data');
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = crew.filter(member => 
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.roles.some(role => role.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredCrew(filtered);
  };

  if (loading) return <div className="loading">Loading crew members...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h1 className="title">Meet the Crew</h1>
      <p className="subtitle">The (mostly) unseen heroes that design, produce, and edit the seasons</p>
      
      <SearchBar onSearch={handleSearch} placeholder="Search crew by name or role..." />

      <div className="grid vertical-padding">
        {filteredCrew.length > 0 ? (
          filteredCrew.map(member => (
            <CrewCard key={member.id} member={member} />
          ))
        ) : (
          <div className="noResults">No crew members found matching your search</div>
        )}
      </div>
    </div>
  );
}