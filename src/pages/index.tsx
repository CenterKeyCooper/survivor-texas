import { useState, useEffect } from 'react';
import Head from 'next/head';
import Hero from '@/components/home/Hero';
import SeasonCard from '@/components/seasons/SeasonCard';
import SeasonGrid from '@/components/seasons/SeasonGrid';
import CrewSpotlight from '@/components/crew/CrewSpotlight';
import { fetchSeasons, fetchCrew, getFeaturedSeason, getRecentSeasons, getRandomCrewMembers } from '@/lib/data';

export default function Home() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [seasonsData, crewData] = await Promise.all([
          fetchSeasons(),
          fetchCrew()
        ]);
        
        setSeasons(seasonsData);
        setCrew(crewData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const featuredSeason = getFeaturedSeason(seasons);
  const recentSeasons = getRecentSeasons(seasons);
  const spotlightCrew = getRandomCrewMembers(crew, 4);

  return (
    <>
      <Head>
        <title>Survivor Texas - Home</title>
        <meta name="description" content="The ultimate college Survivor experience" />
      </Head>
      
      <Hero />
      
      {/* Featured Season */}
      <section className="featured-season">
        <div className="container">
          <h2>Featured Season</h2>
          {featuredSeason && <SeasonCard season={featuredSeason} isFeatured />}
        </div>
      </section>

      {/* Recent Seasons */}
      <SeasonGrid seasons={recentSeasons} />

      {/* Crew Spotlight */}
      <CrewSpotlight crew={spotlightCrew} />

      {/* About Section */}
      <section className="about">
        <div className="container">
          <h2>About Survivor Texas</h2>
          <div className="about-content">
            <p>Survivor Texas is a student-run organization at the University of Texas at Austin that brings the excitement of the hit TV show Survivor to campus. Since our first season in 2023, we've created an immersive experience that tests players' physical, mental, and social skills.</p>
            <p>Our mission is to build community, foster strategic thinking, and create unforgettable memories through this unique game experience.</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .featured-season {
          padding: 4rem 0;
          background-color: var(--bg-darker);
        }
        
        .about {
          padding: 4rem 0;
          background-color: var(--bg-dark);
        }
        
        .about-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        
        .loading {
          text-align: center;
          padding: 2rem;
          color: var(--accent-orange);
          font-style: italic;
        }
        
        .error {
          text-align: center;
          padding: 2rem;
          color: #ff6b6b;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}