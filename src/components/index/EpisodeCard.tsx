'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Episode } from '@/types';
import { formatEpisodeNumber } from '@/lib/data';

interface EpisodeCardProps {
  episode: Episode;
  isInFocus?: boolean;
  isNeighborLeft?: boolean;  // Is this card above the hovered card (vertical layout)
  isNeighborRight?: boolean; // Is this card below the hovered card (vertical layout)
  onHover?: (id: string | null) => void;
}

export default function EpisodeCard({
  episode,
  isInFocus = false,
  isNeighborLeft = false,
  isNeighborRight = false,
  onHover,
}: EpisodeCardProps) {
  // Calculate recession offset based on neighbor position (vertical)
  const getRecessionY = () => {
    if (isNeighborLeft) return -8;   // Recede upward
    if (isNeighborRight) return 8;   // Recede downward
    return 0;
  };

  const isReceding = isNeighborLeft || isNeighborRight;

  return (
    <motion.div
      className="episode-card w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isReceding ? 0.6 : isInFocus ? 1 : 0.8,
        y: getRecessionY(),
        scale: isReceding ? 0.98 : isInFocus ? 1 : 0.99,
      }}
      transition={{
        duration: 0.4,
        ease: [0.34, 1.2, 0.64, 1], // ease-part - for parting effect
      }}
      whileHover={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      onHoverStart={() => onHover?.(episode.id)}
      onHoverEnd={() => onHover?.(null)}
    >
      <Link href={`/episode/${episode.id}`} className="block">
        <article
          className="card h-full flex flex-col"
          style={{
            padding: 'var(--space-4)',
            minHeight: '200px',
          }}
        >
          {/* Header: Episode number + Duration */}
          <div className="flex justify-between items-start mb-4">
            <span
              className="mono text-lg"
              style={{
                color: 'var(--accent-primary)',
                fontWeight: 500,
              }}
            >
              {formatEpisodeNumber(episode.episodeNumber)}
            </span>
            <span className="mono">
              {episode.duration}
            </span>
          </div>

          {/* Title */}
          <h3
            className="mb-3"
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'var(--type-h2)',
              color: 'var(--text-primary)',
              lineHeight: 1.3,
            }}
          >
            {episode.title}
          </h3>

          {/* Description */}
          <p
            className="flex-grow"
            style={{
              fontSize: 'var(--type-small)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            {episode.description}
          </p>

          {/* Footer: Date */}
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <span className="mono" style={{ fontSize: 'var(--type-mono)' }}>
              {episode.date}
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
