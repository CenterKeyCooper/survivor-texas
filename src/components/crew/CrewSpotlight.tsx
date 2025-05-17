import { CrewMember } from '@/types/data';
import CrewCard from './CrewCard';
import Link from 'next/link';
import styles from './CrewSpotlight.module.css';

interface CrewSpotlightProps {
  crew: CrewMember[];
  title?: string;
}

export default function CrewSpotlight({ crew, title = 'Crew Spotlight' }: CrewSpotlightProps) {
  return (
    <section className={styles.crewSpotlight}>
      <div className="container">
        <h2>{title}</h2>
        <div className={styles.crewGrid}>
          {crew.map(member => (
            <CrewCard key={member.id} member={member} />
          ))}
        </div>
        <div className={styles.textCenter}>
          <Link href="/crew" className={styles.btn}>
            View All Crew
          </Link>
        </div>
      </div>
    </section>
  );
}