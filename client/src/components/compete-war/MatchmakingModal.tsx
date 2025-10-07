import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Users, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { WarService } from '@/services/warService';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
import type { WarMatch } from '@/types';

interface MatchmakingModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  onQueueJoined?: () => void;
  onQueueLeft?: () => void;
  onMatchFound?: (match: WarMatch) => void;
}

const MatchmakingModal: React.FC<MatchmakingModalProps> = ({ 
  setOpenModal, 
  onQueueJoined, 
  onQueueLeft,
  onMatchFound 
}) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'error'>('idle');
  const [waitTime, setWaitTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [userElo, setUserElo] = useState(800);

  useEffect(() => {
    if (user) {
      fetchUserElo();
    }
  }, [user]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'searching') {
      interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const fetchUserElo = async () => {
    if (!user) return;
    
    try {
      const userDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', user.$id)]
      );

      if (userDocs.documents.length > 0) {
        const userData = userDocs.documents[0] as any;
        setUserElo(userData.eloRating || 800);
      }
    } catch (error) {
      console.error('Error fetching user ELO:', error);
    }
  };

  const startMatchmaking = async () => {
    if (!user) return;

    try {
      setStatus('searching');
      setWaitTime(0);
      setErrorMessage('');
      
      // Join the queue
      await WarService.joinQueue(user.$id, userElo, ['javascript', 'python', 'cpp']);
      onQueueJoined?.();

      // Start looking for matches
      const matchInterval = setInterval(async () => {
        try {
          // First check if we're already matched (another player found us)
          const myQueueStatus = await WarService.getMyQueueStatus(user.$id);
          
          if (myQueueStatus && myQueueStatus.status === 'matched') {
            // We were matched by another player, find our match
            const myMatch = await WarService.findMyActiveMatch(user.$id);
            if (myMatch) {
              setStatus('found');
              clearInterval(matchInterval);
              
              setTimeout(() => {
                setOpenModal(false);
                onQueueLeft?.();
                onMatchFound?.(myMatch);
              }, 2000);
              return;
            }
          }

          // Look for opponents
          const opponent = await WarService.findMatch(user.$id, userElo);
          
          if (opponent) {
            // Found a match, create the match
            const match = await WarService.createMatch(
              user.$id,
              userElo,
              opponent
            );
            
            setStatus('found');
            clearInterval(matchInterval);
            
            setTimeout(() => {
              setOpenModal(false);
              onQueueLeft?.();
              onMatchFound?.(match);
            }, 2000);
          } else {
            console.log(`No opponent found for user ${user.$id} with ELO ${userElo}, waiting...`);
          }
        } catch (error) {
          console.error('Error finding match:', error);
          clearInterval(matchInterval);
          setStatus('error');
          setErrorMessage('Failed to find a match. Please try again.');
          // Cleanup: remove from queue on error
          try {
            await WarService.leaveQueue(user.$id);
            onQueueLeft?.();
          } catch (cleanupError) {
            console.error('Error cleaning up queue:', cleanupError);
          }
        }
      }, 3000); // Check every 3 seconds (reduced frequency)

      // Auto-cancel after 2 minutes
      setTimeout(async () => {
        clearInterval(matchInterval);
        if (status === 'searching') {
          setStatus('error');
          setErrorMessage('No opponents found. Please try again later.');
          // Cleanup: remove from queue on timeout
          try {
            await WarService.leaveQueue(user.$id);
            onQueueLeft?.();
          } catch (cleanupError) {
            console.error('Error cleaning up queue:', cleanupError);
          }
        }
      }, 120000);

    } catch (error) {
      console.error('Error starting matchmaking:', error);
      setStatus('error');
      setErrorMessage('Failed to join matchmaking queue. Please try again.');
      // Cleanup: remove from queue on error
      try {
        await WarService.leaveQueue(user.$id);
        onQueueLeft?.();
      } catch (cleanupError) {
        console.error('Error cleaning up queue:', cleanupError);
      }
    }
  };

  const cancelMatchmaking = async () => {
    if (!user) return;

    try {
      await WarService.leaveQueue(user.$id);
      onQueueLeft?.();
      setStatus('idle');
      setWaitTime(0);
    } catch (error) {
      console.error('Error leaving queue:', error);
    }
  };

  const closeModal = () => {
    if (status === 'searching') {
      cancelMatchmaking();
    }
    setOpenModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[var(--background-secondary)] rounded-lg p-6 max-w-md w-full mx-4 border border-[var(--border-primary)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">War Matchmaking</h2>
            <button
              onClick={closeModal}
              className="text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {status === 'idle' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Ready for Battle?</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                You'll be matched with a player close to your ELO rating ({userElo})
              </p>
              <div className="bg-[var(--background-primary)] rounded p-3 mb-6">
                <div className="text-sm text-[var(--text-secondary)] mb-2">Match Details:</div>
                <ul className="text-sm text-white space-y-1">
                  <li>• 5 random challenges</li>
                  <li>• 5 minute time limit</li>
                  <li>• ELO rating at stake</li>
                  <li>• Real-time competition</li>
                </ul>
              </div>
              <button
                onClick={startMatchmaking}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Start Matchmaking
              </button>
            </div>
          )}

          {status === 'searching' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Searching for Opponent</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Looking for players with ELO {userElo - 200} - {userElo + 200}
              </p>
              <div className="bg-[var(--background-primary)] rounded p-3 mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-mono text-lg">{formatTime(waitTime)}</span>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {waitTime < 30 ? 'Finding perfect match...' : 
                   waitTime < 60 ? 'Expanding search range...' : 
                   'Looking for any available opponent...'}
                </div>
              </div>
              <button
                onClick={cancelMatchmaking}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Cancel Search
              </button>
            </div>
          )}

          {status === 'found' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Match Found!</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Preparing battle room...
              </p>
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Error</h3>
              <p className="text-red-400 mb-4">{errorMessage}</p>
              <button
                onClick={() => setStatus('idle')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MatchmakingModal;