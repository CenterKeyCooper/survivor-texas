import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Season } from '@/types/data';
import { fetchSeasons } from '@/lib/data';
import SeasonCard from '@/components/seasons/SeasonCard';
import SeasonGrid from '@/components/seasons/SeasonGrid';
import styles from './SeasonsPage.module.css';

interface SeasonsPageProps {
  seasons: Season[];
}

export default function SeasonsPage({ seasons }: SeasonsPageProps) {
  const featuredSeason = seasons[seasons.length - 1]; // Most recent season
  const otherSeasons = seasons.slice(0, -1).reverse(); // All others, newest first

  return (
    <>
      <Head>
        <title>Seasons - Survivor Texas</title>
        <meta name="description" content="Explore all seasons of Survivor Texas, from the inaugural season to the latest competition." />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Survivor Texas Seasons</h1>
          <p>Relive every moment of competition, strategy, and triumph across all seasons of Survivor Texas.</p>
        </div>

        {featuredSeason && (
          <section className={styles.featuredSection}>
            <h2>Latest Season</h2>
            <SeasonCard season={featuredSeason} isFeatured={true} />
          </section>
        )}

        <section className={styles.allSeasonsSection}>
          <h2>All Seasons</h2>
          <SeasonGrid seasons={otherSeasons} />
        </section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const seasons = await fetchSeasons();
  
  return {
    props: {
      seasons,
    },
  };
};
