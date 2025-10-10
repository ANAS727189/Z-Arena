import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';
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
  // loading state removed (unused)

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

  // setLoading(true) removed (loading state unused)
    setOpenModal(true);
  };

   return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-xl border-2 border-green-400/50 bg-gray-900/50 p-6 backdrop-blur-sm shadow-2xl shadow-green-500/10 mb-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-full flex items-center justify-center border border-green-400/30">
              <Swords className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading text-white">War Arena</h1>
              <p className="text-gray-400">Real-time 1v1 competitive programming battles.</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleJoinWar}
            disabled={isInQueue}
            className={`w-full md:w-auto px-8 py-4 rounded-lg font-bold text-lg text-black transition-all duration-300 ${
              isInQueue 
                ? 'bg-yellow-500 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-400 hover:shadow-[0_0_20px_theme(colors.green.500)]'
            }`}
          >
            {isInQueue ? 'In Queue...' : 'Find Match'}
          </motion.button>
        </div>

        <div className="w-full h-[1px] bg-white/10 my-6"></div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-black/30">
                <p className="text-sm text-gray-400 mb-1">Active Battles</p>
                <p className="text-2xl font-bold text-white">{activeMatches}</p>
            </div>
            <div className="p-3 rounded-lg bg-black/30">
                <p className="text-sm text-gray-400 mb-1">Match Duration</p>
                <p className="text-2xl font-bold text-white">5 min</p>
            </div>
            <div className="p-3 rounded-lg bg-black/30">
                <p className="text-sm text-gray-400 mb-1">ELO Rating</p>
                <p className="text-2xl font-bold text-white">±200 Range</p>
            </div>
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