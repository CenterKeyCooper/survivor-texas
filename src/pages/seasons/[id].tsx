import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Season, Player } from '@/types/data';
import { fetchSeasons, fetchPlayers, getPlayersBySeason } from '@/lib/data';
import PlayerCard from '@/components/players/PlayerCard';
import styles from './SeasonDetailPage.module.css';

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

      <div className="container">
        {/* Hero Section */}
        <div className={styles.hero}>
          <div 
            className={styles.heroImage}
            style={{ backgroundImage: `url(/images/seasons/${season.seasonNumber}/${season.banner})` }}
          />
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <div className={styles.seasonLogo}>
                {season.logo && (
                  <Image
                    src={`/images/logos/${season.logo}`}
                    alt={`Season ${season.seasonNumber} Logo`}
                    width={200}
                    height={200}
                    className={styles.logoImage}
                  />
                )}
              </div>
              <h1>Season {season.seasonNumber}</h1>
              <h2>{season.title}</h2>
              <div className={styles.seasonMeta}>
                <span>{season.location}</span>
                <span>{season.semesterFilmed}</span>
                <span>{players.length} Players</span>
              </div>
            </div>
          </div>
        </div>

        {/* Season Description */}
        <section className={styles.descriptionSection}>
          <div className={styles.description}>
            <h3>About This Season</h3>
            <p>{season.description}</p>
          </div>
        </section>

        {/* Winner Section */}
        {winner && (
          <section className={styles.winnerSection}>
            <h3>Winner</h3>
            <div className={styles.winnerCard}>
              <PlayerCard player={winner} />
            </div>
          </section>
        )}

        {/* Finalists Section */}
        {finalists.length > 0 && (
          <section className={styles.finalistsSection}>
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
          <section className={styles.episodesSection}>
            <details className={styles.episodesDetails} open>
              <summary className={styles.episodesSummary}>Episodes</summary>
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
          <section className={styles.gallerySection}>
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
        <section className={styles.allPlayersSection}>
          <h3>All Players</h3>
          <div className={styles.playersGrid}>
            {[...finalists, ...otherPlayers].map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className={styles.navigation}>
          <Link href="/seasons" className={styles.backButton}>
            ← Back to All Seasons
          </Link>
        </div>
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
