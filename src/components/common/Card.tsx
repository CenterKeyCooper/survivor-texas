import styles from './Card.module.css';
import { ReactNode } from 'react';

interface CardProps {
  imageURL?: string;
  title: string;
  titleStyle?: React.CSSProperties;
  content: ReactNode;
}

export default function Card({ imageURL, title, titleStyle, content }: CardProps) {
  return (
    <div className={styles.card}>
      <div 
        className={styles.cardImage}
        style={{ backgroundImage: `url(${imageURL || '/images/placeholder.jpg'})` }}
      />
      <div className={styles.cardContent}>
        <h3 style={titleStyle}>{title}</h3>
        {content}
      </div>
    </div>
  );
}