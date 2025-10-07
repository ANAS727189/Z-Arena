import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { WarService } from '@/services/warService';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
import type { WarMatch, WarQueue, WarLeaderboard, WarMatchHistory } from '@/types';

interface UseWarReturn {
  // User stats
  userElo: number;
  warStats: {
    warWins: number;
    warLosses: number;
    warDraws: number;
    warStreak: number;
    bestWarStreak: number;
    warGamesPlayed: number;
    provisionalRating: boolean;
  } | null;
  
  // Queue status
  isInQueue: boolean;
  queueStatus: string;
  
  // Active match
  activeMatch: WarMatch | null;
  
  // Leaderboard
  warLeaderboard: WarLeaderboard[];
  
  // Match history
  matchHistory: WarMatchHistory[];
  
  // Loading states
  loading: boolean;
  
  // Actions
  joinQueue: (preferredLanguages: string[]) => Promise<void>;
  leaveQueue: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

export const useWar = (): UseWarReturn => {
  const { user } = useAuth();
  
  // State
  const [userElo, setUserElo] = useState(800);
  const [warStats, setWarStats] = useState<UseWarReturn['warStats']>(null);
  const [isInQueue, setIsInQueue] = useState(false);
  const [queueStatus, setQueueStatus] = useState('idle');
  const [activeMatch, setActiveMatch] = useState<WarMatch | null>(null);
  const [warLeaderboard, setWarLeaderboard] = useState<WarLeaderboard[]>([]);
  const [matchHistory, setMatchHistory] = useState<WarMatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      refreshStats();
    }
  }, [user]);

  const refreshStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch user war stats
      const userDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', user.$id)]
      );

      if (userDocs.documents.length > 0) {
        const userData = userDocs.documents[0] as any;
        setUserElo(userData.eloRating || 800);
        setWarStats({
          warWins: userData.warWins || 0,
          warLosses: userData.warLosses || 0,
          warDraws: userData.warDraws || 0,
          warStreak: userData.warStreak || 0,
          bestWarStreak: userData.bestWarStreak || 0,
          warGamesPlayed: userData.warGamesPlayed || 0,
          provisionalRating: userData.provisionalRating !== false
        });
      }

      // Check queue status
      const queueDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WAR_QUEUE,
        [
          Query.equal('userId', user.$id),
          Query.equal('status', 'waiting')
        ]
      );
      setIsInQueue(queueDocs.documents.length > 0);

      // Check for active match
      const activeDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WAR_MATCHES,
        [
          Query.equal('status', 'active'),
          Query.or([
            Query.equal('player1Id', user.$id),
            Query.equal('player2Id', user.$id)
          ])
        ]
      );
      setActiveMatch(activeDocs.documents[0] as unknown as WarMatch || null);

      // Fetch leaderboard
      const leaderboardDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WAR_LEADERBOARD,
        [
          Query.orderDesc('eloRating'),
          Query.limit(50)
        ]
      );
      setWarLeaderboard(leaderboardDocs.documents as unknown as WarLeaderboard[]);

      // Fetch match history
      const historyDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WAR_MATCH_HISTORY,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('matchDate'),
          Query.limit(20)
        ]
      );
      setMatchHistory(historyDocs.documents as unknown as WarMatchHistory[]);

    } catch (error) {
      console.error('Error refreshing war stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinQueue = async (preferredLanguages: string[]) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setQueueStatus('joining');
      await WarService.joinQueue(user.$id, userElo, preferredLanguages);
      setIsInQueue(true);
      setQueueStatus('waiting');
    } catch (error) {
      setQueueStatus('error');
      throw error;
    }
  };

  const leaveQueue = async () => {
    if (!user) return;

    try {
      await WarService.leaveQueue(user.$id);
      setIsInQueue(false);
      setQueueStatus('idle');
    } catch (error) {
      console.error('Error leaving queue:', error);
      throw error;
    }
  };

  return {
    userElo,
    warStats,
    isInQueue,
    queueStatus,
    activeMatch,
    warLeaderboard,
    matchHistory,
    loading,
    joinQueue,
    leaveQueue,
    refreshStats
  };
};