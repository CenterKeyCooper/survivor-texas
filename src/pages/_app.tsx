import type { AppProps } from 'next/app';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SpoilerProvider } from '@/lib/SpoilerContext';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SpoilerProvider>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
    </SpoilerProvider>
  );
}

export default MyApp;