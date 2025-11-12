import Link from 'next/link';
import { CrewMember } from '@/types/data';
import Card from '../common/Card'
import crewStyles from '../../styles/crew.module.css';

interface CrewCardProps {
  member: CrewMember;
}

export default function CrewCard({ member }: CrewCardProps) {
  const cardContent = (
    <>
      <p className={crewStyles.role}>{member.roles?.join(', ') || 'Crew Member'}</p>
      <p>Seasons: {member.seasons?.join(', ') || 'N/A'}</p>
      <Link 
        href={`/crew/${member.id}`} 
        className="small-btn"
      >
        View Profile
      </Link>
    </>
  )
  return (
    <Card
      imageURL={`/images/crew/${member.photo}`}
      title={member.name}
      content={cardContent}
    />
  );
}