import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Target, Calendar, TrendingUp, Star } from 'lucide-react';
import { useAchievements } from '../hooks/useAchievements';
import { achievementService } from '../services/achievementService';



const AchievementsPage: React.FC = () => {
  const { achievements, stats, loading, error } = useAchievements();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--accent-purple)] mx-auto"></div>
          <p className="text-[var(--text-secondary)] mt-4">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            <Trophy className="inline-block w-10 h-10 mr-3 text-yellow-500" />
            Achievements
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Track your progress and celebrate your coding milestones
          </p>
        </motion.div>

        {/* Achievement Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.totalAchievements}</h3>
              <p className="text-[var(--text-secondary)] text-sm">Total Achievements</p>
            </div>
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.achievementsByType.milestone || 0}</h3>
              <p className="text-[var(--text-secondary)] text-sm">Milestones</p>
            </div>
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.achievementsByType.streak || 0}</h3>
              <p className="text-[var(--text-secondary)] text-sm">Streaks</p>
            </div>
            <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.achievementsByType.special || 0}</h3>
              <p className="text-[var(--text-secondary)] text-sm">Special</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Achievements */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Award className="w-6 h-6 mr-2 text-yellow-500" />
                Your Achievements
              </h2>
              
              {achievements.length === 0 ? (
                <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-8 text-center">
                  <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Achievements Yet</h3>
                  <p className="text-[var(--text-secondary)]">
                    Start solving challenges to earn your first achievements!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.$id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">
                            {achievementService.getAchievementIcon(achievement.achievementType)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {achievement.title}
                            </h3>
                            <p className="text-[var(--text-secondary)] text-sm">
                              {achievement.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="px-2 py-1 bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] rounded-full text-xs font-medium">
                                {achievement.achievementType}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-[var(--text-secondary)] text-sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            {achievementService.formatAchievementDate(achievement.earnedAt)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Next Milestones */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-blue-400" />
                Next Milestones
              </h2>
              
              {stats?.nextMilestones && stats.nextMilestones.length > 0 ? (
                <div className="space-y-4">
                  {stats.nextMilestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white text-sm">
                          {milestone.title}
                        </h3>
                        <span className="text-[var(--text-secondary)] text-xs">
                          {milestone.currentProgress}/{milestone.targetProgress}
                        </span>
                      </div>
                      <p className="text-[var(--text-secondary)] text-xs mb-3">
                        {milestone.description}
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-blue)] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((milestone.currentProgress / milestone.targetProgress) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
                  <Target className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-[var(--text-secondary)] text-sm">
                    Complete more challenges to unlock milestones!
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
export { AchievementsPage };