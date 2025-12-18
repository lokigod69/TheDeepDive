'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoSectionProps {
  videoId: string;
  title: string;
}

export default function VideoSection({ videoId, title }: VideoSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // YouTube thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div>
      {/* Section header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 group"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span
          style={{
            fontSize: 'var(--type-small)',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          Watch Video
        </span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      {/* Video container */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              <div
                className="relative rounded-lg overflow-hidden"
                style={{
                  background: 'var(--bg-elevated)',
                  aspectRatio: '16 / 9',
                }}
              >
                {!isLoaded ? (
                  // Thumbnail facade
                  <button
                    onClick={() => setIsLoaded(true)}
                    className="absolute inset-0 flex items-center justify-center group"
                    style={{
                      backgroundImage: `url(${thumbnailUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Overlay */}
                    <div
                      className="absolute inset-0 transition-opacity group-hover:opacity-70"
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                      }}
                    />
                    {/* Play button */}
                    <motion.div
                      className="relative z-10 flex items-center justify-center rounded-full"
                      style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--accent-primary)',
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5L19 12L8 19V5Z" fill="var(--bg-deep)" />
                      </svg>
                    </motion.div>
                  </button>
                ) : (
                  // YouTube iframe
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
