'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { getAllSeasons } from '@/lib/data';
import QuotesSection from '@/components/sections/QuotesSection';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const seasons = getAllSeasons();
  const allEpisodes = seasons.flatMap(s => s.episodes);

  const mainRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const sunGlareRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const introSectionRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const seasonHeaderRef = useRef<HTMLDivElement>(null);
  const episodesRef = useRef<HTMLDivElement>(null);
  const episodeCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const quotesSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Diving gradient effect - track scroll progress
      // Transition completes when THE SHADOW section is reached
      ScrollTrigger.create({
        trigger: mainRef.current,
        start: 'top top',
        endTrigger: quotesSectionRef.current,
        end: 'top center', // Gradient completes when quotes section reaches center
        scrub: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      // Hero title animation on load
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );

      gsap.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 }
      );

      gsap.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 1.2 }
      );

      // Scroll indicator pulse
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Hero fades and blurs out as you scroll (diving down)
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          opacity: 0,
          filter: 'blur(20px)',
          scale: 0.9,
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=600',
            scrub: true,
          },
        });
      }

      // Sun glare fades out more gradually
      if (sunGlareRef.current) {
        gsap.to(sunGlareRef.current, {
          opacity: 0,
          scrollTrigger: {
            trigger: mainRef.current,
            start: 'top top',
            end: '+=2500', // Fade over 2500px for subtler effect
            scrub: true,
          },
        });
      }

      // Intro text reveal on scroll
      if (introTextRef.current) {
        const introWords = introTextRef.current.querySelectorAll('.intro-word');
        gsap.fromTo(
          introWords,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: introSectionRef.current,
              start: 'top 60%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Intro text fades out
        gsap.to(introTextRef.current, {
          opacity: 0,
          y: -30,
          scrollTrigger: {
            trigger: introSectionRef.current,
            start: 'bottom 70%',
            end: 'bottom 30%',
            scrub: true,
          },
        });
      }

      // Season header animation
      if (seasonHeaderRef.current) {
        gsap.fromTo(
          seasonHeaderRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: seasonHeaderRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Episode cards - staggered reveal from alternating sides
      episodeCardsRef.current.forEach((card, i) => {
        if (!card) return;

        const isEven = i % 2 === 0;
        gsap.fromTo(
          card,
          {
            x: isEven ? -100 : 100,
            opacity: 0,
            scale: 0.95,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // Calculate gradient colors based on scroll progress
  // Following FreeDiving-A approach: keep hue in blue range, decrease lightness
  // Blue → deeper blue → very dark blue → black (no green/yellow transition)
  const getGradientStyle = () => {
    // Apply easing - stays blue longer, then accelerates darkening
    const easeInCubic = (t: number) => t * t * t;
    const p = easeInCubic(scrollProgress);

    // Hue stays in blue range (200-210), slight shift toward cyan as you descend
    // Like FreeDiving-A: hue = 200 - progress * 20 (stays ~180-200)
    const hue = 205 - p * 15; // 205 → 190 (stays in blue-cyan range)

    // Saturation: starts moderate, increases slightly mid-dive, then drops to 0
    // Creates that deep ocean color before going black
    const saturation = p < 0.7
      ? 40 + p * 30  // 40% → 61% (richer blue as you descend)
      : 70 - (p - 0.7) * 233; // 61% → 0% (desaturate to black at the end)

    // Lightness: the main driver of darkness
    // Surface is bright, deep is near-black
    const lightnessTop = 50 - p * 47;     // 50% → 3%
    const lightnessMid = 35 - p * 32;     // 35% → 3%
    const lightnessBot = 20 - p * 18;     // 20% → 2%

    // Clamp saturation to avoid negative
    const clampedSat = Math.max(0, saturation);

    return {
      background: `linear-gradient(180deg,
        hsl(${hue}, ${clampedSat}%, ${Math.max(2, lightnessTop)}%) 0%,
        hsl(${hue + 5}, ${clampedSat}%, ${Math.max(2, lightnessMid)}%) 50%,
        hsl(${hue + 10}, ${Math.max(0, clampedSat - 10)}%, ${Math.max(1, lightnessBot)}%) 100%
      )`,
    };
  };

  return (
    <main ref={mainRef} className="relative min-h-screen overflow-x-hidden">
      {/* Fixed gradient background - transitions from blue to dark as you scroll */}
      <div
        ref={gradientRef}
        className="fixed inset-0 pointer-events-none transition-all duration-100"
        style={getGradientStyle()}
      />

      {/* Sun glare effect - fades out as you dive */}
      <div
        ref={sunGlareRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% -20%, rgba(255, 255, 220, 0.25) 0%, rgba(255, 255, 200, 0.1) 30%, transparent 60%)',
        }}
      />

      {/* Ocean surface waves - looking up from below */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none overflow-hidden"
        style={{
          height: '320px',
          opacity: Math.max(0, 1 - scrollProgress * 2.5), // Fade out as you dive
        }}
      >
        {/* Wave layer 1 - lightest, closest to surface */}
        <svg
          className="absolute w-full"
          style={{
            top: '-30px',
            height: '160px',
            animation: 'wave1 8s ease-in-out infinite',
          }}
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C360,160 720,0 1080,80 C1260,120 1350,40 1440,80 L1440,0 L0,0 Z"
            fill="rgba(180, 210, 255, 0.2)"
          />
        </svg>

        {/* Wave layer 2 - middle */}
        <svg
          className="absolute w-full"
          style={{
            top: '0px',
            height: '130px',
            animation: 'wave2 10s ease-in-out infinite',
          }}
          viewBox="0 0 1440 130"
          preserveAspectRatio="none"
        >
          <path
            d="M0,65 C240,130 480,0 720,65 C960,130 1200,0 1440,65 L1440,0 L0,0 Z"
            fill="rgba(160, 195, 255, 0.15)"
          />
        </svg>

        {/* Wave layer 3 - deepest wave */}
        <svg
          className="absolute w-full"
          style={{
            top: '40px',
            height: '120px',
            animation: 'wave3 12s ease-in-out infinite',
          }}
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C180,120 360,0 540,60 C720,120 900,0 1080,60 C1260,120 1350,0 1440,60 L1440,0 L0,0 Z"
            fill="rgba(140, 180, 255, 0.1)"
          />
        </svg>

        {/* Shimmer line at very top - brighter */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)',
            animation: 'shimmer 4s ease-in-out infinite',
          }}
        />

        {/* Secondary shimmer for depth */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: '8px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 10%, rgba(200,220,255,0.3) 30%, rgba(200,220,255,0.5) 50%, rgba(200,220,255,0.3) 70%, transparent 90%)',
            animation: 'shimmer 6s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Vignette effect - intensifies as you dive (with easing) */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 ${150 + Math.pow(scrollProgress, 2) * 150}px rgba(0, 0, 0, ${0.2 + Math.pow(scrollProgress, 2) * 0.5})`,
        }}
      />

      {/* Hero Section - fixed position, fades/blurs out */}
      <section
        ref={heroRef}
        className="fixed inset-0 flex flex-col justify-center items-center z-10"
        style={{ minHeight: '100vh' }}
      >

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1
            ref={titleRef}
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>The</span>{' '}
            <span
              style={{
                fontStyle: 'italic',
                color: 'rgba(200, 225, 255, 0.95)', // Light ocean blue that matches the water
              }}
            >
              Deep Dive
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="mt-6"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(255, 255, 255, 0.55)', // Softer white, more readable than muted gray
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono), monospace',
            }}
          >
            Psychoanalysis Sessions
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
            SCROLL TO DIVE
          </p>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            style={{ opacity: 0.4 }}
          >
            <rect
              x="1"
              y="1"
              width="14"
              height="22"
              rx="7"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1"
            />
            <circle cx="8" cy="8" r="2" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>
      </section>

      {/* Spacer for hero - allows scrolling before content appears */}
      <div style={{ height: '100vh' }} />

      {/* Intro Text Section */}
      <section
        ref={introSectionRef}
        className="relative flex items-center justify-center z-20"
        style={{ minHeight: '80vh' }}
      >
        <div
          ref={introTextRef}
          className="max-w-2xl mx-auto px-6 text-center"
        >
          <p
            className="quote-text"
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              textAlign: 'center',
              lineHeight: 1.8,
            }}
          >
            <span className="intro-word inline-block">In these sessions,</span>{' '}
            <span className="intro-word inline-block">we examine</span>{' '}
            <span className="intro-word inline-block">the stories</span>{' '}
            <span className="intro-word inline-block">we tell ourselves—</span>{' '}
            <span className="intro-word inline-block">and the ones</span>{' '}
            <span className="intro-word inline-block">we</span>{' '}
            <span className="intro-word inline-block" style={{ color: 'var(--accent-primary)' }}>hide</span>{' '}
            <span className="intro-word inline-block">from.</span>
          </p>
        </div>
      </section>

      {/* Episodes Section */}
      <section ref={episodesRef} className="relative py-32 px-6 z-20">
        <div className="max-w-5xl mx-auto">
          {/* Season Header */}
          <div ref={seasonHeaderRef} className="text-center mb-40">
            <h2
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                color: 'var(--text-primary)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
            >
              Season One
            </h2>
            <p
              className="mt-4"
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              Foundations
            </p>
          </div>

          {/* Episode Cards - with much more spacing */}
          <div className="space-y-40 md:space-y-56">
            {allEpisodes.map((episode, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={episode.id}
                  ref={(el) => { episodeCardsRef.current[index] = el; }}
                  className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}
                >
                  <Link
                    href={`/episode/${episode.id}`}
                    className="block w-full max-w-2xl group"
                  >
                    <article
                      className="relative"
                      style={{
                        padding: 'var(--space-6)',
                        background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(26, 26, 26, 0.6) 100%)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        boxShadow: `
                          0 4px 24px rgba(0, 0, 0, 0.4),
                          0 1px 2px rgba(0, 0, 0, 0.2),
                          inset 0 1px 0 rgba(255, 255, 255, 0.02)
                        `,
                        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                    >
                      {/* Episode number badge */}
                      <div
                        className="absolute -top-3 -right-3 flex items-center justify-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--bg-deep)',
                          border: '1px solid var(--border-subtle)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono), monospace',
                            fontSize: '0.75rem',
                            color: 'var(--accent-primary)',
                            fontWeight: 500,
                            letterSpacing: '0.02em',
                          }}
                        >
                          E{index + 1}
                        </span>
                      </div>

                      {/* Left accent line */}
                      <div
                        className="absolute left-0 top-8 bottom-8 w-px"
                        style={{
                          background: 'linear-gradient(to bottom, transparent, var(--accent-primary), transparent)',
                          opacity: 0.5,
                        }}
                      />

                      {/* Content */}
                      <div className="relative z-10 pl-4">
                        <h3
                          style={{
                            fontFamily: 'var(--font-serif), Georgia, serif',
                            fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)',
                            color: 'var(--text-primary)',
                            lineHeight: 1.35,
                            marginBottom: '1rem',
                          }}
                        >
                          {episode.title}
                        </h3>

                        <p
                          style={{
                            fontSize: 'var(--type-small)',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.8,
                            maxWidth: '500px',
                          }}
                        >
                          {episode.description}
                        </p>
                      </div>
                    </article>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quotes Section - THE SHADOW - Dark exploration with spotlight */}
      <div ref={quotesSectionRef}>
        <QuotesSection />
      </div>

      {/* Footer */}
      <footer className="relative py-16 text-center z-20">
        <p
          className="mono"
          style={{ color: 'var(--text-muted)', fontSize: '11px' }}
        >
          The Deep Dive — Reflections on Self
        </p>
      </footer>
    </main>
  );
}
