// pages/index.tsx
"use client";
import Head from 'next/head';
import Carousel from '../components/Carousel';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Futuristic Carousel</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&family=Orbitron:wght@400;700&display=swap" />
      </Head>
      <main>
        <Carousel />
      </main>
    </>
  );
}