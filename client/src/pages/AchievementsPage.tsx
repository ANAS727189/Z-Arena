import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Star, Medal } from 'lucide-react';
import { useAchievements } from '../hooks/useAchievements';
import { achievementService } from '../services/achievementService';

const AchievementsPage: React.FC = () => {
  const { achievements, stats, loading, error } = useAchievements();

  if (loading && achievements.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Trophy className="inline-block w-12 h-12 mb-4 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white">
            Your Achievements
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            Track your progress and celebrate your coding milestones in the Arena.
          </p>
        </motion.div>

        {/* --- Achievement Stats Panel --- */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-gray-900/30 backdrop-blur-sm shadow-2xl shadow-green-500/10 mb-16"
          >
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { icon: Trophy, label: "Total Earned", value: stats.totalAchievements, color: 'text-green-400'},
                { icon: Target, label: "Milestones", value: stats.achievementsByType.milestone || 0, color: 'text-blue-400' },
                { icon: TrendingUp, label: "Streaks", value: stats.achievementsByType.streak || 0, color: 'text-yellow-400' },
                { icon: Star, label: "Special", value: stats.achievementsByType.special || 0, color: 'text-purple-400' },
              ].map((stat, i) => (
                <div key={stat.label} className={`p-6 text-center ${i > 0 ? 'border-l border-white/10' : ''}`}>
                  <stat.icon className={`w-7 h-7 ${stat.color} mx-auto mb-3`} />
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Your Achievements List --- */}
          <div className="lg:col-span-2 space-y-4">
            {achievements.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 bg-gray-900/30 p-12 text-center backdrop-blur-sm">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Achievements Yet</h3>
                <p className="text-gray-500">Start solving challenges to earn your first awards!</p>
              </div>
            ) : (
              <>
               <h2 className="text-2xl font-bold text-white flex items-center">
              <Medal className="w-6 h-6 mr-3 text-blue-400" />
              Recent Achievements
            </h2>
               {achievements.map((achievement, index) => (
                 <motion.div
                   key={achievement.$id}
                   className="group rounded-xl border border-white/10 bg-gray-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-green-400/60 hover:bg-gray-900/60"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-3xl">
                      {achievementService.getAchievementIcon(achievement.achievementType)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                      <p className="text-gray-400 text-sm">{achievement.description}</p>
                    </div>
                    <div className="text-right text-gray-500 text-xs">
                      <p>{achievementService.formatAchievementDate(achievement.earnedAt)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
             </>
            )}
          </div>

          {/* --- Next Milestones Sidebar --- */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-400" />
              Next Milestones
            </h2>
            {stats?.nextMilestones && stats.nextMilestones.length > 0 ? (
              <div className="space-y-4">
                {stats.nextMilestones.map((milestone) => (
                  <div key={milestone.id} className="rounded-xl border border-white/10 bg-gray-900/40 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm">{milestone.title}</h3>
                      <span className="text-gray-400 text-xs font-mono">
                        {milestone.currentProgress}/{milestone.targetProgress}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mb-3">{milestone.description}</p>
                    <div className="w-full bg-black/30 rounded-full h-2.5 border border-white/10">
                      <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((milestone.currentProgress / milestone.targetProgress) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-gray-900/30 p-12 text-center backdrop-blur-sm">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">All current milestones achieved!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { AchievementsPage };