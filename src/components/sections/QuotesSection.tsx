'use client';

import { useEffect, useRef, useState } from 'react';

const shadowQuotes = [
  // Carl Jung
  {
    text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
    author: "Carl Jung"
  },
  {
    text: "One does not become enlightened by imagining figures of light, but by making the darkness conscious.",
    author: "Carl Jung"
  },
  {
    text: "The privilege of a lifetime is to become who you truly are.",
    author: "Carl Jung"
  },
  {
    text: "We cannot change anything until we accept it.",
    author: "Carl Jung"
  },
  // Sigmund Freud
  {
    text: "Out of your vulnerabilities will come your strength.",
    author: "Sigmund Freud"
  },
  {
    text: "Unexpressed emotions will never die. They are buried alive and will come forth later in uglier ways.",
    author: "Sigmund Freud"
  },
  {
    text: "Being entirely honest with oneself is a good exercise.",
    author: "Sigmund Freud"
  },
  {
    text: "The mind is like an iceberg, it floats with one-seventh of its bulk above water.",
    author: "Sigmund Freud"
  },
  // Other psychoanalysts & thinkers
  {
    text: "The curious paradox is that when I accept myself just as I am, then I can change.",
    author: "Carl Rogers"
  },
  {
    text: "What is not brought to consciousness, comes to us as fate.",
    author: "Carl Jung"
  },
  {
    text: "The only person with whom you have to compare yourself is you in the past.",
    author: "Sigmund Freud"
  },
  {
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "Man's main task in life is to give birth to himself.",
    author: "Erich Fromm"
  },
  {
    text: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.",
    author: "Carl Jung"
  },
  {
    text: "Freedom is what we do with what is done to us.",
    author: "Jean-Paul Sartre"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
];

export default function QuotesSection() {
  const quotesContainerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = quotesContainerRef.current;
    if (!container) return;

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

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

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
          Move your cursor to illuminate hidden wisdom
        </p>
      </div>

      {/* Quotes container - this is where mouse tracking happens */}
      <div
        ref={quotesContainerRef}
        className="relative mx-auto cursor-none"
        style={{
          height: '1100px',
          maxWidth: '1400px',
          padding: '0 2rem',
        }}
      >
        {/* The actual quotes - always rendered but masked */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black 0%, black 50%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black 0%, black 50%, transparent 100%)`,
          }}
        >
          {/* Scattered quotes */}
          {shadowQuotes.map((quote, index) => {
            const positions = [
              // Row 1
              { top: '3%', left: '5%' },
              { top: '2%', left: '52%' },
              // Row 2
              { top: '15%', left: '25%' },
              { top: '14%', left: '68%' },
              // Row 3
              { top: '28%', left: '3%' },
              { top: '26%', left: '48%' },
              // Row 4
              { top: '40%', left: '20%' },
              { top: '38%', left: '65%' },
              // Row 5
              { top: '52%', left: '5%' },
              { top: '50%', left: '50%' },
              // Row 6
              { top: '64%', left: '22%' },
              { top: '62%', left: '62%' },
              // Row 7
              { top: '76%', left: '8%' },
              { top: '74%', left: '52%' },
              // Row 8
              { top: '86%', left: '28%' },
              { top: '85%', left: '68%' },
            ];

            const pos = positions[index % positions.length];

            return (
              <div
                key={index}
                className="absolute max-w-[320px]"
                style={{
                  top: pos.top,
                  left: pos.left,
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
                  "{quote.text}"
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

        {/* Spotlight glow effect following cursor */}
        {isHovering && (
          <div
            className="absolute pointer-events-none"
            style={{
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 157, 195, 0.15) 0%, rgba(139, 157, 195, 0.06) 40%, transparent 70%)',
              transform: `translate(${mousePos.x - 250}px, ${mousePos.y - 250}px)`,
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
