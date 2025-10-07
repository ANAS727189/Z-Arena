import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
import { ELOCalculator } from '@/utils/eloCalculator';
import type { 
  WarMatch, 
  WarQueue, 
  WarLeaderboard, 
  WarMatchHistory, 
  WarChallengeAttempt,
  Challenge 
} from '@/types';

export class WarService {
  /**
   * Join the war queue for matchmaking
   */
  static async joinQueue(
    userId: string, 
    eloRating: number, 
    preferredLanguages: string[]
  ): Promise<WarQueue> {
    // Remove any existing queue entries for this user
    await this.leaveQueue(userId);

    const queueEntry = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_QUEUE,
      'unique()',
      {
        userId,
        eloRating,
        queuedAt: new Date().toISOString(),
        status: 'waiting',
        preferredLanguages,
        region: 'global',
        maxWaitTime: 120000, // 2 minutes
        expandedRange: 200,
      }
    );

    return queueEntry as unknown as WarQueue;
  }

  /**
   * Leave the war queue
   */
  static async leaveQueue(userId: string): Promise<void> {
    const existingQueue = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WAR_QUEUE,
      [Query.equal('userId', userId)]
    );

    for (const entry of existingQueue.documents) {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.WAR_QUEUE,
        entry.$id
      );
    }
  }

  /**
   * Find a match for a player
   */
  static async findMatch(userId: string, userElo: number): Promise<WarQueue | null> {
    const waitTime = 0; // You can calculate actual wait time
    const eloRange = ELOCalculator.getMatchingRange(userElo, waitTime);

    const potentialOpponents = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WAR_QUEUE,
      [
        Query.notEqual('userId', userId),
        Query.between('eloRating', eloRange.min, eloRange.max),
        Query.equal('status', 'waiting'),
        Query.orderAsc('queuedAt') // FIFO matching
      ]
    );

    return (potentialOpponents.documents[0] as unknown as WarQueue) || null;
  }

  /**
   * Create a war match between two players
   */
  static async createMatch(
    player1: WarQueue, 
    player2: WarQueue
  ): Promise<WarMatch> {
    // Select 5 random challenges
    const challenges = await this.selectRandomChallenges(5);
    
    const match = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_MATCHES,
      'unique()',
      {
        matchId: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        player1Id: player1.userId,
        player2Id: player2.userId,
        status: 'active',
        challenges: challenges.map((c: any, index) => ({
          challengeId: c.$id,
          challengeIndex: index,
          player1Score: 0,
          player2Score: 0,
          player1Time: 0,
          player2Time: 0,
          player1Status: 'pending',
          player2Status: 'pending'
        })),
        startTime: new Date().toISOString(),
        player1FinalScore: 0,
        player2FinalScore: 0,
        player1EloChange: 0,
        player2EloChange: 0,
        player1EloBefore: player1.eloRating,
        player2EloBefore: player2.eloRating,
        timeLimit: 300000, // 5 minutes
        region: 'global'
      }
    );

    // Update queue status to matched
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_QUEUE,
      player1.$id,
      { status: 'matched' }
    );

    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_QUEUE,
      player2.$id,
      { status: 'matched' }
    );

    return match as unknown as WarMatch;
  }

  /**
   * Select random challenges for war match
   */
  private static async selectRandomChallenges(count: number): Promise<Challenge[]> {
    // Get all active challenges
    const allChallenges = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CHALLENGES,
      [
        Query.equal('isActive', true),
        Query.limit(100) // Get more than needed to randomize
      ]
    );

    // Shuffle and select the required count
    const shuffled = allChallenges.documents.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count) as unknown as Challenge[];
  }

  /**
   * Submit code for a war challenge
   */
  static async submitChallengeAttempt(
    matchId: string,
    userId: string,
    challengeId: string,
    challengeIndex: number,
    code: string,
    language: string
  ): Promise<WarChallengeAttempt> {
    const attempt = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_CHALLENGE_ATTEMPTS,
      'unique()',
      {
        matchId,
        userId,
        challengeId,
        challengeIndex,
        code,
        language,
        status: 'submitted',
        score: 0, // Will be updated after evaluation
        runtime: 0,
        submittedAt: new Date().toISOString(),
        timeSpent: 0,
        attempts: 1
      }
    );

    return attempt as unknown as WarChallengeAttempt;
  }

  /**
   * Complete a war match and calculate ELO changes
   */
  static async completeMatch(matchId: string): Promise<WarMatch> {
    const match = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_MATCHES,
      matchId
    ) as unknown as WarMatch;

    // Calculate final scores (sum of all challenge scores)
    const player1Attempts = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WAR_CHALLENGE_ATTEMPTS,
      [
        Query.equal('matchId', matchId),
        Query.equal('userId', match.player1Id)
      ]
    );

    const player2Attempts = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WAR_CHALLENGE_ATTEMPTS,
      [
        Query.equal('matchId', matchId),
        Query.equal('userId', match.player2Id)
      ]
    );

    const player1FinalScore = player1Attempts.documents.reduce((sum, attempt) => sum + attempt.score, 0);
    const player2FinalScore = player2Attempts.documents.reduce((sum, attempt) => sum + attempt.score, 0);

    // Determine winner and calculate ELO
    let player1Result = 0.5; // Default to draw
    let winnerId = undefined;

    if (player1FinalScore > player2FinalScore) {
      player1Result = 1; // Player 1 wins
      winnerId = match.player1Id;
    } else if (player2FinalScore > player1FinalScore) {
      player1Result = 0; // Player 1 loses
      winnerId = match.player2Id;
    }

    // Get current user stats for games played
    const player1Stats = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal('userId', match.player1Id)]
    );

    const player2Stats = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal('userId', match.player2Id)]
    );

    const player1Games = player1Stats.documents[0]?.warGamesPlayed || 0;
    const player2Games = player2Stats.documents[0]?.warGamesPlayed || 0;

    // Calculate ELO changes
    const eloResults = ELOCalculator.calculateMatchResults(
      match.player1EloBefore,
      match.player2EloBefore,
      player1Result,
      player1Games,
      player2Games
    );

    // Update match with results
    const updatedMatch = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_MATCHES,
      matchId,
      {
        status: 'completed',
        endTime: new Date().toISOString(),
        winnerId,
        player1FinalScore,
        player2FinalScore,
        player1EloChange: eloResults.player1.change,
        player2EloChange: eloResults.player2.change
      }
    );

    // Update user stats
    await this.updateUserWarStats(match.player1Id, player1Result, eloResults.player1);
    await this.updateUserWarStats(match.player2Id, 1 - player1Result, eloResults.player2);

    // Create match history entries
    await this.createMatchHistoryEntry(match, match.player1Id, match.player2Id, player1Result, player1FinalScore, player2FinalScore, eloResults.player1);
    await this.createMatchHistoryEntry(match, match.player2Id, match.player1Id, 1 - player1Result, player2FinalScore, player1FinalScore, eloResults.player2);

    return updatedMatch as unknown as WarMatch;
  }

  /**
   * Update user war statistics
   */
  private static async updateUserWarStats(
    userId: string, 
    result: number, 
    eloResult: { newRating: number; change: number }
  ): Promise<void> {
    const userDocs = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal('userId', userId)]
    );

    if (userDocs.documents.length === 0) return;

    const user = userDocs.documents[0];
    const isWin = result === 1;
    const isDraw = result === 0.5;

    const updates: any = {
      eloRating: eloResult.newRating,
      warGamesPlayed: (user.warGamesPlayed || 0) + 1,
      warLastMatchAt: new Date().toISOString(),
      isWarActive: false
    };

    if (isWin) {
      updates.warWins = (user.warWins || 0) + 1;
      updates.warStreak = (user.warStreak || 0) + 1;
      updates.bestWarStreak = Math.max(user.bestWarStreak || 0, updates.warStreak);
    } else if (isDraw) {
      updates.warDraws = (user.warDraws || 0) + 1;
      updates.warStreak = 0;
    } else {
      updates.warLosses = (user.warLosses || 0) + 1;
      updates.warStreak = 0;
    }

    // Update provisional status
    if (updates.warGamesPlayed >= 20) {
      updates.provisionalRating = false;
    }

    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      user.$id,
      updates
    );
  }

  /**
   * Create match history entry
   */
  private static async createMatchHistoryEntry(
    match: WarMatch,
    userId: string,
    opponentId: string,
    result: number,
    userScore: number,
    opponentScore: number,
    eloResult: { newRating: number; change: number }
  ): Promise<void> {
    const resultString = result === 1 ? 'win' : result === 0.5 ? 'draw' : 'loss';
    
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_MATCH_HISTORY,
      'unique()',
      {
        matchId: match.matchId,
        userId,
        opponentId,
        result: resultString,
        userScore,
        opponentScore,
        userEloBefore: result === 1 ? match.player1EloBefore : match.player2EloBefore,
        userEloAfter: eloResult.newRating,
        eloChange: eloResult.change,
        opponentEloBefore: result === 1 ? match.player2EloBefore : match.player1EloBefore,
        challengesSolved: Math.floor(userScore / 20), // Assuming 20 points per challenge
        totalChallenges: 5,
        matchDuration: match.endTime ? 
          new Date(match.endTime).getTime() - new Date(match.startTime).getTime() : 
          300000, // Default 5 minutes
        averageTime: 60000, // Default 1 minute per challenge
        matchDate: new Date().toISOString()
      }
    );
  }

  /**
   * Get war leaderboard
   */
  static async getWarLeaderboard(limit: number = 100): Promise<WarLeaderboard[]> {
    const leaderboard = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WAR_LEADERBOARD,
      [
        Query.orderDesc('eloRating'),
        Query.orderDesc('warWins'),
        Query.limit(limit)
      ]
    );

    return leaderboard.documents as unknown as WarLeaderboard[];
  }

  /**
   * Get user's war match history
   */
  static async getUserMatchHistory(userId: string, limit: number = 50): Promise<WarMatchHistory[]> {
    const history = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WAR_MATCH_HISTORY,
      [
        Query.equal('userId', userId),
        Query.orderDesc('matchDate'),
        Query.limit(limit)
      ]
    );

    return history.documents as unknown as WarMatchHistory[];
  }

  /**
   * Get active match for user
   */
  static async getActiveMatch(userId: string): Promise<WarMatch | null> {
    const matches = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WAR_MATCHES,
      [
        Query.equal('status', 'active'),
        Query.or([
          Query.equal('player1Id', userId),
          Query.equal('player2Id', userId)
        ])
      ]
    );

    return (matches.documents[0] as unknown as WarMatch) || null;
  }
}