import { databases, account, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
import type { Models } from 'appwrite';

export interface Achievement extends Models.Document {
  userId: string;
  achievementId: string;
  achievementType: string;
  title: string;
  description: string;
  earnedAt: string;
  metadata?: string;
}

export interface AchievementStats {
  totalAchievements: number;
  achievementsByType: Record<string, number>;
  recentAchievements: Achievement[];
  nextMilestones: AchievementMilestone[];
}

export interface AchievementMilestone {
  id: string;
  title: string;
  description: string;
  type: string;
  currentProgress: number;
  targetProgress: number;
  isCompleted: boolean;
}

class AchievementService {
  /**
   * Get user achievements
   */
  async getUserAchievements(userId?: string): Promise<Achievement[]> {
    try {
      const targetUserId = userId || (await account.get()).$id;
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USER_ACHIEVEMENTS,
        [
          Query.equal('userId', targetUserId),
          Query.orderDesc('earnedAt'),
          Query.limit(100)
        ]
      );

      return response.documents as unknown as Achievement[];
    } catch (error) {
      console.error('Failed to fetch user achievements:', error);
      return [];
    }
  }

  /**
   * Get achievement statistics for a user
   */
  async getAchievementStats(userId?: string): Promise<AchievementStats> {
    try {
      const achievements = await this.getUserAchievements(userId);
      
      // Calculate achievement stats
      const achievementsByType: Record<string, number> = {};
      achievements.forEach(achievement => {
        achievementsByType[achievement.achievementType] = 
          (achievementsByType[achievement.achievementType] || 0) + 1;
      });

      // Get recent achievements (last 5)
      const recentAchievements = achievements.slice(0, 5);

      // Calculate next milestones
      const nextMilestones = await this.calculateNextMilestones(userId);

      return {
        totalAchievements: achievements.length,
        achievementsByType,
        recentAchievements,
        nextMilestones
      };
    } catch (error) {
      console.error('Failed to fetch achievement stats:', error);
      return {
        totalAchievements: 0,
        achievementsByType: {},
        recentAchievements: [],
        nextMilestones: []
      };
    }
  }

  /**
   * Calculate next milestones for the user
   */
  private async calculateNextMilestones(userId?: string): Promise<AchievementMilestone[]> {
    try {
      const targetUserId = userId || (await account.get()).$id;
      
      // Get user stats to calculate progress
      const userStatsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', targetUserId)]
      );

      if (userStatsResponse.documents.length === 0) {
        return [];
      }

      const userStats = userStatsResponse.documents[0] as any;
      const achievements = await this.getUserAchievements(userId);
      const completedAchievementIds = achievements.map(a => a.achievementId);

      const milestones: AchievementMilestone[] = [];

      // Submission milestones
      const submissionMilestones = [5, 10, 25, 50, 100, 250, 500, 1000];
      for (const milestone of submissionMilestones) {
        const id = `milestone-${milestone}`;
        if (!completedAchievementIds.includes(id)) {
          milestones.push({
            id,
            title: `${milestone} Challenges`,
            description: `Solve ${milestone} challenges`,
            type: 'milestone',
            currentProgress: userStats.successfulSubmissions || 0,
            targetProgress: milestone,
            isCompleted: false
          });
          break; // Only show next milestone
        }
      }

      // Streak milestones
      const streakMilestones = [3, 7, 14, 30, 60, 100];
      for (const streak of streakMilestones) {
        const id = `streak-${streak}`;
        if (!completedAchievementIds.includes(id)) {
          milestones.push({
            id,
            title: `${streak} Day Streak`,
            description: `Maintain a ${streak} day solving streak`,
            type: 'streak',
            currentProgress: userStats.streak || 0,
            targetProgress: streak,
            isCompleted: false
          });
          break; // Only show next streak milestone
        }
      }

      // Points milestones
      const pointsMilestones = [100, 250, 500, 1000, 2500, 5000, 10000];
      for (const points of pointsMilestones) {
        const id = `points-${points}`;
        if (!completedAchievementIds.includes(id)) {
          milestones.push({
            id,
            title: `${points} Points`,
            description: `Earn ${points} total points`,
            type: 'points',
            currentProgress: userStats.totalPoints || 0,
            targetProgress: points,
            isCompleted: false
          });
          break; // Only show next points milestone
        }
      }

      // Language-specific achievements
      if (!completedAchievementIds.includes('z-lang-pioneer')) {
        milestones.push({
          id: 'z-lang-pioneer',
          title: 'Z-- Pioneer',
          description: 'Solve your first challenge in Z-- language',
          type: 'language',
          currentProgress: 0,
          targetProgress: 1,
          isCompleted: false
        });
      }

      return milestones.slice(0, 6); // Return top 6 milestones
    } catch (error) {
      console.error('Failed to calculate next milestones:', error);
      return [];
    }
  }

  /**
   * Get achievement types with their counts
   */
  async getAchievementTypes(): Promise<Record<string, { count: number; label: string; icon: string }>> {
    try {
      const user = await account.get();
      const achievements = await this.getUserAchievements(user.$id);

      const types: Record<string, { count: number; label: string; icon: string }> = {
        milestone: { count: 0, label: 'Milestones', icon: '🏆' },
        streak: { count: 0, label: 'Streaks', icon: '🔥' },
        language: { count: 0, label: 'Languages', icon: '💻' },
        special: { count: 0, label: 'Special', icon: '⭐' },
        difficulty: { count: 0, label: 'Difficulty', icon: '🎯' }
      };

      achievements.forEach(achievement => {
        if (types[achievement.achievementType]) {
          types[achievement.achievementType].count++;
        }
      });

      return types;
    } catch (error) {
      console.error('Failed to fetch achievement types:', error);
      return {};
    }
  }

  /**
   * Check if user has specific achievement
   */
  async hasAchievement(achievementId: string, userId?: string): Promise<boolean> {
    try {
      const achievements = await this.getUserAchievements(userId);
      return achievements.some(achievement => achievement.achievementId === achievementId);
    } catch (error) {
      console.error('Failed to check achievement:', error);
      return false;
    }
  }

  /**
   * Get achievement progress for display
   */
  getAchievementIcon(achievementType: string): string {
    const icons: Record<string, string> = {
      milestone: '🏆',
      streak: '🔥',
      language: '💻',
      special: '⭐',
      difficulty: '🎯',
      first: '🎉',
      perfect: '💎'
    };
    return icons[achievementType] || '🏅';
  }

  /**
   * Format achievement date
   */
  formatAchievementDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  }
}

export const achievementService = new AchievementService();