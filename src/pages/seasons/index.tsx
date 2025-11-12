import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Season } from '@/types/data';
import { fetchSeasons } from '@/lib/data';
import SeasonGrid from '@/components/seasons/SeasonGrid';

interface SeasonsPageProps {
  seasons: Season[];
}

export default function SeasonsPage({ seasons }: SeasonsPageProps) {
  const sortedSeasons = seasons.reverse(); // All seasons, newest first

  return (
    <>
      <Head>
        <title>Seasons - Survivor Texas</title>
        <meta name="description" content="Explore all seasons of Survivor Texas, from the inaugural season to the latest competition." />
      </Head>

      <div className="page">
        <div className="header">
          <h1 className="title">Seasons</h1>
          <p>Relive every moment of competition, strategy, and triumph across all seasons of Survivor Texas.</p>
        </div>
        <section className="vertical-padding">
          <SeasonGrid seasons={sortedSeasons} />
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




