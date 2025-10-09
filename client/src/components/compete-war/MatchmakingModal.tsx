import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Swords, CheckCircle  } from 'lucide-react';
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

 const matchDetails = [
    "Matched with players in your ELO range (±200)",
    "Solve random challenges against the clock",
    "Win or lose affects your ELO rating",
    "Prove your skills in the Arena!",
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative bg-gray-900/50 rounded-xl max-w-md w-full border border-white/10 shadow-2xl shadow-green-500/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading text-white">War Matchmaking</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* --- IDLE STATE --- */}
            {status === 'idle' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <Swords className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Ready for Battle?</h3>
                <p className="text-gray-400 mb-6">You'll be matched with a player close to your ELO rating ({userElo}).</p>
                <div className="text-left bg-black/30 rounded-lg p-4 mb-6 border border-white/10 space-y-2">
                    {matchDetails.map((detail, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                            <p className="text-sm text-gray-300">{detail}</p>
                        </div>
                    ))}
                </div>
                <button
                  onClick={startMatchmaking}
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.green.500)]"
                >
                  Find Match
                </button>
              </div>
            )}

            {/* --- SEARCHING STATE --- */}
            {status === 'searching' && (
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    {/* Pulsing rings */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div key={i} className="absolute inset-0 rounded-full border border-green-500"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'linear' }}
                        />
                    ))}
                    <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Searching for Opponent...</h3>
                <p className="text-gray-400 mb-4">Finding players with ELO {userElo - 200} - {userElo + 200}</p>
                <div className="bg-black/30 rounded-lg p-4 mb-6 border border-white/10">
                    <p className="text-3xl text-white font-mono">{formatTime(waitTime)}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Elapsed Time</p>
                </div>
                <button onClick={cancelMatchmaking} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  Cancel Search
                </button>
              </div>
            )}
            
            {/* --- FOUND & ERROR STATES --- */}
            {status === 'found' && (
                <div className="text-center py-8">
                    <motion.div
                        className="w-20 h-20 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-green-500/20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">Match Found!</h3>
                    <p className="text-gray-400">Preparing battle room...</p>
                </div>
            )}
            {status === 'error' && (
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                        <X className="w-10 h-10 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Matchmaking Failed</h3>
                    <p className="text-red-400 mb-6">{errorMessage}</p>
                    <button onClick={() => setStatus('idle')} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-lg transition-colors">
                        Try Again
                    </button>
                </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MatchmakingModal;