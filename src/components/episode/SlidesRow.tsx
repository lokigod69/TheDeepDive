'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide } from '@/types';

interface SlidesRowProps {
  slides: Slide[];
}

export default function SlidesRow({ slides }: SlidesRowProps) {
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  return (
    <div>
      {/* Section header */}
      <div
        className="py-3 mb-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span
          style={{
            fontSize: 'var(--type-small)',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          Session Materials
        </span>
      </div>

      {/* Horizontal scroll container */}
      <div
        className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {slides.map((slide, index) => (
          <motion.button
            key={slide.id}
            onClick={() => setSelectedSlide(slide)}
            className="flex-shrink-0 relative rounded-lg overflow-hidden group"
            style={{
              width: '160px',
              height: '120px',
              background: 'var(--bg-elevated)',
              scrollSnapAlign: 'start',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            {/* Placeholder for actual images */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, var(--bg-subtle) 0%, var(--bg-elevated) 100%)`,
              }}
            >
              <span
                className="mono"
                style={{ color: 'var(--text-muted)', fontSize: '12px' }}
              >
                {index + 1}
              </span>
            </div>

            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 3H21V9M21 3L13 11M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14"
                  stroke="var(--text-primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Caption */}
            {slide.caption && (
              <div
                className="absolute bottom-0 left-0 right-0 p-2"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                }}
              >
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {slide.caption}
                </span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedSlide && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedSlide(null)}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0, 0, 0, 0.9)' }}
            />

            {/* Close button */}
            <button
              className="absolute top-6 right-6 z-10 p-2 rounded-full transition-colors"
              style={{ background: 'var(--bg-elevated)' }}
              onClick={() => setSelectedSlide(null)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="var(--text-primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Image container */}
            <motion.div
              className="relative z-10 max-w-4xl max-h-[80vh] rounded-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Placeholder - replace with actual image */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: '600px',
                  height: '400px',
                  background: 'var(--bg-elevated)',
                }}
              >
                <div className="text-center">
                  <span
                    className="block mb-2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Slide Preview
                  </span>
                  {selectedSlide.caption && (
                    <span
                      className="block"
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--type-small)',
                      }}
                    >
                      {selectedSlide.caption}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
