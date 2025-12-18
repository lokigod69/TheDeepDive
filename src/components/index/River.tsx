'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Season } from '@/types';
import EpisodeCard from './EpisodeCard';

interface RiverProps {
  seasons: Season[];
}

export default function River({ seasons }: RiverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Calculate which card is in focus based on scroll position
  const handleScroll = useCallback(() => {
    const cards = document.querySelectorAll('[data-episode-card]');
    if (!cards.length) return;

    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setFocusedIndex(closestIndex);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Get all episodes across seasons
  const allEpisodes = seasons.flatMap(season => season.episodes);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Vertical spine */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--border-subtle) 10%, var(--border-subtle) 90%, transparent)',
        }}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-24">
        {seasons.map((season, seasonIndex) => (
          <div key={season.id} className="mb-16">
            {/* Season Header */}
            <motion.div
              className="relative mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * seasonIndex, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Season dot on spine */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full hidden md:block"
                style={{
                  background: 'var(--accent-primary)',
                  boxShadow: '0 0 12px var(--accent-glow)',
                }}
              />

              <div
                className="inline-block px-6 py-3 rounded-full"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
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
                  className="mx-3"
                  style={{ color: 'var(--border-subtle)' }}
                >
                  /
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: 'var(--type-mono)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {season.year}
                </span>
              </div>
            </motion.div>

            {/* Episodes */}
            <div className="space-y-8 md:space-y-12">
              {season.episodes.map((episode, episodeIndex) => {
                const globalIndex = seasons
                  .slice(0, seasonIndex)
                  .reduce((acc, s) => acc + s.episodes.length, 0) + episodeIndex;

                // Find the global index of the hovered episode
                const hoveredGlobalIndex = hoveredId
                  ? allEpisodes.findIndex(ep => ep.id === hoveredId)
                  : -1;

                const isInFocus = hoveredId
                  ? hoveredId === episode.id
                  : globalIndex === focusedIndex;

                // Neighbors for recession effect (now vertical)
                const isNeighborAbove = !!(hoveredId && hoveredGlobalIndex !== -1 && globalIndex === hoveredGlobalIndex - 1);
                const isNeighborBelow = !!(hoveredId && hoveredGlobalIndex !== -1 && globalIndex === hoveredGlobalIndex + 1);

                // Alternate sides on desktop
                const isEven = episodeIndex % 2 === 0;

                return (
                  <motion.div
                    key={episode.id}
                    data-episode-card
                    className={`relative ${isEven ? 'md:pr-[52%]' : 'md:pl-[52%]'}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + 0.08 * episodeIndex,
                      duration: 0.6,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  >
                    {/* Connector line to spine */}
                    <div
                      className={`absolute top-1/2 w-8 h-px hidden md:block ${
                        isEven ? 'right-[48%]' : 'left-[48%]'
                      }`}
                      style={{
                        background: 'var(--border-subtle)',
                        opacity: isInFocus ? 1 : 0.5,
                        transition: 'opacity 0.3s ease',
                      }}
                    />

                    {/* Episode number on spine */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isInFocus ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                        border: `1px solid ${isInFocus ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                        transition: 'all 0.3s ease',
                        zIndex: 10,
                      }}
                    >
                      <span
                        className="mono"
                        style={{
                          fontSize: '11px',
                          color: isInFocus ? 'var(--bg-deep)' : 'var(--text-muted)',
                          fontWeight: 500,
                        }}
                      >
                        {String(episode.episodeNumber).padStart(2, '0')}
                      </span>
                    </div>

                    <EpisodeCard
                      episode={episode}
                      isInFocus={isInFocus}
                      isNeighborLeft={isNeighborAbove}
                      isNeighborRight={isNeighborBelow}
                      onHover={setHoveredId}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* End marker */}
        <motion.div
          className="text-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: 'var(--border-subtle)' }}
          />
        </motion.div>
      </div>

      {/* Progress indicator */}
      <div
        className="fixed right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col gap-2"
      >
        {allEpisodes.map((episode, index) => (
          <button
            key={episode.id}
            onClick={() => {
              const card = document.querySelectorAll('[data-episode-card]')[index];
              card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="group relative"
          >
            <div
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: index === focusedIndex ? 'var(--accent-primary)' : 'var(--border-subtle)',
                transform: index === focusedIndex ? 'scale(1.5)' : 'scale(1)',
              }}
            />
            {/* Tooltip */}
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '4px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                className="mono"
                style={{ fontSize: '11px', color: 'var(--text-secondary)' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
