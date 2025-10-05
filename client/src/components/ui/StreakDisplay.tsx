import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  currentStreak: number;
  maxStreak?: number;
  size?: 'sm' | 'md' | 'lg';
  showMaxStreak?: boolean;
  className?: string;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  maxStreak,
  size = 'md',
  showMaxStreak = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1',
      icon: 'w-4 h-4',
      text: 'text-sm',
      badge: 'text-xs',
    },
    md: {
      container: 'px-3 py-2',
      icon: 'w-5 h-5',
      text: 'text-base',
      badge: 'text-sm',
    },
    lg: {
      container: 'px-4 py-3',
      icon: 'w-6 h-6',
      text: 'text-lg',
      badge: 'text-base',
    },
  };

  const classes = sizeClasses[size];
  
  // Determine flame color based on streak length
  const getFlameColor = (streak: number) => {
    if (streak === 0) return 'text-gray-400';
    if (streak < 3) return 'text-orange-400';
    if (streak < 7) return 'text-orange-500';
    if (streak < 30) return 'text-red-500';
    return 'text-purple-500'; // Epic streak!
  };

  const flameColor = getFlameColor(currentStreak);

  return (
    <div className={`flex items-center ${classes.container} ${className}`}>
      <motion.div
        animate={currentStreak > 0 ? { 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0] 
        } : {}}
        transition={{ 
          duration: 0.5,
          repeat: currentStreak > 7 ? Infinity : 0,
          repeatDelay: 2
        }}
        className="flex items-center"
      >
        <Flame className={`${classes.icon} ${flameColor} mr-1`} />
      </motion.div>
      
      <div className="flex flex-col">
        <span className={`font-bold ${classes.text} text-white`}>
          {currentStreak}
        </span>
        
        {showMaxStreak && maxStreak && maxStreak > 0 && (
          <span className={`${classes.badge} text-gray-400`}>
            Max: {maxStreak}
          </span>
        )}
      </div>
      
      {size !== 'sm' && (
        <span className={`ml-2 ${classes.text} text-gray-300`}>
          day{currentStreak !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};