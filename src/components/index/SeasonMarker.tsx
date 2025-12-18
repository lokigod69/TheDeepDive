'use client';

import { motion } from 'framer-motion';
import type { Season } from '@/types';

interface SeasonMarkerProps {
  season: Season;
  isFirst?: boolean;
}

export default function SeasonMarker({ season, isFirst = false }: SeasonMarkerProps) {
  return (
    <motion.div
      className="season-marker flex flex-col items-center justify-center h-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
        delay: isFirst ? 0.3 : 0,
      }}
      style={{
        minWidth: '120px',
        padding: 'var(--space-4)',
      }}
    >
      {/* Vertical text */}
      <div
        className="flex flex-col items-center gap-2"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
        }}
      >
        <span
          className="mono uppercase tracking-widest"
          style={{
            fontSize: 'var(--type-small)',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
          }}
        >
          Season {season.number}
        </span>
        <span
          className="mono"
          style={{
            fontSize: 'var(--type-mono)',
            color: 'var(--text-muted)',
            opacity: 0.6,
          }}
        >
          {season.year}
        </span>
      </div>

      {/* Horizontal line extending right */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2"
        style={{
          width: '40px',
          height: '1px',
          background: 'var(--border-subtle)',
        }}
      />
    </motion.div>
  );
}
