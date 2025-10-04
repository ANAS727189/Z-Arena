import { account, databases } from '../lib/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTIONS = {
  USERS: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
};

export interface UserPreferences {
  profilePicture?: string;
  theme?: 'dark' | 'light';
  language?: string;
  notifications?: {
    challenges: boolean;
    leaderboard: boolean;
    achievements: boolean;
  };
}

class UserService {
  /**
   * Ensure user stats document exists
   * @param userId - User ID
   * @param user - User object with email, name, etc.
   * @returns Promise<void>
   */
  private async ensureUserStatsExist(userId: string, user: any): Promise<void> {
    try {
      // Check if user stats already exist
      const existingStats = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', userId)]
      );

      if (existingStats.documents.length === 0) {
        // Create initial user stats
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          'unique()',
          {
            userId,
            totalSubmissions: 0,
            successfulSubmissions: 0,
            totalPoints: 0,
            solvedChallenges: [],
            preferredLanguages: [],
            rank: 0,
            level: 'beginner',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            globalRank: 0,
            weeklyRank: 0,
            monthlyRank: 0,
            weeklyPoints: 0,
            monthlyPoints: 0,
            lastActive: new Date().toISOString(),
            streak: 0,
            bestStreak: 0,
            avgSolveTime: 0,
            country: 'India',
            profilePicture: (user.prefs as any)?.profilePicture || null,
            isPublic: true,
            starPoints: 0,
            currentStars: 1,
            starTitle: 'Noob',
            easyChallengesSolved: 0,
            mediumChallengesSolved: 0,
            hardChallengesSolved: 0,
            achievements: [],
            badgesEarned: [],
            nextStarRequirement: 5,
          }
        );
        console.log('Created initial user stats for user:', userId);
      }
    } catch (error) {
      // If it's a duplicate document error, that's fine - it means stats already exist
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('User stats already exist for user:', userId);
        return;
      }
      console.error('Failed to ensure user stats exist:', error);
    }
  }

  /**
   * Update user stats with profile information
   * @param userId - User ID
   * @param updates - Fields to update
   * @returns Promise<void>
   */
  private async updateUserStatsProfile(userId: string, updates: any): Promise<void> {
    try {
      const existingStats = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', userId)]
      );

      if (existingStats.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          existingStats.documents[0].$id,
          {
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error('Failed to update user stats profile:', error);
    }
  }

  /**
   * Update user preferences
   * @param preferences - The preferences to update
   * @returns Promise<UserPreferences>
   */
  updatePreferences = async (preferences: Partial<{
    profilePicture: string;
    preferredLanguages: string[];
    theme: string;
  }>) => {
    try {
      const user = await account.get();
      if (!user) throw new Error('User not authenticated');

      // Update Appwrite user preferences
      await account.updatePrefs({
        ...user.prefs,
        ...preferences,
      });

      // Update user stats document if it exists
      try {
        const userStats = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.equal('userId', user.$id)]
        );

        if (userStats.documents.length > 0) {
          const updates: any = {};
          if (preferences.profilePicture) {
            updates.profilePicture = preferences.profilePicture;
          }
          if (preferences.preferredLanguages) {
            updates.preferredLanguages = preferences.preferredLanguages;
          }

          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            userStats.documents[0].$id,
            updates
          );
        }
      } catch (error) {
        console.warn('Failed to update user stats document:', error);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return { success: false, error };
    }
  };

  /**
   * Get current user preferences
   * @returns Promise<UserPreferences>
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const user = await account.get();
      return (user.prefs as UserPreferences) || {};
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      throw error;
    }
  }

  /**
   * Update profile image
   * @param imageUrl - The new profile image URL
   * @returns Promise<void>
   */
  async updateProfileImage(imageUrl: string): Promise<void> {
    try {
      await this.updatePreferences({ profilePicture: imageUrl });
    } catch (error) {
      console.error('Failed to update profile image:', error);
      throw error;
    }
  }

  /**
   * Remove profile image (set back to default)
   * @returns Promise<void>
   */
  async removeProfileImage(): Promise<void> {
    try {
      await this.updatePreferences({ profilePicture: undefined });
    } catch (error) {
      console.error('Failed to remove profile image:', error);
      throw error;
    }
  }

  /**
   * Initialize user stats if they don't exist
   * Call this when user visits profile/leaderboard for the first time
   * @returns Promise<void>
   */
  async initializeUserStats(): Promise<void> {
    try {
      const user = await account.get();
      await this.ensureUserStatsExist(user.$id, user);
    } catch (error) {
      console.error('Failed to initialize user stats:', error);
      throw error;
    }
  }

  /**
   * Update user name in both preferences and stats
   * @param name - New user name
   * @returns Promise<void>
   */
  async updateUserName(name: string): Promise<void> {
    try {
      const user = await account.get();
      
      // Update name in account
      await account.updateName(name);
      
      // Ensure user stats exist
      await this.ensureUserStatsExist(user.$id, user);
      
      // Update name in user stats
      await this.updateUserStatsProfile(user.$id, { userName: name });
    } catch (error) {
      console.error('Failed to update user name:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
