import { useState, useEffect } from 'react';
import { CrewMember } from '@/types/data';
import { fetchCrew } from '@/lib/data';
import CrewCard from '@/components/crew/CrewCard';
import SearchBar from '@/components/common/SearchBar';
import styles from './CrewPage.module.css';

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [filteredCrew, setFilteredCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const crewData = await fetchCrew();
        setCrew(crewData);
        setFilteredCrew(crewData);
        setLoading(false);
      } catch (err) {
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

  if (loading) return <div className={styles.loading}>Loading crew members...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.crewPage}>
      <h1>Survivor Texas Crew</h1>
      <p className={styles.subtitle}>Meet the crew</p>
      
      <SearchBar onSearch={handleSearch} placeholder="Search crew by name or role..." />
      
      <div className={styles.crewGrid}>
        {filteredCrew.length > 0 ? (
          filteredCrew.map(member => (
            <CrewCard key={member.id} member={member} />
          ))
        ) : (
          <div className={styles.noResults}>No crew members found matching your search</div>
        )}
      </div>
    </div>
  );
}