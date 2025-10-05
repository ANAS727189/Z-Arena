import { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboardService';
import { userService } from '../services/userService';
import { LeaderboardCache } from '../utils/leaderboardCache';
import type { LeaderboardUser, LeaderboardFilters } from '../services/leaderboardService';
import { useAuth } from './useAuth';

interface UseLeaderboardReturn {
  // Data
  leaderboard: LeaderboardUser[];
  currentUserRank: { rank: number; total: number } | null;
  stats: any;
  loading: boolean;
  error: string | null;

  // Filters
  filters: LeaderboardFilters;
  setFilters: React.Dispatch<React.SetStateAction<LeaderboardFilters>>;

  // Actions
  refreshLeaderboard: () => Promise<void>;
}

export const useLeaderboard = (): UseLeaderboardReturn => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<{ rank: number; total: number } | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeframe: 'all',
    category: 'points'
  });

  const loadLeaderboard = async (forceRefresh = false) => {
    try {
      // First, try to load from cache if not forcing refresh
      if (!forceRefresh) {
        const cached = LeaderboardCache.getCachedLeaderboard(filters);
        if (cached.leaderboard && cached.stats) {
          console.log('🏆 Loading leaderboard from cache');
          setLeaderboard(cached.leaderboard);
          setCurrentUserRank(cached.userRank);
          setStats(cached.stats);
          setLoading(false);
          setError(null);
          
          // Still fetch from server in background to check for updates
          setTimeout(() => loadLeaderboard(true), 100);
          return;
        }
      }

      setLoading(true);
      setError(null);
      console.log('🔄 Loading leaderboard from database');

      // Initialize user stats if user is logged in
      if (user) {
        try {
          await userService.initializeUserStats();
        } catch (error) {
          console.error('Failed to initialize user stats:', error);
        }
      }

      const [leaderboardData, userRank, leaderboardStats] = await Promise.all([
        leaderboardService.getLeaderboard(filters),
        user ? leaderboardService.getCurrentUserRank(filters) : null,
        leaderboardService.getLeaderboardStats()
      ]);

      setLeaderboard(leaderboardData);
      setCurrentUserRank(userRank);
      setStats(leaderboardStats);
      
      // Cache the loaded data
      LeaderboardCache.setCachedLeaderboard(filters, leaderboardData, userRank, leaderboardStats);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboard = async () => {
    LeaderboardCache.clearCache();
    await loadLeaderboard(true);
  };

  useEffect(() => {
    loadLeaderboard();
  }, [filters, user]);

  return {
    // Data
    leaderboard,
    currentUserRank,
    stats,
    loading,
    error,

    // Filters
    filters,
    setFilters,

    // Actions
    refreshLeaderboard,
  };
};