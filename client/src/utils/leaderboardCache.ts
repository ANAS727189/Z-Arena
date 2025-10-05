// Leaderboard cache utility
export class LeaderboardCache {
  private static CACHE_KEY = 'z-challenger-leaderboard';
  private static USER_RANK_CACHE_KEY = 'z-challenger-user-rank';
  private static STATS_CACHE_KEY = 'z-challenger-leaderboard-stats';
  private static CACHE_TIMESTAMP_KEY = 'z-challenger-leaderboard-timestamp';
  private static CACHE_DURATION = 1 * 60 * 1000; // 1 minute for leaderboard (more dynamic data)

  static isCacheValid(): boolean {
    const timestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const cacheTime = parseInt(timestamp);
    const now = Date.now();
    return (now - cacheTime) < this.CACHE_DURATION;
  }

  static getCachedLeaderboard(filters: any): { 
    leaderboard: any[] | null; 
    userRank: any | null; 
    stats: any | null;
  } {
    if (!this.isCacheValid()) return { leaderboard: null, userRank: null, stats: null };
    
    const filterKey = JSON.stringify(filters);
    const cacheKey = `${this.CACHE_KEY}-${filterKey}`;
    const userRankCacheKey = `${this.USER_RANK_CACHE_KEY}-${filterKey}`;
    const statsCacheKey = `${this.STATS_CACHE_KEY}-${filterKey}`;
    
    const cachedLeaderboard = localStorage.getItem(cacheKey);
    const cachedUserRank = localStorage.getItem(userRankCacheKey);
    const cachedStats = localStorage.getItem(statsCacheKey);
    
    try {
      return {
        leaderboard: cachedLeaderboard ? JSON.parse(cachedLeaderboard) : null,
        userRank: cachedUserRank ? JSON.parse(cachedUserRank) : null,
        stats: cachedStats ? JSON.parse(cachedStats) : null
      };
    } catch (error) {
      console.warn('Failed to parse cached leaderboard:', error);
      return { leaderboard: null, userRank: null, stats: null };
    }
  }

  static setCachedLeaderboard(
    filters: any, 
    leaderboard: any[], 
    userRank: any, 
    stats: any
  ): void {
    try {
      const filterKey = JSON.stringify(filters);
      const cacheKey = `${this.CACHE_KEY}-${filterKey}`;
      const userRankCacheKey = `${this.USER_RANK_CACHE_KEY}-${filterKey}`;
      const statsCacheKey = `${this.STATS_CACHE_KEY}-${filterKey}`;
      
      localStorage.setItem(cacheKey, JSON.stringify(leaderboard));
      localStorage.setItem(userRankCacheKey, JSON.stringify(userRank));
      localStorage.setItem(statsCacheKey, JSON.stringify(stats));
      localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.warn('Failed to cache leaderboard:', error);
    }
  }

  static clearCache(): void {
    // Clear all leaderboard cache entries
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_KEY) || 
          key.startsWith(this.USER_RANK_CACHE_KEY) || 
          key.startsWith(this.STATS_CACHE_KEY)) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
  }
}