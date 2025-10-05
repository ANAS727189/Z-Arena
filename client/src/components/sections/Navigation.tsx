import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { AuthModal } from '../AuthModal';
import { ProfileDropdown } from '../ui/ProfileDropdown';
import { StreakDisplay } from '../ui/StreakDisplay';
import { challengeService } from '../../services/challengeService';
import type { UserStatsDocument } from '../../services/challengeService';

const Navigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userStats, setUserStats] = useState<UserStatsDocument | null>(null);

  // Load user stats when user is available
  useEffect(() => {
    const loadUserStats = async () => {
      if (user) {
        try {
          const stats = await challengeService.getUserStats(user.$id);
          setUserStats(stats);
        } catch (error) {
          console.error('Failed to load user stats in navigation:', error);
        }
      } else {
        setUserStats(null);
      }
    };

    loadUserStats();
  }, [user]);

  return (
    <>
      <div 
      className="bg-[var(--background-secondary)]/80 backdrop-blur-md border-b border-[var(--border-primary)] px-4 py-4 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent-purple)]/20">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-white">
                Z-Challenge
              </h1>
              <p className="text-xs text-[var(--text-secondary)] font-accent">
                Code. Compete. Conquer.
              </p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/challenges')}
              className="text-[var(--text-secondary)] hover:text-white transition-colors font-medium"
            >
              Challenges
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/achievements')}
              className="text-[var(--text-secondary)] hover:text-white transition-colors font-medium"
            >
              Achievements
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/leaderboard')}
              className="text-[var(--text-secondary)] hover:text-white transition-colors font-medium"
            >
              Leaderboard
            </motion.button>
            
            {/* Streak Display for logged-in users */}
            {user && userStats && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg"
              >
                <StreakDisplay
                  currentStreak={userStats.currentStreak || 0}
                  maxStreak={userStats.maxStreak || 0}
                  size="sm"
                />
              </motion.div>
            )}
            
            {user ? (
              <ProfileDropdown />
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-[var(--accent-purple)]/20 transition-all duration-300 font-medium"
              >
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Navigation;
