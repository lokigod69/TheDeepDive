'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CirclePlayerProps {
  audioUrl: string;
  duration: number;
  durationFormatted: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export default function CirclePlayer({ audioUrl, onPlayStateChange }: CirclePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [actualDuration, setActualDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Notify parent of play state changes
  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  // Format time to MM:SS
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update current time and get actual duration from audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setIsLoaded(true);
      // Get the actual duration from the audio file
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setActualDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setActualDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Calculate progress percentage using actual duration
  const progress = actualDuration > 0 ? (currentTime / actualDuration) * 100 : 0;

  // Handle seeking on progress bar using actual duration
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || actualDuration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * actualDuration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Breathing Circle */}
      <motion.button
        onClick={togglePlay}
        className="relative flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2"
        style={{
          width: '180px',
          height: '180px',
          background: 'var(--bg-elevated)',
          border: `2px solid ${isPlaying ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Inner animated rings when playing */}
        <AnimatePresence>
          {isPlaying && (
            <>
              {/* Pulsing inner ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: '160px',
                  height: '160px',
                  border: '1px solid var(--accent-primary)',
                  opacity: 0.3,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              {/* Second pulsing ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: '140px',
                  height: '140px',
                  border: '1px solid var(--accent-primary)',
                  opacity: 0.2,
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.05, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              />
              {/* Center glow */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Play/Pause Icon */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.svg
                key="pause"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <rect x="10" y="8" width="4" height="16" rx="1" fill="var(--accent-primary)" />
                <rect x="18" y="8" width="4" height="16" rx="1" fill="var(--accent-primary)" />
              </motion.svg>
            ) : (
              <motion.svg
                key="play"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  d="M12 8L24 16L12 24V8Z"
                  fill="var(--text-primary)"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>

        {/* Circular progress ring */}
        <svg
          className="absolute inset-0"
          style={{ transform: 'rotate(-90deg)' }}
          viewBox="0 0 180 180"
        >
          <circle
            cx="90"
            cy="90"
            r="88"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="2"
            opacity="0.3"
          />
          <motion.circle
            cx="90"
            cy="90"
            r="88"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
            transition={{ duration: 0.1 }}
          />
        </svg>
      </motion.button>

      {/* Progress bar - with larger touch target */}
      <div className="w-full max-w-md mt-8">
        <div
          className="relative h-8 flex items-center cursor-pointer touch-none"
          onClick={handleSeek}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            if (audioRef.current && actualDuration > 0) {
              const newTime = percentage * actualDuration;
              audioRef.current.currentTime = newTime;
              setCurrentTime(newTime);
            }
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            if (audioRef.current && actualDuration > 0) {
              const newTime = percentage * actualDuration;
              audioRef.current.currentTime = newTime;
              setCurrentTime(newTime);
            }
          }}
        >
          {/* Visual track - thin line */}
          <div
            className="absolute left-0 right-0 h-1 rounded-full"
            style={{ background: 'var(--border-subtle)' }}
          />
          <motion.div
            className="absolute left-0 h-1 rounded-full"
            style={{
              background: 'var(--accent-primary)',
              width: `${progress}%`,
            }}
            transition={{ duration: 0.1 }}
          />
          {/* Playhead dot - larger for touch */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 md:w-3 md:h-3 rounded-full"
            style={{
              background: 'var(--accent-primary)',
              left: `calc(${progress}% - 8px)`,
              boxShadow: '0 0 8px var(--accent-glow)',
            }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Time display - using actual duration from audio */}
        <div className="flex justify-between mt-3">
          <span
            className="mono"
            style={{ fontSize: 'var(--type-mono)', color: 'var(--text-muted)' }}
          >
            {formatTime(currentTime)}
          </span>
          <span
            className="mono"
            style={{ fontSize: 'var(--type-mono)', color: 'var(--text-muted)' }}
          >
            {formatTime(actualDuration)}
          </span>
        </div>
      </div>
    </div>
  );
}
