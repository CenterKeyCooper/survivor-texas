import Link from 'next/link';
import { CrewMember } from '@/types/data';
import styles from './CrewCard.module.css';

interface CrewCardProps {
  member: CrewMember;
}

export default function CrewCard({ member }: CrewCardProps) {
  return (
    <div className={styles.crewCard}>
      <div 
        className={styles.crewImage}
        style={{ backgroundImage: `url(/images/crew/${member.photo || 'placeholder.jpg'})` }}
      />
      <div className={styles.crewContent}>
        <h3>{member.name}</h3>
        <p className={styles.role}>{member.roles?.join(', ') || 'Crew Member'}</p>
        <p>Seasons: {member.seasons?.join(', ') || 'N/A'}</p>
        <Link 
          href={`/crew/${member.id}`} 
          className={`${styles.btn} ${styles.small}`}
          legacyBehavior
        >
          <a className={`${styles.btn} ${styles.small}`}>View Profile</a>
        </Link>
      </div>
    </div>
  );
}