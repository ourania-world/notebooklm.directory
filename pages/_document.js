import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="NotebookLM Directory - Discover, Build, Accelerate. The premier platform for NotebookLM projects." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="NotebookLM Directory" />
        <meta property="og:description" content="Discover innovative NotebookLM projects and share your own work with the community." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://notebooklm.directory" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}