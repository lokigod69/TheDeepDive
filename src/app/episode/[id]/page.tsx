'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getEpisodeById, getAllSeasons, formatEpisodeNumber, getSlidesByEpisodeId } from '@/lib/data';
import CirclePlayer from '@/components/episode/CirclePlayer';
import VideoSection from '@/components/episode/VideoSection';
import SlidesCarousel from '@/components/episode/SlidesCarousel';

export default function EpisodePage() {
  const params = useParams();
  const episodeId = params.id as string;
  const episode = getEpisodeById(episodeId);
  const seasons = getAllSeasons();
  const slides = getSlidesByEpisodeId(episodeId);

  if (!episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>Episode not found</p>
      </div>
    );
  }

  // Find season info
  const season = seasons.find(s => s.id === episode.seasonId);

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--bg-deep)' }}>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-20 px-6 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          background: 'linear-gradient(to bottom, var(--bg-deep) 80%, transparent)',
        }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 group"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="text-sm transition-colors group-hover:text-[var(--text-primary)]"
          >
            Return
          </span>
        </Link>
      </motion.nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Meta line */}
          <p
            className="mono uppercase tracking-widest mb-4"
            style={{
              fontSize: 'var(--type-mono)',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
            }}
          >
            Season {season?.number || 1} · Session {formatEpisodeNumber(episode.episodeNumber)}
          </p>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, var(--type-display))',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            {episode.title}
          </h1>

          {/* Date */}
          <p
            className="mono mt-4"
            style={{
              fontSize: 'var(--type-mono)',
              color: 'var(--text-muted)',
            }}
          >
            {episode.date}
          </p>
        </motion.header>

        {/* Audio Player - The Heart */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <CirclePlayer
            audioUrl={episode.audioUrl}
            duration={episode.durationSeconds}
            durationFormatted={episode.duration}
          />
        </motion.section>

        {/* Video Section */}
        {episode.videoUrl && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <VideoSection videoId={episode.videoUrl} title={episode.title} />
          </motion.section>
        )}

        {/* Slides Carousel */}
        {slides.length > 0 && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <SlidesCarousel slides={slides} episodeTitle={episode.title} />
          </motion.section>
        )}

        {/* Description */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <p
            className="text-center max-w-xl mx-auto"
            style={{
              fontSize: 'var(--type-body)',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
            }}
          >
            {episode.description}
          </p>
        </motion.section>

        {/* Bottom navigation */}
        <motion.div
          className="pt-8 border-t text-center"
          style={{ borderColor: 'var(--border-subtle)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="text-sm hover:text-[var(--text-primary)]">
              Back to all sessions
            </span>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
