// Achievements cache utility
export class AchievementsCache {
  private static CACHE_KEY = 'z-challenger-achievements';
  private static STATS_CACHE_KEY = 'z-challenger-achievement-stats';
  private static CACHE_TIMESTAMP_KEY = 'z-challenger-achievements-timestamp';
  private static CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for achievements

  static isCacheValid(): boolean {
    const timestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const cacheTime = parseInt(timestamp);
    const now = Date.now();
    return (now - cacheTime) < this.CACHE_DURATION;
  }

  static getCachedAchievements(userId: string): { achievements: any[] | null; stats: any | null } {
    if (!this.isCacheValid()) return { achievements: null, stats: null };
    
    const cacheKey = `${this.CACHE_KEY}-${userId}`;
    const statsCacheKey = `${this.STATS_CACHE_KEY}-${userId}`;
    
    const cachedAchievements = localStorage.getItem(cacheKey);
    const cachedStats = localStorage.getItem(statsCacheKey);
    
    try {
      return {
        achievements: cachedAchievements ? JSON.parse(cachedAchievements) : null,
        stats: cachedStats ? JSON.parse(cachedStats) : null
      };
    } catch (error) {
      console.warn('Failed to parse cached achievements:', error);
      return { achievements: null, stats: null };
    }
  }

  static setCachedAchievements(userId: string, achievements: any[], stats: any): void {
    try {
      const cacheKey = `${this.CACHE_KEY}-${userId}`;
      const statsCacheKey = `${this.STATS_CACHE_KEY}-${userId}`;
      
      localStorage.setItem(cacheKey, JSON.stringify(achievements));
      localStorage.setItem(statsCacheKey, JSON.stringify(stats));
      localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.warn('Failed to cache achievements:', error);
    }
  }

  static clearCache(userId?: string): void {
    if (userId) {
      const cacheKey = `${this.CACHE_KEY}-${userId}`;
      const statsCacheKey = `${this.STATS_CACHE_KEY}-${userId}`;
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(statsCacheKey);
    }
    localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
  }
}