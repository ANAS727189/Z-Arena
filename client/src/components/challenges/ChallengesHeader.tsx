import React, { useEffect, useState } from 'react';
import { Database, Loader2, Trophy, BarChart3, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { challengeService } from '@/services/challengeService';
import { userService } from '@/services/userService';
import type { UserStatsDocument } from '@/services/challengeService';

interface ChallengesHeaderProps {
  onSeedChallenges: () => void;
  seeding: boolean;
}

export const ChallengesHeader: React.FC<ChallengesHeaderProps> = ({
  onSeedChallenges,
  seeding,
}) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStatsDocument | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const isAdmin = user?.email === 'anas23khan083@gmail.com';

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) return;
      setLoadingStats(true);
      try {
        // Make sure stats exist
        await userService.initializeUserStats();
        const stats = await challengeService.getUserStats(user.$id);
        setUserStats(stats);
      } catch (err) {
        console.error('Error loading user stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    loadUserStats();
  }, [user]);

  return (
    <div className="mb-12">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
            Code Challenges
          </h1>
          <p className="font-body text-lg text-gray-400 mt-2">
            Sharpen your skills. Climb the ranks. Conquer the arena.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onSeedChallenges}
            disabled={seeding}
            className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            {seeding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            {seeding ? 'Seeding...' : 'Seed DB'}
          </button>
        )}
      </div>

      {/* User Stats Section */}
      {user && (
        <div className="mt-8 p-6 rounded-xl border border-white/10 bg-gray-900/30 backdrop-blur-sm">
          {loadingStats ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : userStats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              {/* Challenges Solved */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {userStats.solvedChallenges?.length || 0} / 48
                  </p>
                  <p className="text-sm text-gray-400">Challenges Solved</p>
                </div>
              </div>

              {/* Total Points */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {userStats.totalPoints?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-gray-400">Total Points</p>
                </div>
              </div>

              {/* Rank */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {userStats.rank || '—'}
                  </p>
                  <p className="text-sm text-gray-400">Global Rank</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400">No user stats found.</p>
          )}
        </div>
      )}
    </div>
  );
};
