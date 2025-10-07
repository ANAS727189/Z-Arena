/**
 * ELO Rating System Calculator
 * Pure numerical ELO ratings without category names
 */

export interface ELOResult {
  newRating: number;
  change: number;
  expectedScore: number;
}

export class ELOCalculator {
  // Minimum and maximum ELO ratings
  static readonly MIN_RATING = 400;
  static readonly MAX_RATING = 3000;
  
  // Default starting rating
  static readonly DEFAULT_RATING = 800;

  /**
   * Calculate new ELO rating after a match
   * @param playerRating Current player's ELO rating
   * @param opponentRating Opponent's ELO rating
   * @param result Match result (1 = win, 0.5 = draw, 0 = loss)
   * @param gamesPlayed Number of games played by the player
   * @returns ELO calculation result
   */
  static calculateELO(
    playerRating: number, 
    opponentRating: number, 
    result: number, 
    gamesPlayed: number = 0
  ): ELOResult {
    const kFactor = this.getKFactor(gamesPlayed, playerRating);
    const expectedScore = this.calculateExpectedScore(playerRating, opponentRating);
    
    const ratingChange = Math.round(kFactor * (result - expectedScore));
    const newRating = Math.max(
      this.MIN_RATING, 
      Math.min(this.MAX_RATING, playerRating + ratingChange)
    );

    return {
      newRating,
      change: newRating - playerRating,
      expectedScore
    };
  }

  /**
   * Calculate expected score based on rating difference
   * @param playerRating Player's current rating
   * @param opponentRating Opponent's current rating
   * @returns Expected score (0-1)
   */
  private static calculateExpectedScore(playerRating: number, opponentRating: number): number {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  }

  /**
   * Get K-factor based on games played and current rating
   * @param gamesPlayed Number of games played
   * @param currentRating Current ELO rating
   * @returns K-factor for rating calculation
   */
  private static getKFactor(gamesPlayed: number, currentRating: number): number {
    // Provisional period - higher K-factor for first 20 games
    if (gamesPlayed < 20) return 40;
    
    // Different K-factors based on rating
    if (currentRating < 1200) return 32; // Lower rated players
    if (currentRating < 1800) return 24; // Mid-range players
    return 16; // High rated players
  }

  /**
   * Calculate both players' new ratings after a match
   * @param player1Rating Player 1's current rating
   * @param player2Rating Player 2's current rating
   * @param player1Result Player 1's result (1 = win, 0.5 = draw, 0 = loss)
   * @param player1Games Player 1's games played
   * @param player2Games Player 2's games played
   * @returns Both players' new ratings and changes
   */
  static calculateMatchResults(
    player1Rating: number,
    player2Rating: number,
    player1Result: number,
    player1Games: number = 0,
    player2Games: number = 0
  ): {
    player1: ELOResult;
    player2: ELOResult;
  } {
    const player2Result = 1 - player1Result; // If player1 wins (1), player2 loses (0)
    
    return {
      player1: this.calculateELO(player1Rating, player2Rating, player1Result, player1Games),
      player2: this.calculateELO(player2Rating, player1Rating, player2Result, player2Games)
    };
  }

  /**
   * Get color code for ELO rating display
   * @param rating ELO rating
   * @returns Hex color code
   */
  static getRatingColor(rating: number): string {
    if (rating < 800) return '#6B7280'; // Gray
    if (rating < 1000) return '#8B5CF6'; // Purple
    if (rating < 1200) return '#10B981'; // Green
    if (rating < 1400) return '#F59E0B'; // Orange
    if (rating < 1600) return '#EF4444'; // Red
    if (rating < 1800) return '#8B5CF6'; // Purple
    if (rating < 2000) return '#EC4899'; // Pink
    return '#FFD700'; // Gold
  }

  /**
   * Get matching range for ELO-based matchmaking
   * @param rating Player's ELO rating
   * @param waitTime How long player has been waiting (in seconds)
   * @returns Min and max rating range for matching
   */
  static getMatchingRange(rating: number, waitTime: number = 0): { min: number; max: number } {
    const baseRange = 200; // ±200 ELO initially
    const expandedRange = baseRange + (waitTime * 2); // Expand by 2 every second
    
    return {
      min: Math.max(this.MIN_RATING, rating - expandedRange),
      max: Math.min(this.MAX_RATING, rating + expandedRange)
    };
  }

  /**
   * Format ELO rating for display
   * @param rating ELO rating number
   * @returns Formatted string
   */
  static formatRating(rating: number): string {
    return Math.round(rating).toString();
  }

  /**
   * Check if player is in provisional period
   * @param gamesPlayed Number of games played
   * @returns True if in provisional period
   */
  static isProvisional(gamesPlayed: number): boolean {
    return gamesPlayed < 20;
  }
}