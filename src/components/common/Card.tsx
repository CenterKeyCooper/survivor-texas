import styles from './Card.module.css';
import { ReactNode } from 'react';

interface CardProps {
  imageURL?: string;
  imageStyle?: React.CSSProperties;
  title: string;
  content: ReactNode;
}

export default function Card({ imageURL, imageStyle, title, content }: CardProps) {
  return (
    <div className={styles.card}>
      <div 
        className={styles.cardImage}
        style={{ ...imageStyle, backgroundImage: `url(${imageURL || '/images/placeholder.jpg'})` }}
      />
      <div className={styles.cardContent}>
        <h3>{title}</h3>
        {content}
      </div>
    </div>
  );
}