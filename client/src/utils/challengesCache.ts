// Challenges cache utility
export class ChallengesCache {
  private static CACHE_KEY = 'z-challenger-challenges';
  private static CACHE_TIMESTAMP_KEY = 'z-challenger-challenges-timestamp';
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static isCacheValid(): boolean {
    const timestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const cacheTime = parseInt(timestamp);
    const now = Date.now();
    return (now - cacheTime) < this.CACHE_DURATION;
  }

  static getCachedChallenges(): any[] | null {
    if (!this.isCacheValid()) return null;
    
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (!cached) return null;
    
    try {
      return JSON.parse(cached);
    } catch (error) {
      console.warn('Failed to parse cached challenges:', error);
      return null;
    }
  }

  static setCachedChallenges(challenges: any[]): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(challenges));
      localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.warn('Failed to cache challenges:', error);
    }
  }

  static clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
  }
}