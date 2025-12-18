'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import type { Slide } from '@/types';

interface SlidesCarouselProps {
  slides: Slide[];
  episodeTitle?: string;
}

export default function SlidesCarousel({ slides, episodeTitle }: SlidesCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse tracking for subtle parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Check scroll boundaries
  const checkScrollBounds = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollBounds);
    checkScrollBounds();

    return () => container.removeEventListener('scroll', checkScrollBounds);
  }, [checkScrollBounds]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 320; // Slightly larger than slide width
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedIndex === null) return;

    if (e.key === 'Escape') {
      setSelectedIndex(null);
    } else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (e.key === 'ArrowRight' && selectedIndex < slides.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, slides.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedIndex]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative">
      {/* Section header */}
      <div
        className="flex items-center justify-between py-4 mb-6"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: 0.5 }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--text-muted)" strokeWidth="1.5"/>
            <path d="M3 9H21" stroke="var(--text-muted)" strokeWidth="1.5"/>
            <path d="M9 21V9" stroke="var(--text-muted)" strokeWidth="1.5"/>
          </svg>
          <span
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'var(--type-body)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            Session Materials
          </span>
        </div>
        <span
          className="mono"
          style={{
            fontSize: 'var(--type-caption)',
            color: 'var(--text-muted)',
          }}
        >
          {slides.length} slides
        </span>
      </div>

      {/* Carousel container */}
      <div className="relative group">
        {/* Left scroll fade + button */}
        <div
          className="absolute left-0 top-0 bottom-4 w-16 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to right, var(--bg-deep) 0%, transparent 100%)',
            opacity: canScrollLeft ? 1 : 0,
          }}
        />
        {canScrollLeft && (
          <motion.button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            whileHover={{ scale: 1.1, background: 'var(--bg-subtle)' }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.button>
        )}

        {/* Right scroll fade + button */}
        <div
          className="absolute right-0 top-0 bottom-4 w-16 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to left, var(--bg-deep) 0%, transparent 100%)',
            opacity: canScrollRight ? 1 : 0,
          }}
        />
        {canScrollRight && (
          <motion.button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            whileHover={{ scale: 1.1, background: 'var(--bg-subtle)' }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.button>
        )}

        {/* Slides row */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            scrollPaddingLeft: '8px',
          }}
        >
          {slides.map((slide, index) => (
            <motion.button
              key={slide.id}
              onClick={() => setSelectedIndex(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex-shrink-0 relative rounded-lg overflow-hidden group/slide focus:outline-none"
              style={{
                width: '280px',
                aspectRatio: '16/9',
                scrollSnapAlign: 'start',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
              }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Image */}
              <div className="absolute inset-0 bg-[var(--bg-elevated)]">
                <Image
                  src={slide.imageUrl}
                  alt={slide.caption || `Slide ${slide.slideNumber}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/slide:scale-105"
                  sizes="280px"
                  loading="lazy"
                />
              </div>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 40%, transparent 100%)',
                  opacity: hoveredIndex === index ? 1 : 0.7,
                }}
              />

              {/* Subtle border */}
              <div
                className="absolute inset-0 rounded-lg transition-all duration-300"
                style={{
                  border: hoveredIndex === index
                    ? '1px solid var(--accent-primary)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: hoveredIndex === index
                    ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(139, 157, 195, 0.1)'
                    : '0 4px 16px rgba(0,0,0,0.3)',
                }}
              />

              {/* Slide number badge */}
              <div
                className="absolute top-3 left-3 px-2 py-1 rounded"
                style={{
                  background: 'rgba(10,10,10,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {String(slide.slideNumber).padStart(2, '0')}
                </span>
              </div>

              {/* Hover indicator */}
              <motion.div
                className="absolute bottom-3 right-3 p-2 rounded-full"
                style={{
                  background: 'rgba(139, 157, 195, 0.2)',
                  backdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 0.8,
                }}
                transition={{ duration: 0.2 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 3H21V9M21 3L13 11M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14"
                    stroke="var(--text-primary)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 cursor-pointer"
              style={{ background: 'rgba(5, 5, 5, 0.95)' }}
              onClick={() => setSelectedIndex(null)}
              initial={{ backdropFilter: 'blur(0px)' }}
              animate={{ backdropFilter: 'blur(20px)' }}
              exit={{ backdropFilter: 'blur(0px)' }}
            />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
              <div>
                <span
                  className="mono"
                  style={{ fontSize: 'var(--type-caption)', color: 'var(--text-muted)' }}
                >
                  {episodeTitle || 'Session Materials'}
                </span>
                <span
                  className="mx-2"
                  style={{ color: 'var(--border-subtle)' }}
                >
                  /
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 'var(--type-caption)', color: 'var(--text-secondary)' }}
                >
                  Slide {selectedIndex + 1} of {slides.length}
                </span>
              </div>

              <button
                onClick={() => setSelectedIndex(null)}
                className="p-2 rounded-full transition-colors"
                style={{ background: 'var(--bg-elevated)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="var(--text-primary)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation arrows */}
            {selectedIndex > 0 && (
              <motion.button
                className="absolute left-4 md:left-8 p-4 rounded-full z-10"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex - 1); }}
                whileHover={{ scale: 1.1, background: 'var(--bg-subtle)' }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.button>
            )}

            {selectedIndex < slides.length - 1 && (
              <motion.button
                className="absolute right-4 md:right-8 p-4 rounded-full z-10"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex + 1); }}
                whileHover={{ scale: 1.1, background: 'var(--bg-subtle)' }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.button>
            )}

            {/* Image container */}
            <motion.div
              className="relative z-10 w-full max-w-5xl mx-4 md:mx-16"
              style={{ maxHeight: 'calc(100vh - 160px)' }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative w-full rounded-lg overflow-hidden"
                style={{
                  aspectRatio: '16/9',
                  background: 'var(--bg-elevated)',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
                }}
              >
                <Image
                  src={slides[selectedIndex].imageUrl}
                  alt={slides[selectedIndex].caption || `Slide ${slides[selectedIndex].slideNumber}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
              </div>

              {/* Caption */}
              {slides[selectedIndex].caption && (
                <motion.p
                  className="text-center mt-4"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--type-small)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {slides[selectedIndex].caption}
                </motion.p>
              )}
            </motion.div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <div
                className="flex gap-2 justify-center overflow-x-auto hide-scrollbar py-2"
                style={{ maxWidth: '100%' }}
              >
                {slides.map((slide, index) => (
                  <motion.button
                    key={slide.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                    className="flex-shrink-0 rounded overflow-hidden transition-all"
                    style={{
                      width: '48px',
                      height: '27px',
                      opacity: selectedIndex === index ? 1 : 0.4,
                      border: selectedIndex === index
                        ? '2px solid var(--accent-primary)'
                        : '1px solid var(--border-subtle)',
                    }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={slide.imageUrl}
                      alt=""
                      width={48}
                      height={27}
                      className="object-cover w-full h-full"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Keyboard hint */}
            <div
              className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-4 mono"
              style={{ fontSize: '11px', color: 'var(--text-muted)' }}
            >
              <span>← → Navigate</span>
              <span>ESC Close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
