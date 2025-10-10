// src/components/ui/floating-icon.tsx
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FloatingIconProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const FloatingIcon = ({ children, className, delay = 0 }: FloatingIconProps) => {
  return (
    <motion.div
      className={`absolute z-10 rounded-xl border border-white/10 bg-black/30 p-3 shadow-2xl shadow-green-500/10 backdrop-blur-md ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        delay,
      }}
      // Gentle floating animation
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingIcon;