'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface WarmBackgroundProps {
  isActive: boolean;
}

export default function WarmBackground({ isActive }: WarmBackgroundProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          {/* Warm radial glow from center */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 40%, rgba(122, 158, 142, 0.04) 0%, transparent 60%)',
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Subtle warm vignette that breathes */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(201, 166, 107, 0.02) 100%)',
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Ambient warmth overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(201, 166, 107, 0.01) 0%, rgba(26, 24, 22, 0) 30%, rgba(201, 166, 107, 0.02) 100%)',
            }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
