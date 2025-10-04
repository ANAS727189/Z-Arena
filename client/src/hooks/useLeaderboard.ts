import { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboardService';
import { userService } from '../services/userService';
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

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

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
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboard = async () => {
    await loadLeaderboard();
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