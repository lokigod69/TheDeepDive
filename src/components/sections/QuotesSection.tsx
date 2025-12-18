'use client';

import { useEffect, useRef, useState } from 'react';

// Quotes with mobile flag - some are excluded on mobile
const shadowQuotes = [
  // Carl Jung
  {
    text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
    author: "Carl Jung",
    showOnMobile: true
  },
  {
    text: "One does not become enlightened by imagining figures of light, but by making the darkness conscious.",
    author: "Carl Jung",
    showOnMobile: true
  },
  {
    text: "The privilege of a lifetime is to become who you truly are.",
    author: "Carl Jung",
    showOnMobile: true
  },
  {
    text: "We cannot change anything until we accept it.",
    author: "Carl Jung",
    showOnMobile: false // shorter, less impactful
  },
  // Sigmund Freud
  {
    text: "Out of your vulnerabilities will come your strength.",
    author: "Sigmund Freud",
    showOnMobile: true
  },
  {
    text: "Unexpressed emotions will never die. They are buried alive and will come forth later in uglier ways.",
    author: "Sigmund Freud",
    showOnMobile: true
  },
  {
    text: "Being entirely honest with oneself is a good exercise.",
    author: "Sigmund Freud",
    showOnMobile: false // shorter
  },
  {
    text: "The mind is like an iceberg, it floats with one-seventh of its bulk above water.",
    author: "Sigmund Freud",
    showOnMobile: true
  },
  // Other psychoanalysts & thinkers
  {
    text: "The curious paradox is that when I accept myself just as I am, then I can change.",
    author: "Carl Rogers",
    showOnMobile: true
  },
  {
    text: "What is not brought to consciousness, comes to us as fate.",
    author: "Carl Jung",
    showOnMobile: false // similar to first quote
  },
  {
    text: "The only person with whom you have to compare yourself is you in the past.",
    author: "Sigmund Freud",
    showOnMobile: true
  },
  {
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson",
    showOnMobile: false // not psychoanalysis
  },
  {
    text: "Man's main task in life is to give birth to himself.",
    author: "Erich Fromm",
    showOnMobile: true
  },
  {
    text: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.",
    author: "Carl Jung",
    showOnMobile: false // too long for mobile
  },
  {
    text: "Freedom is what we do with what is done to us.",
    author: "Jean-Paul Sartre",
    showOnMobile: false // not psychoanalysis
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    showOnMobile: false // too generic, not psychoanalysis
  },
];

export default function QuotesSection() {
  const quotesContainerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = quotesContainerRef.current;
    if (!container) return;

    // Mouse events for desktop
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePos({ x: -1000, y: -1000 });
    };

    // Touch events for mobile - tap to illuminate
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
      setIsHovering(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    };

    const handleTouchEnd = () => {
      // Keep the light on for a moment after touch ends
      setTimeout(() => {
        setIsHovering(false);
        setMousePos({ x: -1000, y: -1000 });
      }, 1500);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Filter quotes for mobile
  const displayQuotes = isMobile
    ? shadowQuotes.filter(q => q.showOnMobile)
    : shadowQuotes;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: '#030303',
        minHeight: '100vh',
      }}
    >
      {/* Section header */}
      <div className="text-center pt-24 pb-8 relative z-10">
        <span
          className="mono"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.2em', fontSize: '0.75rem' }}
        >
          THE SHADOW
        </span>
        <p
          className="mt-4 max-w-md mx-auto px-6"
          style={{
            fontSize: 'var(--type-small)',
            color: 'var(--text-muted)',
            opacity: 0.5,
          }}
        >
          {isMobile ? 'Tap to illuminate hidden wisdom' : 'Move your cursor to illuminate hidden wisdom'}
        </p>
      </div>

      {/* Quotes container - this is where mouse tracking happens */}
      <div
        ref={quotesContainerRef}
        className={`relative w-full ${isMobile ? '' : 'cursor-none'}`}
        style={{
          height: isMobile ? '2000px' : '1000px',
          padding: isMobile ? '0 1.5rem' : '0 3rem',
        }}
      >
        {/* The actual quotes - always rendered but masked */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: `radial-gradient(circle ${isMobile ? '200px' : '280px'} at ${mousePos.x}px ${mousePos.y}px, black 0%, black 60%, rgba(0,0,0,0.5) 80%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle ${isMobile ? '200px' : '280px'} at ${mousePos.x}px ${mousePos.y}px, black 0%, black 60%, rgba(0,0,0,0.5) 80%, transparent 100%)`,
          }}
        >
          {/* Scattered quotes - spread across full width */}
          {displayQuotes.map((quote, index) => {
            // Desktop positions - scattered layout
            const desktopPositions = [
              // Row 1 - spread wide
              { top: '2%', left: '2%' },
              { top: '3%', left: '38%' },
              { top: '1%', left: '72%' },
              // Row 2
              { top: '16%', left: '18%' },
              { top: '14%', left: '55%' },
              // Row 3
              { top: '28%', left: '1%' },
              { top: '30%', left: '35%' },
              { top: '26%', left: '70%' },
              // Row 4
              { top: '42%', left: '15%' },
              { top: '44%', left: '52%' },
              // Row 5
              { top: '56%', left: '2%' },
              { top: '58%', left: '38%' },
              { top: '54%', left: '72%' },
              // Row 6
              { top: '72%', left: '18%' },
              { top: '70%', left: '55%' },
              // Row 7
              { top: '86%', left: '5%' },
            ];

            // Mobile positions - vertical stacking, alternating left/right
            const mobilePositions = [
              { top: '2%', left: '5%' },
              { top: '12%', left: '10%' },
              { top: '22%', left: '3%' },
              { top: '32%', left: '8%' },
              { top: '42%', left: '5%' },
              { top: '52%', left: '10%' },
              { top: '62%', left: '3%' },
              { top: '72%', left: '8%' },
              { top: '82%', left: '5%' },
              { top: '92%', left: '10%' },
            ];

            const positions = isMobile ? mobilePositions : desktopPositions;
            const pos = positions[index % positions.length];

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  top: pos.top,
                  left: pos.left,
                  maxWidth: isMobile ? '85%' : '300px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: isMobile ? '1rem' : '1.15rem',
                    fontStyle: 'italic',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.75,
                  }}
                >
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p
                  className="mt-3"
                  style={{
                    fontSize: isMobile ? '0.85rem' : 'var(--type-body)',
                    color: 'var(--text-muted)',
                  }}
                >
                  — {quote.author}
                </p>
              </div>
            );
          })}
        </div>

        {/* Spotlight glow effect following cursor/touch - brighter and more even */}
        {isHovering && (
          <div
            className="absolute pointer-events-none"
            style={{
              width: isMobile ? '400px' : '600px',
              height: isMobile ? '400px' : '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 157, 195, 0.22) 0%, rgba(139, 157, 195, 0.15) 30%, rgba(139, 157, 195, 0.08) 60%, transparent 85%)',
              transform: `translate(${mousePos.x - (isMobile ? 200 : 300)}px, ${mousePos.y - (isMobile ? 200 : 300)}px)`,
              transition: 'transform 0.05s ease-out',
            }}
          />
        )}
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #030303)',
        }}
      />
    </section>
  );
}
