export default function Hero() {
    return (
      <header className="hero">
        <div className="hero-content">
          <h1>Outwit. Outplay. Outlast.</h1>
          <p>The ultimate college Survivor experience</p>
          <a href="#featured-season" className="btn">Explore Seasons</a>
        </div>
  
        <style jsx>{`
          .hero {
            height: 80vh;
            min-height: 500px;
            background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                        url('/images/blurred_campus.png') center/cover no-repeat;
            display: flex;
            align-items: center;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, transparent 0%, var(--bg-dark) 150%);
            z-index: 1;
          }
          
          .hero-content {
            position: relative;
            z-index: 2;
            width: 100%;
            animation: fadeInUp 1s ease-out;
          }
          
          .hero h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          }
          
          .hero p {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }
          
          @media (max-width: 768px) {
            .hero h1 {
              font-size: 2.5rem;
            }
            
            .hero p {
              font-size: 1.2rem;
            }
          }
        `}</style>
      </header>
    );
  }