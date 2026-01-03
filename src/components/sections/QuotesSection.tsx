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

// Threshold for distinguishing tap from scroll (in pixels)
const TAP_THRESHOLD = 20;
// Long press duration (in ms)
const LONG_PRESS_DURATION = 300;
// Scroll debounce time - ignore taps within this time after scrolling
const SCROLL_DEBOUNCE_MS = 200;

export default function QuotesSection() {
  const quotesContainerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Touch tracking refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll tracking refs for improved gesture distinction
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spotlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Activate spotlight at a position
  const activateSpotlight = useCallback((clientX: number, clientY: number) => {
    const container = quotesContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setMousePos({ x, y });
    setIsHovering(true);
    setTouchActive(true);

    // Clear any existing spotlight timeout
    if (spotlightTimeoutRef.current) {
      clearTimeout(spotlightTimeoutRef.current);
    }

    // Keep spotlight visible for 2.5 seconds
    spotlightTimeoutRef.current = setTimeout(() => {
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
      if (isMobile) return;
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

    // Mobile touch events - distinguish tap/long-press from scroll
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Start long-press timer
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }

      longPressTimeoutRef.current = setTimeout(() => {
        // Long press detected - activate spotlight (only if not scrolling)
        if (touchStartRef.current && !isScrollingRef.current) {
          activateSpotlight(touchStartRef.current.x, touchStartRef.current.y);
        }
      }, LONG_PRESS_DURATION);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      // If finger moved beyond threshold, it's a scroll - cancel long-press
      if (deltaX > TAP_THRESHOLD || deltaY > TAP_THRESHOLD) {
        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current);
          longPressTimeoutRef.current = null;
        }
        touchStartRef.current = null; // Mark as scroll, not tap
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Cancel long-press timer
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }

      // Check if this was a tap (not a scroll)
      if (touchStartRef.current) {
        const touch = e.changedTouches[0];
        const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
        const duration = Date.now() - touchStartRef.current.time;

        // Quick tap (less than 300ms and didn't move much, and not during/after scroll)
        if (deltaX < TAP_THRESHOLD && deltaY < TAP_THRESHOLD && duration < LONG_PRESS_DURATION && !isScrollingRef.current) {
          activateSpotlight(touch.clientX, touch.clientY);
        }
      }

      touchStartRef.current = null;
    };

    const handleTouchCancel = () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
      touchStartRef.current = null;
    };

    // Scroll event handler to track scrolling state
    const handleScroll = () => {
      isScrollingRef.current = true;

      // Track scroll offset for mobile mask positioning
      if (container) {
        setScrollOffset(container.scrollTop);
      }

      // Hide spotlight during scroll to avoid visual glitches
      if (isMobile) {
        setIsHovering(false);
        setTouchActive(false);
      }

      // Cancel any pending long-press during scroll
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }

      // Clear previous scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scrolling to false after debounce period
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, SCROLL_DEBOUNCE_MS);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchCancel, { passive: true });
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchCancel);
      container.removeEventListener('scroll', handleScroll);
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (spotlightTimeoutRef.current) {
        clearTimeout(spotlightTimeoutRef.current);
      }
    };
  }, [isMobile, activateSpotlight]);

  // Filter quotes for mobile
  const displayQuotes = isMobile
    ? shadowQuotes.filter(q => q.showOnMobile)
    : shadowQuotes;

  // Calculate the number of quotes and spacing for mobile
  const mobileQuoteCount = displayQuotes.length;

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
          {isMobile ? 'Tap or hold to illuminate hidden wisdom' : 'Move your cursor to illuminate hidden wisdom'}
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

      {/* Quotes container */}
      <div
        ref={quotesContainerRef}
        className={`relative w-full ${isMobile ? '' : 'cursor-none'}`}
        style={{
          // On mobile, use scrollable container with max-height
          height: isMobile ? 'auto' : '1000px',
          maxHeight: isMobile ? '70vh' : 'none',
          overflowY: isMobile ? 'auto' : 'visible',
          overflowX: 'hidden',
          padding: isMobile ? '0 1.5rem' : '0 3rem',
          // Hide scrollbar but keep functionality
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* The actual quotes - always rendered but masked */}
        <div
          className={isMobile ? 'relative' : 'absolute inset-0'}
          style={{
            // On mobile, adjust y position by scroll offset so mask follows touch point correctly
            maskImage: `radial-gradient(circle ${isMobile ? '200px' : '280px'} at ${mousePos.x}px ${mousePos.y + (isMobile ? scrollOffset : 0)}px, black 0%, black 60%, rgba(0,0,0,0.5) 80%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle ${isMobile ? '200px' : '280px'} at ${mousePos.x}px ${mousePos.y + (isMobile ? scrollOffset : 0)}px, black 0%, black 60%, rgba(0,0,0,0.5) 80%, transparent 100%)`,
            // Mobile: use flex column layout for vertical stacking
            ...(isMobile ? { display: 'flex', flexDirection: 'column' as const, gap: '2.5rem', paddingBottom: '4rem' } : {}),
          }}
        >
          {/* Quotes layout */}
          {displayQuotes.map((quote, index) => {
            // Desktop positions - evenly distributed left and right
            const desktopPositions = [
              { top: '2%', left: '3%' },
              { top: '4%', left: '60%' },
              { top: '14%', left: '55%' },
              { top: '16%', left: '5%' },
              { top: '26%', left: '2%' },
              { top: '28%', left: '58%' },
              { top: '38%', left: '62%' },
              { top: '40%', left: '4%' },
              { top: '50%', left: '3%' },
              { top: '52%', left: '60%' },
              { top: '64%', left: '58%' },
              { top: '66%', left: '5%' },
              { top: '76%', left: '2%' },
              { top: '78%', left: '62%' },
              { top: '88%', left: '60%' },
              { top: '90%', left: '4%' },
            ];

            if (isMobile) {
              // Mobile: use relative positioning within flex container for natural vertical flow
              return (
                <div
                  key={index}
                  className="relative"
                  style={{
                    width: '100%',
                    flexShrink: 0,
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif), Georgia, serif',
                      fontSize: '1rem',
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
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    — {quote.author}
                  </p>
                </div>
              );
            }

            // Desktop layout
            const pos = desktopPositions[index % desktopPositions.length];

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  top: pos.top,
                  left: pos.left,
                  maxWidth: '300px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: '1.15rem',
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
                    fontSize: 'var(--type-body)',
                    color: 'var(--text-muted)',
                  }}
                >
                  — {quote.author}
                </p>
              </div>
            );
          })}
        </div>

        {/* Spotlight glow effect following cursor/touch */}
        {isHovering && (
          <div
            className="absolute pointer-events-none"
            style={{
              width: isMobile ? '400px' : '600px',
              height: isMobile ? '400px' : '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 157, 195, 0.22) 0%, rgba(139, 157, 195, 0.15) 30%, rgba(139, 157, 195, 0.08) 60%, transparent 85%)',
              transform: `translate(${mousePos.x - (isMobile ? 200 : 300)}px, ${mousePos.y + (isMobile ? scrollOffset : 0) - (isMobile ? 200 : 300)}px)`,
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
