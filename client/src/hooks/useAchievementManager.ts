import { useState, useEffect, useCallback } from 'react';
import { achievementPollingService } from '../services/achievementPollingService';
import type { Achievement } from '../services/achievementService';
import { useAuth } from './useAuth';

interface UseAchievementManagerReturn {
  newAchievements: Achievement[];
  removeAchievement: (achievementId: string) => void;
  clearAllAchievements: () => void;
}

export const useAchievementManager = (): UseAchievementManagerReturn => {
  const { user } = useAuth();
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // Handle new achievement notifications
  const handleNewAchievement = useCallback((achievement: Achievement) => {
    setNewAchievements(prev => [...prev, achievement]);
    
    // Auto-remove after 8 seconds if not manually closed
    setTimeout(() => {
      removeAchievement(achievement.$id);
    }, 8000);
  }, []);

  const removeAchievement = useCallback((achievementId: string) => {
    setNewAchievements(prev => prev.filter(achievement => achievement.$id !== achievementId));
  }, []);

  const clearAllAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  // Start/stop polling based on user login status
  useEffect(() => {
    if (user) {
      achievementPollingService.startPolling(handleNewAchievement);
    } else {
      achievementPollingService.stopPolling();
      setNewAchievements([]); // Clear achievements when user logs out
    }

    return () => {
      achievementPollingService.stopPolling();
    };
  }, [user, handleNewAchievement]);

  return {
    newAchievements,
    removeAchievement,
    clearAllAchievements,
  };
};