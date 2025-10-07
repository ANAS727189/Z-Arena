import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Users, Clock, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import MatchmakingModal from './MatchmakingModal';
import { databases, DATABASE_ID, COLLECTIONS, Query, client } from '@/lib/appwrite';
import type { WarMatch } from '@/types';

interface WarHeaderProps {
  onMatchFound?: (match: WarMatch) => void;
}

const WarHeader = ({ onMatchFound }: WarHeaderProps) => {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [isInQueue, setIsInQueue] = useState(false);  
  const [activeMatches, setActiveMatches] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserStatus();
    }
    fetchActiveMatches();

    // Subscribe to match updates to refresh active count
    const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTIONS.WAR_MATCHES}.documents`, (response: any) => {
      console.log('Match update received:', response);
      fetchActiveMatches(); // Refresh active matches count
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const checkUserStatus = async () => {
    if (!user) return;

    try {
      // Check if user is in queue
      const queueDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WAR_QUEUE,
        [
          Query.equal('userId', user.$id),
          Query.equal('status', 'waiting')
        ]
      );
      setIsInQueue(queueDocs.documents.length > 0);
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const fetchActiveMatches = async () => {
    try {
      const activeDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WAR_MATCHES,
        [
          Query.equal('status', 'active'),
          Query.limit(100)
        ]
      );
      setActiveMatches(activeDocs.documents.length);
      console.log('Active matches count:', activeDocs.documents.length);
    } catch (error) {
      console.error('Error fetching active matches:', error);
    }
  };

  const handleJoinWar = async () => {
    if (!user) {
      alert('Please sign in to join wars');
      return;
    }

    if (isInQueue) {
      alert('You are already in the matchmaking queue');
      return;
    }

    setLoading(true);
    setOpenModal(true);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/20 rounded-lg p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">War Arena</h1>
              <p className="text-[var(--text-secondary)]">Real-time competitive programming battles</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleJoinWar}
            disabled={loading || isInQueue}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
              isInQueue 
                ? 'bg-yellow-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-500/25'
            }`}
          >
            {isInQueue ? 'In Queue...' : loading ? 'Starting...' : 'Join Battle'}
          </motion.button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[var(--background-secondary)]/50 rounded p-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-[var(--text-secondary)]">Active Battles</span>
            </div>
            <div className="text-2xl font-bold text-white">{activeMatches}</div>
          </div>
          
          <div className="bg-[var(--background-secondary)]/50 rounded p-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm text-[var(--text-secondary)]">Match Duration</span>
            </div>
            <div className="text-2xl font-bold text-white">5 min</div>
          </div>
          
          <div className="bg-[var(--background-secondary)]/50 rounded p-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-[var(--text-secondary)]">Challenges</span>
            </div>
            <div className="text-2xl font-bold text-white">5</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-[var(--background-primary)]/50 rounded border border-[var(--border-primary)]">
          <h3 className="text-white font-semibold mb-2">How War Works:</h3>
          <ul className="text-sm text-[var(--text-secondary)] space-y-1">
            <li>• Get matched with a player within ±200 ELO of your rating</li>
            <li>• Solve 5 random challenges in 5 minutes</li>
            <li>• Earn points for correct solutions and fast completion</li>
            <li>• Win, lose, or draw affects your ELO rating</li>
          </ul>
        </div>
      </motion.div>

      {openModal && (
        <MatchmakingModal 
          setOpenModal={setOpenModal} 
          onQueueJoined={() => setIsInQueue(true)}
          onQueueLeft={() => setIsInQueue(false)}
          onMatchFound={onMatchFound}
        />
      )}
    </>
  );
};

export default WarHeader;