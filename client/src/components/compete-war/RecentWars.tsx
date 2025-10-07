import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
import type { WarMatchHistory } from '@/types';

const RecentWars = () => {
  const { user } = useAuth();
  const [recentMatches, setRecentMatches] = useState<WarMatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentMatches();
    }
  }, [user]);

  const fetchRecentMatches = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const matchDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WAR_MATCH_HISTORY,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('matchDate'),
          Query.limit(10)
        ]
      );

      setRecentMatches(matchDocs.documents as unknown as WarMatchHistory[]);
    } catch (error) {
      console.error('Error fetching recent matches:', error);
      // Create mock data for testing
      setRecentMatches([
        {
          $id: '1',
          matchId: 'match_1',
          userId: user?.$id || 'user1',
          opponentId: 'opponent1',
          result: 'win',
          userScore: 85,
          opponentScore: 65,
          userEloBefore: 1200,
          userEloAfter: 1215,
          eloChange: 15,
          opponentEloBefore: 1180,
          challengesSolved: 4,
          totalChallenges: 5,
          matchDuration: 280000, // 4:40
          averageTime: 56000, // 56 seconds per challenge
          matchDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString()
        },
        {
          $id: '2',
          matchId: 'match_2',
          userId: user?.$id || 'user1',
          opponentId: 'opponent2',
          result: 'loss',
          userScore: 45,
          opponentScore: 75,
          userEloBefore: 1215,
          userEloAfter: 1200,
          eloChange: -15,
          opponentEloBefore: 1240,
          challengesSolved: 2,
          totalChallenges: 5,
          matchDuration: 300000, // 5:00 (full time)
          averageTime: 60000, // 1 minute per challenge
          matchDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString()
        },
        {
          $id: '3',
          matchId: 'match_3',
          userId: user?.$id || 'user1',
          opponentId: 'opponent3',
          result: 'draw',
          userScore: 60,
          opponentScore: 60,
          userEloBefore: 1200,
          userEloAfter: 1200,
          eloChange: 0,
          opponentEloBefore: 1200,
          challengesSolved: 3,
          totalChallenges: 5,
          matchDuration: 295000, // 4:55
          averageTime: 59000, // 59 seconds per challenge
          matchDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'win':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'loss':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'draw':
        return <Minus className="w-4 h-4 text-yellow-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win':
        return 'text-green-400';
      case 'loss':
        return 'text-red-400';
      case 'draw':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const matchDate = new Date(dateString);
    const diffMs = now.getTime() - matchDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    }
  };

  const getOpponentName = (opponentId: string) => {
    // This would normally fetch the actual username
    return `Player${opponentId.slice(-4)}`;
  };

  if (!user) {
    return (
      <div className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border-primary)] flex-1">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Recent Wars
        </h3>
        <div className="text-center py-8">
          <p className="text-[var(--text-secondary)]">Please sign in to view your match history</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border-primary)] flex-1"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Recent Wars
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
              <div className="h-6 bg-gray-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border-primary)] flex-1"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-400" />
        Recent Wars
      </h3>

      <div className="space-y-3">
        {recentMatches.map((match, index) => (
          <motion.div
            key={match.$id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded bg-[var(--background-primary)]/50 hover:bg-[var(--background-primary)]/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded bg-[var(--background-secondary)]">
                {getResultIcon(match.result)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${getResultColor(match.result)}`}>
                    {match.result.toUpperCase()}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">vs</span>
                  <span className="text-white text-sm">{getOpponentName(match.opponentId)}</span>
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {match.userScore}-{match.opponentScore} • {formatDuration(match.matchDuration)} • {formatTimeAgo(match.matchDate)}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`font-bold text-sm ${match.eloChange > 0 ? 'text-green-400' : match.eloChange < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                {match.eloChange > 0 ? '+' : ''}{match.eloChange}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {match.challengesSolved}/{match.totalChallenges}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {recentMatches.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-3" />
          <p className="text-[var(--text-secondary)]">No battles yet</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Start your first war to see match history here!</p>
        </div>
      )}
    </motion.div>
  );
};

export default RecentWars;