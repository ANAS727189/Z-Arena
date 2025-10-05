import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { AuthModal } from '../AuthModal';
import { ProfileDropdown } from '../ui/ProfileDropdown';

const Navigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
