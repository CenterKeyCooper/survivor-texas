import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CrewMember } from '@/types/data';
import { fetchCrew } from '@/lib/data';
import Link from 'next/link';
import styles from './CrewMemberPage.module.css';

export default function CrewMemberPage() {
  const router = useRouter();
  const { id } = router.query;
  const [member, setMember] = useState<CrewMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMember() {
      try {
        const crewData = await fetchCrew();
        const foundMember = crewData.find(m => m.id.toString() === id);
        
        if (foundMember) {
          setMember(foundMember);
        } else {
          setError('Crew member not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load crew data');
        setLoading(false);
      }
    }

    if (id) loadMember();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading crew member...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!member) return <div className={styles.error}>Crew member not found</div>;

  return (
    <div className={styles.crewMemberPage}>
      <Link href="/crew" className={styles.backLink}>
        ← Back to All Crew
      </Link>
      
      <div className={styles.profileHeader}>
        <div className={styles.profileImageContainer}>
          <img 
            src={`/images/crew/${member.photo || 'placeholder.jpg'}`} 
            alt={member.name}
            className={styles.profileImage}
          />
        </div>
        <div className={styles.profileInfo}>
          <h1>{member.name}</h1>
          <p className={styles.role}>{member.roles.join(', ')}</p>
          <p className={styles.seasons}>Seasons: {member.seasons.join(', ')}</p>
          {member.social && (
            <a href={member.social.startsWith('http') ? member.social : `https://${member.social}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className={styles.socialLink}>
              {member.social.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h2>Contributions</h2>
        <ul className={styles.contributions}>
          {member.contributions.map((contribution, index) => (
            <li key={index}>{contribution}</li>
          ))}
        </ul>
      </div>

      {member.memories && (
        <div className={styles.detailsSection}>
          <h2>Memorable Moments</h2>
          <p>{member.memories}</p>
        </div>
      )}

      {member.fun_fact && (
        <div className={styles.detailsSection}>
          <h2>Fun Fact</h2>
          <p>{member.fun_fact}</p>
        </div>
      )}

      {member.note && (
        <div className={styles.detailsSection}>
          <h2>Note</h2>
          <p>{member.note}</p>
        </div>
      )}
    </div>
  );
}