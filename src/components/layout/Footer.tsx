import { useEffect, useState } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} Survivor Texas. All rights reserved.</p>
        <div className="social-links">
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Facebook">Facebook</a>
          <a href="#" aria-label="Twitter">Twitter</a>
        </div>
      </div>

      <style jsx>{`
        .footer {
          padding: 2rem 0;
          background-color: var(--bg-darker);
          text-align: center;
          border-top: 1px solid rgba(255, 123, 37, 0.2);
        }
        
        .social-links {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }
        
        .social-links a {
          color: var(--text-light);
          transition: color 0.3s ease;
        }
        
        .social-links a:hover {
          color: var(--accent-orange);
        }
      `}</style>
    </footer>
  );
}