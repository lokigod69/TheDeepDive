'use client';

import { useEffect, useRef, useState } from 'react';

export default function SpotlightCursor() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main spotlight glow */}
      <div
        ref={spotlightRef}
        className="fixed pointer-events-none z-50 mix-blend-soft-light"
        style={{
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 157, 195, 0.15) 0%, transparent 70%)',
          transform: `translate(${position.x - 200}px, ${position.y - 200}px)`,
          opacity: isActive ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Subtle warm accent */}
      <div
        className="fixed pointer-events-none z-50 mix-blend-soft-light"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 166, 107, 0.08) 0%, transparent 70%)',
          transform: `translate(${position.x - 100}px, ${position.y - 100}px)`,
          opacity: isActive ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Very subtle outer ring */}
      <div
        className="fixed pointer-events-none z-40"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          border: '1px solid rgba(139, 157, 195, 0.05)',
          transform: `translate(${position.x - 300}px, ${position.y - 300}px)`,
          opacity: isActive ? 0.5 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />
    </>
  );
}
