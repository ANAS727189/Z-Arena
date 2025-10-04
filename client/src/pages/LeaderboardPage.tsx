import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  Users, 
  Target, 
  TrendingUp,
  Crown,
  Filter,
  Calendar,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { StarLevel } from '../components/ui';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    leaderboard,
    currentUserRank,
    stats,
    loading,
    filters,
    setFilters
  } = useLeaderboard();
  const [showFilters, setShowFilters] = useState(false);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="text-[var(--text-secondary)] font-bold">#{rank}</span>;
    }
  };

  const getRandomAvatar = () => {
    const avatars = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };



  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-4xl font-bold text-white mb-2">
            Leaderboard
          </h1>
          <p className="text-[var(--text-secondary)]">
            Compete with developers worldwide and climb the ranks
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-[var(--accent-purple)] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
              <p className="text-[var(--text-secondary)] text-sm">Total Users</p>
            </div>
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.totalPoints}</h3>
              <p className="text-[var(--text-secondary)] text-sm">Total Points</p>
            </div>
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <Target className="w-8 h-8 text-[var(--accent-cyan)] mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.totalChallengesSolved}</h3>
              <p className="text-[var(--text-secondary)] text-sm">Challenges Solved</p>
            </div>
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.totalSubmissions}</h3>
              <p className="text-[var(--text-secondary)] text-sm">Total Submissions</p>
            </div>
          </motion.div>
        )}

        {/* Current User Rank */}
        {currentUserRank && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-[var(--accent-purple)]/10 to-[var(--accent-cyan)]/10 border border-[var(--accent-purple)]/30 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={getRandomAvatar()}
                  alt={user.name || user.email}
                  className="w-12 h-12 rounded-full border-2 border-[var(--accent-purple)]"
                />
                <div>
                  <h3 className="font-bold text-white">Your Rank</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    #{currentUserRank.rank} out of {currentUserRank.total} users
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getRankIcon(currentUserRank.rank)}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 sticky top-24">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full mb-4 lg:hidden"
              >
                <h3 className="font-heading text-xl font-bold text-white flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                <ChevronDown 
                  className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${
                    showFilters ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Timeframe Filter */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Timeframe
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Time' },
                      { value: 'month', label: 'This Month' },
                      { value: 'week', label: 'This Week' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="timeframe"
                          value={option.value}
                          checked={filters.timeframe === option.value}
                          onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value as any }))}
                          className="mr-2 accent-[var(--accent-purple)]"
                        />
                        <span className="text-[var(--text-secondary)]">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    <Trophy className="w-4 h-4 inline mr-2" />
                    Rank By
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'points', label: 'Total Points' },
                      { value: 'challenges', label: 'Challenges Solved' },
                      { value: 'submissions', label: 'Successful Submissions' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={option.value}
                          checked={filters.category === option.value}
                          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
                          className="mr-2 accent-[var(--accent-purple)]"
                        />
                        <span className="text-[var(--text-secondary)]">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Star Distribution */}
                {stats && (
                  <div>
                    <h3 className="text-white font-medium mb-3">
                      <Star className="w-4 h-4 inline mr-2" />
                      Star Distribution
                    </h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(stats.starDistribution).map(([level, count]) => (
                        <div key={level} className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">{level}</span>
                          <span className="text-white font-medium">{String(count)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Leaderboard List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-[var(--border-primary)]">
                <h2 className="font-heading text-2xl font-bold text-white">
                  Top Performers
                </h2>
                <p className="text-[var(--text-secondary)] mt-1">
                  {filters.timeframe === 'all' ? 'All time' : filters.timeframe === 'week' ? 'This week' : 'This month'} • 
                  Sorted by {filters.category === 'points' ? 'total points' : filters.category === 'challenges' ? 'challenges solved' : 'successful submissions'}
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-[var(--accent-purple)] animate-spin" />
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-primary)]">
                  {leaderboard.map((userEntry, index) => (
                    <motion.div
                      key={userEntry.$id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`p-6 hover:bg-[var(--background-primary)]/50 transition-colors ${
                        user && userEntry.userId === user.$id ? 'bg-[var(--accent-purple)]/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12">
                            {getRankIcon(userEntry.rank)}
                          </div>
                          
                          <img
                            src={userEntry.profileImage || getRandomAvatar()}
                            alt={userEntry.userName || 'User'}
                            className="w-12 h-12 rounded-full border-2 border-[var(--border-primary)]"
                          />
                          
                          <div>
                            <h3 className="font-bold text-white">
                              {userEntry.userName || `User ${userEntry.userId.slice(-4)}`}
                              {user && userEntry.userId === user.$id && (
                                <span className="ml-2 text-xs bg-[var(--accent-purple)] text-white px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </h3>
                            <StarLevel 
                              starLevel={userEntry.starLevel}
                              size="md"
                              showIcon={true}
                            />
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {filters.category === 'points' && userEntry.totalPoints}
                            {filters.category === 'challenges' && userEntry.solvedChallenges.length}
                            {filters.category === 'submissions' && userEntry.successfulSubmissions}
                          </div>
                          <div className="text-sm text-[var(--text-secondary)]">
                            {filters.category === 'points' && 'points'}
                            {filters.category === 'challenges' && 'solved'}
                            {filters.category === 'submissions' && 'submissions'}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)] mt-1">
                            {userEntry.solvedChallenges.length} challenges • {userEntry.successfulSubmissions}/{userEntry.totalSubmissions} success rate
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {!loading && leaderboard.length === 0 && (
                <div className="text-center py-20">
                  <Trophy className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Data Yet</h3>
                  <p className="text-[var(--text-secondary)]">
                    Be the first to solve challenges and appear on the leaderboard!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
