import { Code2, LogOut } from 'lucide-react';
import type { Models } from 'appwrite';

interface NavigationProps {
  user: Models.User<Models.Preferences> | null;
  onNavigateHome: () => void;
  onNavigateChallenges: () => void;
  onNavigateLeaderboard: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  user,
  onNavigateHome,
  onNavigateChallenges,
  onNavigateLeaderboard,
  onSignIn,
  onSignOut,
}) => {
  return (
    <nav className="bg-[var(--background-secondary)] border-b border-[var(--border-primary)] px-4 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateHome}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-lg font-bold text-white">
              Z-Challenge
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={onNavigateChallenges}
            className="text-white font-medium"
          >
            Challenges
          </button>
          <button
            onClick={onNavigateLeaderboard}
            className="text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Leaderboard
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user.name}</span>
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
