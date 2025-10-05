import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProfileDropdownProps {
  className?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const profileImageUrl = (user.prefs as any)?.profileImage || null;
  const userName = user.name || user.email;
  const userEmail = user.email;

  // Generate a random avatar if no profile image
  const getRandomAvatar = () => {
    const seed = user.$id || user.email;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=transparent`;
  };

  const handleViewProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl bg-[var(--background-secondary)]/60 hover:bg-[var(--background-secondary)] transition-all duration-200 border border-[var(--border-primary)]/30 hover:border-[var(--border-primary)]"
      >
        {/* Profile Image */}
        <div className="relative">
          <img
            src={profileImageUrl || getRandomAvatar()}
            alt={userName}
            className="w-8 h-8 rounded-full border-2 border-[var(--accent-purple)]/30 object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--background-primary)]"></div>
        </div>

        {/* User Info */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white truncate max-w-24">
            {userName}
          </p>
          <p className="text-xs text-[var(--text-secondary)] truncate max-w-24">
            {userEmail}
          </p>
        </div>

        {/* Dropdown Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-[var(--border-primary)]/30 bg-gradient-to-r from-[var(--accent-purple)]/10 to-[var(--accent-cyan)]/10">
              <div className="flex items-center space-x-3">
                <img
                  src={profileImageUrl || getRandomAvatar()}
                  alt={userName}
                  className="w-12 h-12 rounded-full border-2 border-[var(--accent-purple)]/50 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <motion.button
                whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                onClick={handleViewProfile}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[var(--accent-purple)]/10 transition-colors"
              >
                <User className="w-4 h-4 text-white" />
                <span className="text-sm text-white">View Profile</span>
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                onClick={() => {
                  navigate('/settings');
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-white text-left hover:bg-[var(--accent-purple)]/10 transition-colors"
              >
                <Settings className="w-4 h-4 text-white" />
                <span className="text-sm text-white">Settings</span>
              </motion.button>

              <div className="my-1 border-t border-[var(--border-primary)]/30"></div>

              <motion.button
                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">Sign Out</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
