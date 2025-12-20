'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Quotes with mobile flag - focused on shadow work, depth psychology, self-discovery
const shadowQuotes = [
  // Carl Jung - Shadow & Depth
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
    text: "Everything that irritates us about others can lead us to an understanding of ourselves.",
    author: "Carl Jung",
    showOnMobile: true
  },
  // Sigmund Freud - The Unconscious
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
    text: "The mind is like an iceberg, it floats with one-seventh of its bulk above water.",
    author: "Sigmund Freud",
    showOnMobile: true
  },
  {
    text: "Where does a thought go when it's forgotten?",
    author: "Sigmund Freud",
    showOnMobile: false
  },
  // Modern Depth Psychologists
  {
    text: "The curious paradox is that when I accept myself just as I am, then I can change.",
    author: "Carl Rogers",
    showOnMobile: true
  },
  {
    text: "Man's main task in life is to give birth to himself.",
    author: "Erich Fromm",
    showOnMobile: true
  },
  {
    text: "The only journey is the one within.",
    author: "Rainer Maria Rilke",
    showOnMobile: true
  },
  {
    text: "Perhaps everything terrible is in its deepest being something helpless that wants help from us.",
    author: "Rainer Maria Rilke",
    showOnMobile: false
  },
  // Shadow Work & Integration
  {
    text: "The cave you fear to enter holds the treasure you seek.",
    author: "Joseph Campbell",
    showOnMobile: true
  },
  {
    text: "No tree can grow to heaven unless its roots reach down to hell.",
    author: "Carl Jung",
    showOnMobile: false
  },
  {
    text: "Knowing your own darkness is the best method for dealing with the darknesses of other people.",
    author: "Carl Jung",
    showOnMobile: false
  },
  {
    text: "The wound is the place where the Light enters you.",
    author: "Rumi",
    showOnMobile: true
  },
];

export default function QuotesSection() {
  const quotesContainerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      // Check for touch capability as well as screen size
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(window.innerWidth < 768 || isTouchDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle touch with proper coordinates
  const handleTouch = useCallback((clientX: number, clientY: number) => {
    const container = quotesContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // Account for scroll position
    const x = clientX - rect.left;
    const y = clientY - rect.top + container.scrollTop;

    setMousePos({ x, y });
    setIsHovering(true);
    setTouchActive(true);

    // Clear any existing timeout
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }

    // Keep spotlight visible for 2.5 seconds after last touch
    touchTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
      setTouchActive(false);
      setMousePos({ x: -1000, y: -1000 });
    }, 2500);
  }, []);

  useEffect(() => {
    const container = quotesContainerRef.current;
    if (!container) return;

    // Mouse events for desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return; // Skip mouse events on mobile
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => {
      if (!isMobile) setIsHovering(true);
    };
    const handleMouseLeave = () => {
      if (!isMobile) {
        setIsHovering(false);
        setMousePos({ x: -1000, y: -1000 });
      }
    };

    // Touch events for mobile - tap to illuminate
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleTouch(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleTouch(touch.clientX, touch.clientY);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, [isMobile, handleTouch]);

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
          {isMobile ? 'Tap anywhere to illuminate hidden wisdom' : 'Move your cursor to illuminate hidden wisdom'}
        </p>

        {/* Mobile tap indicator - pulsing circle */}
        {isMobile && !touchActive && (
          <div
            className="mx-auto mt-6"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '2px solid rgba(139, 157, 195, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'rgba(139, 157, 195, 0.6)',
              }}
            />
          </div>
        )}
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
          {/* Scattered quotes - spread across full width, alternating left/right */}
          {displayQuotes.map((quote, index) => {
            // Desktop positions - evenly distributed left and right
            const desktopPositions = [
              // Row 1
              { top: '2%', left: '3%' },       // LEFT
              { top: '4%', left: '60%' },      // RIGHT
              // Row 2
              { top: '14%', left: '55%' },     // RIGHT
              { top: '16%', left: '5%' },      // LEFT
              // Row 3
              { top: '26%', left: '2%' },      // LEFT
              { top: '28%', left: '58%' },     // RIGHT
              // Row 4
              { top: '38%', left: '62%' },     // RIGHT
              { top: '40%', left: '4%' },      // LEFT
              // Row 5
              { top: '50%', left: '3%' },      // LEFT
              { top: '52%', left: '60%' },     // RIGHT
              // Row 6
              { top: '64%', left: '58%' },     // RIGHT
              { top: '66%', left: '5%' },      // LEFT
              // Row 7
              { top: '76%', left: '2%' },      // LEFT
              { top: '78%', left: '62%' },     // RIGHT
              // Row 8
              { top: '88%', left: '60%' },     // RIGHT
              { top: '90%', left: '4%' },      // LEFT
            ];

            // Mobile positions - vertical stacking
            const mobilePositions = [
              { top: '2%', left: '5%' },
              { top: '12%', left: '5%' },
              { top: '22%', left: '5%' },
              { top: '32%', left: '5%' },
              { top: '42%', left: '5%' },
              { top: '52%', left: '5%' },
              { top: '62%', left: '5%' },
              { top: '72%', left: '5%' },
              { top: '82%', left: '5%' },
              { top: '92%', left: '5%' },
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
