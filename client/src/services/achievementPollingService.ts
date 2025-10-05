import { achievementService } from './achievementService';
import type { Achievement } from './achievementService';

class AchievementPollingService {
  private pollInterval: number = 30000; // 30 seconds
  private isPolling: boolean = false;
  private intervalId: number | null = null;
  private lastAchievementCount: number = 0;
  private onNewAchievement?: (achievement: Achievement) => void;

  /**
   * Start polling for new achievements
   */
  startPolling(onNewAchievement?: (achievement: Achievement) => void) {
    if (this.isPolling) return;

    this.onNewAchievement = onNewAchievement;
    this.isPolling = true;

    // Initial load to set baseline
    this.checkForNewAchievements();

    this.intervalId = setInterval(() => {
      this.checkForNewAchievements();
    }, this.pollInterval);

    console.log('🏆 Achievement polling started');
  }

  /**
   * Stop polling for achievements
   */
  stopPolling() {
    if (!this.isPolling) return;

    this.isPolling = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('🏆 Achievement polling stopped');
  }

  /**
   * Check for new achievements
   */
  private async checkForNewAchievements() {
    try {
      const achievements = await achievementService.getUserAchievements();
      
      // If this is the first check, just set the baseline
      if (this.lastAchievementCount === 0) {
        this.lastAchievementCount = achievements.length;
        return;
      }

      // Check if we have new achievements
      if (achievements.length > this.lastAchievementCount) {
        const newAchievements = achievements.slice(0, achievements.length - this.lastAchievementCount);
        
        // Notify about new achievements
        newAchievements.forEach(achievement => {
          if (this.onNewAchievement) {
            this.onNewAchievement(achievement);
          }
        });

        this.lastAchievementCount = achievements.length;
      }
    } catch (error) {
      console.error('Failed to check for new achievements:', error);
    }
  }

  /**
   * Force check for achievements (useful after submission)
   */
  forceCheck() {
    if (this.isPolling) {
      this.checkForNewAchievements();
    }
  }

  /**
   * Update polling interval
   */
  setPollInterval(interval: number) {
    this.pollInterval = interval;
    
    if (this.isPolling) {
      this.stopPolling();
      this.startPolling(this.onNewAchievement);
    }
  }
}

export const achievementPollingService = new AchievementPollingService();