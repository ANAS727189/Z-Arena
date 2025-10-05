import { useState, useEffect } from 'react';
import { achievementService } from '../services/achievementService';
import type { Achievement, AchievementStats } from '../services/achievementService';
import { useAuth } from './useAuth';

interface UseAchievementsReturn {
  achievements: Achievement[];
  stats: AchievementStats | null;
  loading: boolean;
  error: string | null;
  refreshAchievements: () => Promise<void>;
}

export const useAchievements = (): UseAchievementsReturn => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAchievements = async () => {
    if (!user) {
      setAchievements([]);
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [achievementsData, statsData] = await Promise.all([
        achievementService.getUserAchievements(user.$id),
        achievementService.getAchievementStats(user.$id)
      ]);

      setAchievements(achievementsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load achievements:', err);
      setError(err instanceof Error ? err.message : 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const refreshAchievements = async () => {
    await loadAchievements();
  };

  useEffect(() => {
    loadAchievements();
  }, [user]);

  return {
    achievements,
    stats,
    loading,
    error,
    refreshAchievements,
  };
};