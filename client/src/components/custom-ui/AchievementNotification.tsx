import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { achievementService } from '../../services/achievementService';
import type { Achievement } from '../../services/achievementService';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.9 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-6 shadow-2xl border border-yellow-400/20 max-w-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-200" />
          <span className="text-sm font-medium text-yellow-100">Achievement Unlocked!</span>
        </div>
        <button
          onClick={onClose}
          className="text-yellow-200 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="text-3xl">
          {achievementService.getAchievementIcon(achievement.achievementType)}
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">
            {achievement.title}
          </h3>
          <p className="text-yellow-100 text-sm">
            {achievement.description}
          </p>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 p-0.5">
        <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500" />
      </div>
    </motion.div>
  );
};

interface AchievementNotificationsProps {
  achievements: Achievement[];
  onRemove: (achievementId: string) => void;
}

export const AchievementNotifications: React.FC<AchievementNotificationsProps> = ({
  achievements,
  onRemove
}) => {
  return (
    <AnimatePresence>
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.$id}
          style={{ top: `${16 + index * 120}px` }}
          className="absolute"
        >
          <AchievementNotification
            achievement={achievement}
            onClose={() => onRemove(achievement.$id)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};