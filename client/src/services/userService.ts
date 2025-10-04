import { account } from '../lib/appwrite';

export interface UserPreferences {
  profileImage?: string;
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
   * Update user preferences
   * @param preferences - The preferences to update
   * @returns Promise<UserPreferences>
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      // Get current preferences
      const user = await account.get();
      const currentPrefs = (user.prefs as UserPreferences) || {};

      // Merge with new preferences
      const updatedPrefs = {
        ...currentPrefs,
        ...preferences,
      };

      // Update in Appwrite
      await account.updatePrefs(updatedPrefs);

      return updatedPrefs;
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      throw error;
    }
  }

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
      await this.updatePreferences({ profileImage: imageUrl });
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
      await this.updatePreferences({ profileImage: undefined });
    } catch (error) {
      console.error('Failed to remove profile image:', error);
      throw error;
    }
  }
}

export const userService = new UserService();