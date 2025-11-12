import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Season, Player } from '@/types/data';
import { fetchSeasons, fetchPlayers, getPlayersBySeason } from '@/lib/data';
import PlayerCard from '@/components/players/PlayerCard';
import styles from './SeasonDetailPage.module.css';
import SeasonHero from '@/components/seasons/SeasonHero';

interface SeasonDetailPageProps {
  season: Season;
  players: Player[];
}

export default function SeasonDetailPage({ season, players }: SeasonDetailPageProps) {
  const winner = players.find(player => player.id === season.winner);
  const finalists = players.filter(player => player.placement <= 3).sort((a, b) => a.placement - b.placement);
  const otherPlayers = players.filter(player => player.placement > 3).sort((a, b) => a.placement - b.placement);
  const isVerticalEpisodes = season.seasonNumber <= 2;

  return (
    <>
      <Head>
        <title>{`Season ${season.seasonNumber}: ${season.title} - Survivor Texas`}</title>
        <meta name="description" content={season.description} />
      </Head>

      {/* Hero Section */}
      <SeasonHero season={season} numberOfPlayers={players.length}/>

      {/* Season Description */}
      <section className={`section-no-margins translucent-background ${styles.paddedSection}`}>
        <div className={`description ${styles.description}`}>
          <h3>About This Season</h3>
          <p>{season.description}</p>
        </div>
      </section>

      {/* Winner Section */}
      {winner && (
        <section className={`section-no-margins ${styles.paddedSection}`}>
          <h3>Winner</h3>
          <div className={styles.winnerCard}>
            <PlayerCard player={winner} />
          </div>
        </section>
      )}

      {/* Finalists Section */}
      {finalists.length > 0 && (
        <section className={`section-no-margins translucent-background ${styles.paddedSection}`}>
          <h3>Finalists</h3>
          <div className={styles.playersGrid}>
            {finalists.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </section>
      )}

      {/* Episodes (Collapsible) */}
      {season.episodesPlaylistId && (
        <section className={`section-no-margins ${styles.paddedSection}`}>
          <details className={styles.episodesDetails} open>
            <summary className={`episodesSummary ${styles.episodesSummary}`}>Episodes</summary>
            <div className={`${styles.episodesEmbedWrapper} ${isVerticalEpisodes ? styles.aspect9x16 : styles.aspect16x9}`}>
              <iframe 
                className={styles.episodesEmbed}
                src={`https://www.youtube.com/embed/videoseries?list=${season.episodesPlaylistId}`}
                title={`Season ${season.seasonNumber} Episodes Playlist`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </details>
        </section>
      )}

      {/* Season Images Gallery */}
      {season.images && season.images.length > 0 && (
        <section className={`section-no-margins ${styles.paddedSection}`}>
          <h3>Season Gallery</h3>
          <div className={styles.gallery}>
            {season.images.map((image, index) => (
              <div key={index} className={styles.galleryItem}>
                <Image
                  src={`/images/seasons/${season.seasonNumber}/${image}`}
                  alt={`Season ${season.seasonNumber} - Image ${index + 1}`}
                  width={300}
                  height={200}
                  className={styles.galleryImage}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Players Section */}
      <section className={`section-no-margins translucent-background ${styles.paddedSection}`}>
        <h3>All Players</h3>
        <div className="grid">
          {[...finalists, ...otherPlayers].map(player => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className={styles.navigation}>
        <Link href="/seasons" className="backLink">
          ← Back to All Seasons
        </Link>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const seasons = await fetchSeasons();
  const paths = seasons.map(season => ({
    params: { id: season.seasonNumber.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const seasons = await fetchSeasons();
  const players = await fetchPlayers();
  
  const season = seasons.find(s => s.seasonNumber.toString() === params?.id);
  const seasonPlayers = getPlayersBySeason(players, season?.seasonNumber || 0);

  if (!season) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      season,
      players: seasonPlayers,
    },
  };
};
