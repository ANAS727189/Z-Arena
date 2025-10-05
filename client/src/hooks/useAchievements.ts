import { useState, useEffect } from 'react';
import { achievementService } from '../services/achievementService';
import { AchievementsCache } from '../utils/achievementsCache';
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

  const loadAchievements = async (forceRefresh = false) => {
    if (!user) {
      setAchievements([]);
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      // First, try to load from cache if not forcing refresh
      if (!forceRefresh) {
        const cached = AchievementsCache.getCachedAchievements(user.$id);
        if (cached.achievements && cached.stats) {
          console.log('📊 Loading achievements from cache');
          setAchievements(cached.achievements);
          setStats(cached.stats);
          setLoading(false);
          setError(null);
          
          // Still fetch from server in background to check for updates
          setTimeout(() => loadAchievements(true), 100);
          return;
        }
      }

      setLoading(true);
      setError(null);
      console.log('🔄 Loading achievements from database');

      const [achievementsData, statsData] = await Promise.all([
        achievementService.getUserAchievements(user.$id),
        achievementService.getAchievementStats(user.$id)
      ]);

      setAchievements(achievementsData);
      setStats(statsData);
      
      // Cache the loaded data
      AchievementsCache.setCachedAchievements(user.$id, achievementsData, statsData);
    } catch (err) {
      console.error('Failed to load achievements:', err);
      setError(err instanceof Error ? err.message : 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const refreshAchievements = async () => {
    if (user) {
      AchievementsCache.clearCache(user.$id);
    }
    await loadAchievements(true);
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