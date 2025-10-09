import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Medal, Award, Crown, Filter, Calendar, ChevronDown, Loader2, Users, Target, TrendingUp, Star
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { StarLevel } from '../components/ui';
import { cn } from '@/lib/utils';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const { leaderboard, currentUserRank, stats, loading, filters, setFilters } = useLeaderboard();
  const [showFilters, setShowFilters] = useState(false);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />;
    return <span className="text-gray-400 font-bold text-lg w-6 text-center">#{rank}</span>;
  };

  const getRandomAvatar = () => 'https://api.dicebear.com/7.x/pixel-art/svg';

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Trophy className="inline-block w-12 h-12 mb-4 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white">
            Global Leaderboard
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            Compete with developers worldwide and climb the ranks in the Arena.
          </p>
        </motion.div>

        {/* --- Stats Panel --- */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-gray-900/30 backdrop-blur-sm shadow-2xl shadow-green-500/10 mb-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { icon: Users, label: "Total Users", value: stats.totalUsers },
                { icon: Trophy, label: "Total Points", value: stats.totalPoints },
                { icon: Target, label: "Challenges Solved", value: stats.totalChallengesSolved },
                { icon: TrendingUp, label: "Submissions", value: stats.totalSubmissions },
              ].map((stat, i) => (
                <div key={stat.label} className={`p-6 text-center ${i > 0 ? 'border-l border-white/10' : ''}`}>
                  <stat.icon className="w-7 h-7 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</h3>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- Current User Rank Card --- */}
        {currentUserRank && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border-2 border-green-400/50 bg-green-500/10 p-6 mb-12 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={getRandomAvatar()} alt={user.name || user.email} className="w-12 h-12 rounded-full border-2 border-green-400"/>
                <div>
                  <h3 className="font-bold text-white text-lg">Your Current Rank</h3>
                  <p className="text-gray-300">
                    You are ranked <span className="font-bold text-white">#{currentUserRank.rank}</span> out of {currentUserRank.total.toLocaleString()} users.
                  </p>
                </div>
              </div>
              <div className="text-3xl font-bold font-mono text-green-400">
                #{currentUserRank.rank}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* --- Filters Panel --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="rounded-xl border border-white/10 bg-gray-900/40 p-6 sticky top-24 backdrop-blur-sm">
              <h3 className="font-heading text-xl font-bold text-white flex items-center mb-6">
                <Filter className="w-5 h-5 mr-3 text-green-400" />
                Filters
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3 text-sm">Timeframe</label>
                  <div className="flex flex-col space-y-2">
                    {[{ value: 'all', label: 'All Time' }, { value: 'month', label: 'This Month' }, { value: 'week', label: 'This Week' }].map(option => (
                      <button key={option.value} onClick={() => setFilters(prev => ({ ...prev, timeframe: option.value as any }))}
                        className={cn("w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          filters.timeframe === option.value ? 'bg-green-500 text-black font-semibold' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        )}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-3 text-sm">Rank By</label>
                  <div className="flex flex-col space-y-2">
                    {[{ value: 'points', label: 'Total Points' }, { value: 'challenges', label: 'Challenges Solved' }, { value: 'submissions', label: 'Submissions' }].map(option => (
                       <button key={option.value} onClick={() => setFilters(prev => ({ ...prev, category: option.value as any }))}
                        className={cn("w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          filters.category === option.value ? 'bg-green-500 text-black font-semibold' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        )}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- Leaderboard List --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="rounded-xl border border-white/10 bg-gray-900/40 backdrop-blur-sm overflow-hidden">
              <div className="p-6">
                <h2 className="font-heading text-2xl font-bold text-white">Top Performers</h2>
              </div>
              
              {loading && leaderboard.length === 0 ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-green-400 animate-spin" /></div>
              ) : (
                <div>
                  {leaderboard.map((userEntry) => (
                    <div
                      key={userEntry.$id}
                      className={cn("flex items-center justify-between p-4 border-t border-white/10 transition-colors",
                        user && userEntry.userId === user.$id ? 'bg-green-500/10' : 'hover:bg-gray-800/50'
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 text-center">{getRankIcon(userEntry.rank)}</div>
                        <img src={userEntry.profileImage || getRandomAvatar()} alt={userEntry.userName || 'User'} className="w-10 h-10 rounded-full"/>
                        <div>
                          {/* --- FIXED: Re-added the "You" tag and StarLevel component --- */}
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{userEntry.userName || `User ${userEntry.userId.slice(-4)}`}</h3>
                            {user && userEntry.userId === user.$id && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-green-500 text-black rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <StarLevel 
                            starLevel={userEntry.starLevel}
                            size="sm"
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold font-mono text-green-400">
                          {filters.category === 'points' ? userEntry.totalPoints.toLocaleString()
                           : filters.category === 'challenges' ? userEntry.solvedChallenges.length
                           : userEntry.successfulSubmissions}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">
                          {filters.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};