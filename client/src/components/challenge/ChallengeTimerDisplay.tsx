import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';

interface ChallengeTimerDisplayProps {
  isRunning: boolean;
  formattedTime: string;
  className?: string;
}

export const ChallengeTimerDisplay: React.FC<ChallengeTimerDisplayProps> = ({
  isRunning,
  formattedTime,
  className = '',
}) => {
  if (!isRunning && formattedTime === '00:00') return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/80 border border-gray-700/50 ${className}`}
    >
      <div className="flex items-center gap-2">
        {isRunning ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Zap className="w-4 h-4 text-yellow-500" />
          </motion.div>
        ) : (
          <Clock className="w-4 h-4 text-gray-400" />
        )}
        
        <span className={`font-mono text-sm font-semibold ${
          isRunning ? 'text-yellow-400' : 'text-gray-400'
        }`}>
          {formattedTime}
        </span>
      </div>
      
      {isRunning && (
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 bg-red-500 rounded-full"
        />
      )}
    </motion.div>
  );
};