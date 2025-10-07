import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
import { ELOCalculator } from '@/utils/eloCalculator';

interface UserWarStats {
  eloRating: number;
  warWins: number;
  warLosses: number;
  warDraws: number;
  warStreak: number;
  bestWarStreak: number;
  warGamesPlayed: number;
  provisionalRating: boolean;
}

const EloRatingDisplay = () => {
  const { user } = useAuth();
  const [warStats, setWarStats] = useState<UserWarStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserWarStats();
    }
  }, [user]);

  const fetchUserWarStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', user.$id)]
      );

      if (userDocs.documents.length > 0) {
        const userData = userDocs.documents[0] as any;
        setWarStats({
          eloRating: userData.eloRating || ELOCalculator.DEFAULT_RATING,
          warWins: userData.warWins || 0,
          warLosses: userData.warLosses || 0,
          warDraws: userData.warDraws || 0,
          warStreak: userData.warStreak || 0,
          bestWarStreak: userData.bestWarStreak || 0,
          warGamesPlayed: userData.warGamesPlayed || 0,
          provisionalRating: userData.provisionalRating !== false
        });
      }
    } catch (error) {
      console.error('Error fetching war stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-[var(--background-secondary)] rounded-lg p-6 text-center">
        <p className="text-[var(--text-secondary)]">Please sign in to view your ELO rating</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[var(--background-secondary)] rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-6 bg-gray-700 rounded mb-2"></div>
          <div className="h-6 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!warStats) {
    return (
      <div className="bg-[var(--background-secondary)] rounded-lg p-6 text-center">
        <p className="text-[var(--text-secondary)]">Unable to load war statistics</p>
      </div>
    );
  }

  const winPercentage = warStats.warGamesPlayed > 0 
    ? ((warStats.warWins / warStats.warGamesPlayed) * 100).toFixed(1)
    : '0.0';

  const ratingColor = ELOCalculator.getRatingColor(warStats.eloRating);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border-primary)]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Your War Rating
        </h3>
        {warStats.provisionalRating && (
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
            Provisional
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl font-bold" style={{ color: ratingColor }}>
          {ELOCalculator.formatRating(warStats.eloRating)}
        </div>
        <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
          {warStats.warStreak > 0 ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">+{warStats.warStreak} streak</span>
            </>
          ) : warStats.warStreak < 0 ? (
            <>
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-red-400">{warStats.warStreak} streak</span>
            </>
          ) : (
            <span>No active streak</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--background-primary)] rounded p-3">
          <div className="text-sm text-[var(--text-secondary)] mb-1">Games Played</div>
          <div className="text-2xl font-bold text-white">{warStats.warGamesPlayed}</div>
        </div>
        
        <div className="bg-[var(--background-primary)] rounded p-3">
          <div className="text-sm text-[var(--text-secondary)] mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-white">{winPercentage}%</div>
        </div>
        
        <div className="bg-[var(--background-primary)] rounded p-3">
          <div className="text-sm text-[var(--text-secondary)] mb-1">Record</div>
          <div className="text-lg font-bold text-white">
            <span className="text-green-400">{warStats.warWins}W</span>
            <span className="text-[var(--text-secondary)] mx-1">-</span>
            <span className="text-red-400">{warStats.warLosses}L</span>
            {warStats.warDraws > 0 && (
              <>
                <span className="text-[var(--text-secondary)] mx-1">-</span>
                <span className="text-yellow-400">{warStats.warDraws}D</span>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-[var(--background-primary)] rounded p-3">
          <div className="text-sm text-[var(--text-secondary)] mb-1">Best Streak</div>
          <div className="text-2xl font-bold text-white">{warStats.bestWarStreak}</div>
        </div>
      </div>

      {warStats.provisionalRating && (
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded">
          <p className="text-sm text-orange-400">
            <strong>Provisional Rating:</strong> Play {20 - warStats.warGamesPlayed} more games to establish your official rating.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default EloRatingDisplay;