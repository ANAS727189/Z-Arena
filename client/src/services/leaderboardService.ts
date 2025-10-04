import { databases, account } from '../lib/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTIONS = {
  USERS: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  CHALLENGES: import.meta.env.VITE_APPWRITE_CHALLENGES_COLLECTION_ID,
  STAR_LEVELS: import.meta.env.VITE_APPWRITE_STARS_LEVELS_COLLECTION_ID,
  USER_ACHIEVEMENTS: import.meta.env.VITE_APPWRITE_ACHIEVEMENTS_COLLECTION_ID,
  LEADERBOARD: import.meta.env.VITE_APPWRITE_LEADERBOARD_COLLECTION_ID,
  USER_RANKINGS: import.meta.env.VITE_APPWRITE_USER_RANKINGS_COLLECTION_ID,
};

// Database collection interfaces
export interface StarLevel {
  $id: string;
  starLevel: number;
  title: string;
  pointsRequired: number;
  color: string;
  icon: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface UserRanking {
  $id: string;
  userId: string;
  rankingType: string;
  rank: number;
  points: number;
  starPoints: number;
  challengesSolved: number;
  currentStreak: number;
  period: string;
  createdAt: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface Achievement {
  $id: string;
  userId: string;
  achievementId: string;
  achievementType: string;
  title: string;
  description: string;
  earnedAt: string;
  metadata?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface LeaderboardCache {
  $id: string;
  type: string;
  filter?: string;
  data: string; // JSON string of leaderboard data
  lastUpdated: string;
  expiresAt: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface LeaderboardUser {
  $id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  profileImage?: string;
  totalPoints: number;
  successfulSubmissions: number;
  totalSubmissions: number;
  solvedChallenges: string[];
  rank: number;
  starLevel: StarLevel;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardFilters {
  timeframe: 'all' | 'week' | 'month';
  category: 'points' | 'submissions' | 'challenges';
}

export interface UserStatsDocument {
  $id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  profileImage?: string;
  totalSubmissions: number;
  successfulSubmissions: number;
  totalPoints: number;
  solvedChallenges: string[];
  createdAt: string;
  updatedAt: string;
}

class LeaderboardService {
  private starLevels: StarLevel[] = [];
  private starLevelsLoaded = false;

  /**
   * Load star levels from database
   */
  private async loadStarLevels(): Promise<void> {
    if (this.starLevelsLoaded) return;

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STAR_LEVELS,
        [Query.orderAsc('starLevel')]
      );

      this.starLevels = response.documents as unknown as StarLevel[];
      this.starLevelsLoaded = true;
    } catch (error) {
      console.error('Failed to load star levels:', error);
      // Fallback to default star levels
      this.starLevels = [
        {
          $id: '1',
          starLevel: 0,
          title: 'Noob',
          pointsRequired: 0,
          color: '#6B7280',
          icon: '⭐',
          $createdAt: '',
          $updatedAt: '',
        },
        {
          $id: '2',
          starLevel: 2,
          title: 'Pookie',
          pointsRequired: 5,
          color: '#F59E0B',
          icon: '⭐⭐',
          $createdAt: '',
          $updatedAt: '',
        },
        {
          $id: '3',
          starLevel: 3,
          title: 'Rookie',
          pointsRequired: 15,
          color: '#10B981',
          icon: '⭐⭐⭐',
          $createdAt: '',
          $updatedAt: '',
        },
        {
          $id: '4',
          starLevel: 5,
          title: 'Expert',
          pointsRequired: 25,
          color: '#3B82F6',
          icon: '⭐⭐⭐⭐⭐',
          $createdAt: '',
          $updatedAt: '',
        },
        {
          $id: '5',
          starLevel: 7,
          title: 'ZMaster',
          pointsRequired: 30,
          color: '#8B5CF6',
          icon: '⭐⭐⭐⭐⭐⭐⭐',
          $createdAt: '',
          $updatedAt: '',
        },
      ];
      this.starLevelsLoaded = true;
    }
  }

  /**
   * Get star level based on points
   */
  private async getStarLevel(points: number): Promise<StarLevel> {
    await this.loadStarLevels();
    
    // Find the highest star level the user qualifies for
    let currentLevel = this.starLevels[0]; // Default to lowest level
    
    for (const level of this.starLevels) {
      if (points >= level.pointsRequired) {
        currentLevel = level;
      } else {
        break;
      }
    }
    
    return currentLevel;
  }



  /**
   * Get leaderboard data
   */
  async getLeaderboard(filters: LeaderboardFilters = { timeframe: 'all', category: 'points' }): Promise<LeaderboardUser[]> {
    try {
      // Try to get cached data first
      const cacheKey = `${filters.timeframe}_${filters.category}`;
      const cachedData = await this.getCachedLeaderboard('leaderboard', cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      let queries: string[] = [];

      // Add time-based filtering
      if (filters.timeframe !== 'all') {
        const now = new Date();
        let startDate: Date;

        if (filters.timeframe === 'week') {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (filters.timeframe === 'month') {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else {
          startDate = new Date(0); // All time
        }

        queries.push(Query.greaterThanEqual('updatedAt', startDate.toISOString()));
      }

      // Order by the selected category
      let orderBy: string;
      switch (filters.category) {
        case 'submissions':
          orderBy = 'successfulSubmissions';
          break;
        case 'challenges':
          orderBy = 'solvedChallenges';
          break;
        default:
          orderBy = 'totalPoints';
      }

      queries.push(Query.orderDesc(orderBy));
      queries.push(Query.limit(100)); // Limit to top 100

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        queries
      );

      const leaderboardData: LeaderboardUser[] = [];

      // Load star levels first
      await this.loadStarLevels();

      for (let i = 0; i < response.documents.length; i++) {
        const doc = response.documents[i] as unknown as UserStatsDocument;
        
        // Use stored user data or fallback to generated data
        const userName = doc.userName || `Challenger ${doc.userId.slice(-8).toUpperCase()}`;
        const userEmail = doc.userEmail || 'challenger@example.com';
        const profileImage = doc.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.userId.slice(-8)}`;
        
        const starLevel = await this.getStarLevel(doc.totalPoints);
        
        const leaderboardUser: LeaderboardUser = {
          $id: doc.$id,
          userId: doc.userId,
          userName,
          userEmail,
          profileImage,
          totalPoints: doc.totalPoints,
          successfulSubmissions: doc.successfulSubmissions,
          totalSubmissions: doc.totalSubmissions,
          solvedChallenges: doc.solvedChallenges,
          rank: i + 1,
          starLevel,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };

        leaderboardData.push(leaderboardUser);
      }

      // Cache the result
      await this.cacheLeaderboard('leaderboard', leaderboardData, cacheKey, 5);

      return leaderboardData;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get current user's rank
   */
  async getCurrentUserRank(filters: LeaderboardFilters = { timeframe: 'all', category: 'points' }): Promise<{ rank: number; total: number } | null> {
    try {
      const user = await account.get();
      const leaderboard = await this.getLeaderboard(filters);
      
      const userRank = leaderboard.find(entry => entry.userId === user.$id);
      
      if (userRank) {
        return {
          rank: userRank.rank,
          total: leaderboard.length,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get user rank:', error);
      return null;
    }
  }

  /**
   * Get user stats
   */
  async getUserStats(userId?: string): Promise<UserStatsDocument | null> {
    try {
      const targetUserId = userId || (await account.get()).$id;
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', targetUserId)]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as UserStatsDocument;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      return null;
    }
  }

  /**
   * Get or create user ranking
   */
  async getUserRanking(userId: string, period: string = 'all'): Promise<UserRanking | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USER_RANKINGS,
        [
          Query.equal('userId', userId),
          Query.equal('period', period)
        ]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as UserRanking;
      }

      return null;
    } catch (error) {
      console.error('Failed to get user ranking:', error);
      return null;
    }
  }

  /**
   * Update user ranking
   */
  async updateUserRanking(
    userId: string, 
    points: number, 
    challengesSolved: number,
    period: string = 'all'
  ): Promise<void> {
    try {
      const userStats = await this.getUserStats(userId);
      if (!userStats) return;

      const starLevel = await this.getStarLevel(points);
      
      const existingRanking = await this.getUserRanking(userId, period);
      
      if (existingRanking) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USER_RANKINGS,
          existingRanking.$id,
          {
            rankingType: 'points',
            points,
            starPoints: starLevel.pointsRequired,
            challengesSolved,
            currentStreak: 0, // This would need proper streak calculation
          }
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.USER_RANKINGS,
          'unique()',
          {
            userId,
            rankingType: 'points',
            rank: 0, // Will be calculated in batch update
            points,
            starPoints: starLevel.pointsRequired,
            challengesSolved,
            currentStreak: 0,
            period,
            createdAt: new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error('Failed to update user ranking:', error);
    }
  }

  /**
   * Get achievements for user
   */
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USER_ACHIEVEMENTS,
        [
          Query.equal('userId', userId),
          Query.orderDesc('earnedAt')
        ]
      );

      return response.documents as unknown as Achievement[];
    } catch (error) {
      console.error('Failed to get user achievements:', error);
      return [];
    }
  }

  /**
   * Award achievement to user
   */
  async awardAchievement(
    userId: string,
    achievementId: string,
    achievementType: string,
    title: string,
    description: string,
    metadata?: any
  ): Promise<void> {
    try {
      // Check if user already has this achievement
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USER_ACHIEVEMENTS,
        [
          Query.equal('userId', userId),
          Query.equal('achievementId', achievementId)
        ]
      );

      if (existing.documents.length === 0) {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.USER_ACHIEVEMENTS,
          'unique()',
          {
            userId,
            achievementId,
            achievementType,
            title,
            description,
            earnedAt: new Date().toISOString(),
            metadata: metadata ? JSON.stringify(metadata) : null,
          }
        );
      }
    } catch (error) {
      console.error('Failed to award achievement:', error);
    }
  }

  /**
   * Get cached leaderboard data
   */
  async getCachedLeaderboard(type: string, filter?: string): Promise<any> {
    try {
      const queries = [Query.equal('type', type)];
      if (filter) {
        queries.push(Query.equal('filter', filter));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.LEADERBOARD,
        queries
      );

      if (response.documents.length > 0) {
        const cache = response.documents[0] as unknown as LeaderboardCache;
        const now = new Date();
        const expiresAt = new Date(cache.expiresAt);

        if (now < expiresAt) {
          return JSON.parse(cache.data);
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get cached leaderboard:', error);
      return null;
    }
  }

  /**
   * Cache leaderboard data
   */
  async cacheLeaderboard(type: string, data: any, filter?: string, ttlMinutes: number = 5): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes);

      const queries = [Query.equal('type', type)];
      if (filter) {
        queries.push(Query.equal('filter', filter));
      }

      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.LEADERBOARD,
        queries
      );

      const cacheData = {
        type,
        filter: filter || null,
        data: JSON.stringify(data),
        lastUpdated: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      };

      if (existing.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.LEADERBOARD,
          existing.documents[0].$id,
          cacheData
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.LEADERBOARD,
          'unique()',
          cacheData
        );
      }
    } catch (error) {
      console.error('Failed to cache leaderboard:', error);
    }
  }

  /**
   * Get leaderboard summary stats
   */
  async getLeaderboardStats() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.limit(1000)]
      );

      const totalUsers = response.documents.length;
      const totalPoints = response.documents.reduce((sum, doc: any) => sum + (doc.totalPoints || 0), 0);
      const totalSubmissions = response.documents.reduce((sum, doc: any) => sum + (doc.totalSubmissions || 0), 0);
      const totalChallengesSolved = response.documents.reduce((sum, doc: any) => sum + (doc.solvedChallenges?.length || 0), 0);

      // Star distribution
      await this.loadStarLevels();
      const starDistribution: Record<string, number> = {};
      
      // Initialize distribution with actual star level titles
      this.starLevels.forEach(level => {
        starDistribution[level.title] = 0;
      });

      for (const doc of response.documents) {
        const starLevel = await this.getStarLevel(doc.totalPoints || 0);
        starDistribution[starLevel.title]++;
      }

      return {
        totalUsers,
        totalPoints,
        totalSubmissions,
        totalChallengesSolved,
        starDistribution,
      };
    } catch (error) {
      console.error('Failed to fetch leaderboard stats:', error);
      throw error;
    }
  }
}

export const leaderboardService = new LeaderboardService();