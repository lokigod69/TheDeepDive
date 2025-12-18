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
        className="relative w-full cursor-none"
        style={{
          height: '1000px',
          padding: '0 3rem',
        }}
      >
        {/* The actual quotes - always rendered but masked */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: `radial-gradient(circle 280px at ${mousePos.x}px ${mousePos.y}px, black 0%, black 60%, rgba(0,0,0,0.5) 80%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 280px at ${mousePos.x}px ${mousePos.y}px, black 0%, black 60%, rgba(0,0,0,0.5) 80%, transparent 100%)`,
          }}
        >
          {/* Scattered quotes - spread across full width */}
          {shadowQuotes.map((quote, index) => {
            const positions = [
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

            const pos = positions[index % positions.length];

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

        {/* Spotlight glow effect following cursor - brighter and more even */}
        {isHovering && (
          <div
            className="absolute pointer-events-none"
            style={{
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 157, 195, 0.22) 0%, rgba(139, 157, 195, 0.15) 30%, rgba(139, 157, 195, 0.08) 60%, transparent 85%)',
              transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
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
