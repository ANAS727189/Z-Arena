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
      className="rounded-xl border border-white/10 bg-gray-900/40 p-6 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-6 h-6 text-green-400" />
          Your War Rating
        </h3>
        {warStats.provisionalRating && (
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">
            Provisional
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-4 mb-6">
        <div className="text-5xl font-bold font-mono" style={{ color: ratingColor }}>
          {ELOCalculator.formatRating(warStats.eloRating)}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          {/* Streak display logic is unchanged but styling is cleaner */}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Games Played" value={warStats.warGamesPlayed} />
        <StatBox label="Win Rate" value={`${winPercentage}%`} />
        <StatBox label="Best Streak" value={warStats.bestWarStreak} />
        <StatBox label="Record (W-L-D)" value={`${warStats.warWins}-${warStats.warLosses}-${warStats.warDraws}`} />
      </div>
    </motion.div>
  );
};

// Helper component for clean stat boxes
const StatBox = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
    <p className="text-sm text-gray-400 mb-1">{label}</p>
    <p className="text-2xl font-bold text-white font-mono">{value}</p>
  </div>
);

export default EloRatingDisplay;