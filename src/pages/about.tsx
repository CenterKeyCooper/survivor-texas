import Head from 'next/head';
import Notes from '@/components/common/Notes';

export default function ForumPage() {
  return (
    <>
      <Head>
        <title>Forum - Survivor Texas</title>
        <meta name="description" content="Survivor Texas Forum - Share your thoughts and notes" />
      </Head>

      <div className="page">
        <div className="section">
          <h1>Forum</h1>
          <p>Share your thoughts, memories, and notes about Survivor Texas!</p>
        </div>

        <Notes type="forum" />
      </div>
    </>
  );
}

