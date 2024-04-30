'use client';

import Head from 'next/head';
import styles from './styling/Home.module.css';
import LinkInput from './components/LinkInput';
import Image from 'next/image';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Youtube Transcript AI</title>
        <link rel="icon" href="../../public/yb.png" />
      </Head>

      <main>
        <Image src="/yb.png" height="100" width="200" alt="YouTube Logo" className={styles.youtubeLogo} />
        <h1 className={styles.title}>
          <a className='tracking-wider' href="https://github.com/technoabsurdist/transcript.ai" target='_blank'>YouTube Transcript</a>
        </h1>

        <p className={styles.description}>
          Create AI-generated summaries and full transcripts.
        </p>
        <LinkInput /> 
      </main>
        <footer style={{ fontFamily: 'Share Tech Mono', fontSize: '22px', color: "black" }}>
          Powered by
          <a href="https://www.sievedata.com/" target='_blank'>
            <Image className='ml-2' src="/sieve.png" height="25" width="25" alt="Sieve Logo" /> 
          </a>
          &nbsp;
          | 
          &nbsp;
          <a href="https://github.com/technoabsurdist/transcript.ai" target='_blank'>
          Contribute 
            <Image className='ml-2' src="/githublogo.png" height="25" width="25" alt="Sieve Logo" /> 
          </a>
        </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Share Tech Mono,
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
