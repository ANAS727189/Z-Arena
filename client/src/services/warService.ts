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

    // Create new queue entry
    const queueEntry = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_QUEUE,
      'unique()',
      {
        userId,
        eloRating,
        preferredLanguages: preferredLanguages,
        status: 'waiting',
        queuedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        region: 'global'
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
   * Remove a user from the queue (alias for leaveQueue)
   */
  static async removeFromQueue(userId: string): Promise<void> {
    return this.leaveQueue(userId);
  }

  /**
   * Find a match for a player
   */
  static async findMatch(userId: string, userElo: number): Promise<WarQueue | null> {
    const waitTime = 0; // You can calculate actual wait time
    const eloRange = ELOCalculator.getMatchingRange(userElo, waitTime);

    console.log(`Finding match for user ${userId} with ELO ${userElo}, range: ${eloRange.min}-${eloRange.max}`);

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

    console.log(`Found ${potentialOpponents.documents.length} potential opponents:`, potentialOpponents.documents);

    return (potentialOpponents.documents[0] as unknown as WarQueue) || null;
  }

  /**
   * Create a war match between two players
   */
  static async createMatch(
    player1UserId: string,
    player1Elo: number,
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
        player1Id: player1UserId,
        player2Id: player2.userId,
        status: 'active',
        challenges: challenges.map((c: Challenge) => c.id), // Use c.id instead of c.$id
        startTime: new Date().toISOString(),
        player1FinalScore: 0,
        player2FinalScore: 0,
        player1EloChange: 0,
        player2EloChange: 0,
        player1EloBefore: player1Elo,
        player2EloBefore: player2.eloRating,
        timeLimit: 300000, // 5 minutes
        region: 'global',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    // Find and update player1's queue status
    const player1Queue = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WAR_QUEUE,
      [
        Query.equal('userId', player1UserId),
        Query.equal('status', 'waiting')
      ]
    );

    // Update queue status to matched
    if (player1Queue.documents.length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.WAR_QUEUE,
        player1Queue.documents[0].$id,
        { status: 'matched' }
      );
    }

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
    try {
      // Use challengeService to get properly formatted challenges
      const { challengeService } = await import('./challengeService');
      const challenges = await challengeService.getChallenges({
        limit: 100 // Get more than needed to randomize
      });

      if (challenges.length === 0) {
        throw new Error('No active challenges found for war match');
      }

      // Shuffle and select the required count
      const shuffled = challenges.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      if (selected.length < count) {
        console.warn(`Only found ${selected.length} challenges, needed ${count}`);
      }

      return selected;
    } catch (error) {
      console.error('Error selecting random challenges:', error);
      throw new Error('Failed to select challenges for war match');
    }
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
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    return attempt as unknown as WarChallengeAttempt;
  }

  /**
   * Submit a challenge attempt for battle room (simplified version)
   */
  static async submitBattleAttempt(attemptData: {
    matchId: string;
    userId: string;
    challengeId: string;
    challengeIndex: number;
    completedAt: Date;
    isCorrect: boolean;
    code?: string;
    language?: string;
  }): Promise<WarChallengeAttempt> {
    const attempt = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_CHALLENGE_ATTEMPTS,
      'unique()',
      {
        matchId: attemptData.matchId,
        userId: attemptData.userId,
        challengeId: attemptData.challengeId,
        challengeIndex: attemptData.challengeIndex,
        status: attemptData.isCorrect ? 'completed' : 'failed',
        score: attemptData.isCorrect ? 100 : 0,
        submittedAt: attemptData.completedAt.toISOString(),
        code: attemptData.code || '',
        language: attemptData.language || 'javascript',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    return attempt as unknown as WarChallengeAttempt;
  }

  /**
   * Get real-time match data
   */
  static async getMatchData(matchId: string): Promise<WarMatch> {
    const match = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_MATCHES,
      matchId
    );

    return match as unknown as WarMatch;
  }

  /**
   * Get opponent progress in a match
   */
  static async getOpponentProgress(matchId: string, opponentId: string): Promise<any> {
    const attempts = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WAR_CHALLENGE_ATTEMPTS,
      [
        Query.equal('matchId', matchId),
        Query.equal('userId', opponentId),
        Query.orderDesc('submittedAt')
      ]
    );

    if (attempts.documents.length === 0) {
      return {
        challengesCompleted: 0,
        currentChallenge: 0,
        lastActivity: null,
        isOnline: false
      };
    }

    const latestAttempt = attempts.documents[0] as any;
    const completedChallenges = attempts.documents.filter((attempt: any) => 
      attempt.status === 'completed'
    ).length;

    return {
      challengesCompleted: completedChallenges,
      currentChallenge: latestAttempt.challengeIndex || 0,
      lastActivity: new Date(latestAttempt.submittedAt),
      isOnline: new Date().getTime() - new Date(latestAttempt.submittedAt).getTime() < 60000 // Online if active within last minute
    };
  }

  /**
   * Update match status
   */
  static async updateMatchStatus(
    matchId: string, 
    status: 'active' | 'completed' | 'cancelled',
    winnerId?: string
  ): Promise<WarMatch> {
    const updateData: any = { status };
    
    if (winnerId) {
      updateData.winnerId = winnerId;
      updateData.completedAt = new Date().toISOString();
    }

    const match = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_MATCHES,
      matchId,
      updateData
    );

    return match as unknown as WarMatch;
  }

  /**
   * Get current user's queue status
   */
  static async getMyQueueStatus(userId: string): Promise<WarQueue | null> {
    try {
      const queueDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WAR_QUEUE,
        [
          Query.equal('userId', userId),
          Query.limit(1)
        ]
      );

      return queueDocs.documents.length > 0 
        ? (queueDocs.documents[0] as unknown as WarQueue)
        : null;
    } catch (error) {
      console.error('Error getting queue status:', error);
      return null;
    }
  }

  /**
   * Find user's active match
   */
  static async findMyActiveMatch(userId: string): Promise<WarMatch | null> {
    try {
      const matchDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WAR_MATCHES,
        [
          Query.or([
            Query.equal('player1Id', userId),
            Query.equal('player2Id', userId)
          ]),
          Query.equal('status', 'active'),
          Query.limit(1)
        ]
      );

      return matchDocs.documents.length > 0 
        ? (matchDocs.documents[0] as unknown as WarMatch)
        : null;
    } catch (error) {
      console.error('Error finding active match:', error);
      return null;
    }
  }

  /**
   * Complete a war match and calculate ELO changes
   */
  static async completeMatch(matchId: string, winnerId?: string, winnerScore?: number, loserScore?: number): Promise<WarMatch> {
    console.log('WarService.completeMatch called with:', { matchId, winnerId, winnerScore, loserScore });
    
    // Get the match document
    const match = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_MATCHES,
      matchId
    ) as unknown as WarMatch;
    
    console.log('Retrieved match:', match);

    // Check if match is already completed to prevent duplicate processing
    if (match.status === 'completed') {
      console.log('Match already completed, skipping...');
      return match;
    }

    // Atomically update status to prevent duplicate processing
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.WAR_MATCHES,
        matchId,
        { status: 'completed', endTime: new Date().toISOString() }
      );
      console.log('Successfully marked match as completed');
      
      // Add a small delay to ensure database consistency across replicas
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (updateError) {
      // If update fails, another process might have already completed it
      console.log('Failed to mark as completed, checking status:', updateError);
      const updatedMatch = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.WAR_MATCHES,
        matchId
      ) as unknown as WarMatch;
      
      if (updatedMatch.status === 'completed') {
        console.log('Match already completed by another process, skipping...');
        return updatedMatch;
      }
      throw updateError;
    }

    // Calculate final scores and challenge counts
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

    // Calculate actual challenges completed (not score-based)
    const player1ChallengesCompleted = player1Attempts.documents.filter(attempt => attempt.status === 'completed').length;
    const player2ChallengesCompleted = player2Attempts.documents.filter(attempt => attempt.status === 'completed').length;
    
    // Use scores for ELO calculation but challenges completed for winner determination
    const player1FinalScore = player1Attempts.documents.reduce((sum, attempt) => sum + attempt.score, 0);
    const player2FinalScore = player2Attempts.documents.reduce((sum, attempt) => sum + attempt.score, 0);
    
    console.log('📊 Match completion scores:', {
      player1: { challenges: player1ChallengesCompleted, score: player1FinalScore },
      player2: { challenges: player2ChallengesCompleted, score: player2FinalScore }
    });

    // Determine winner and calculate ELO
    let player1Result = 0.5; // Default to draw
    let finalWinnerId = winnerId; // Use provided winnerId or calculate from scores

    if (!finalWinnerId) {
      // Use challenges completed for winner determination (more accurate than score)
      if (player1ChallengesCompleted > player2ChallengesCompleted) {
        player1Result = 1; // Player 1 wins
        finalWinnerId = match.player1Id;
      } else if (player2ChallengesCompleted > player1ChallengesCompleted) {
        player1Result = 0; // Player 1 loses
        finalWinnerId = match.player2Id;
      }
      // else: challenges completed are equal, player1Result remains 0.5 (draw), finalWinnerId remains undefined
    } else {
      // Use provided winner - if undefined it means draw
      if (finalWinnerId === match.player1Id) {
        player1Result = 1;
      } else if (finalWinnerId === match.player2Id) {
        player1Result = 0;
      } else {
        // winnerId is defined but not matching either player (shouldn't happen, but handle gracefully)
        player1Result = 0.5;
        finalWinnerId = undefined;
      }
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

    // Update match with final results (status already set to completed earlier)
    const updatedMatch = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.WAR_MATCHES,
      matchId,
      {
        winnerId: finalWinnerId,
        player1FinalScore,
        player2FinalScore,
        player1EloChange: eloResults.player1.change,
        player2EloChange: eloResults.player2.change
      }
    );

    console.log('✅ Match updated to completed status successfully');

    // Update user stats
    console.log('Updating user stats for players:', { player1Id: match.player1Id, player2Id: match.player2Id });
    await this.updateUserWarStats(match.player1Id, player1Result, eloResults.player1);
    await this.updateUserWarStats(match.player2Id, 1 - player1Result, eloResults.player2);

    // Create match history entries with correct challenge counts
    console.log('Creating match history entries');
    await this.createMatchHistoryEntry(match, match.player1Id, match.player2Id, player1Result, player1FinalScore, player2FinalScore, eloResults.player1, player1ChallengesCompleted);
    await this.createMatchHistoryEntry(match, match.player2Id, match.player1Id, 1 - player1Result, player2FinalScore, player1FinalScore, eloResults.player2, player2ChallengesCompleted);

    // Clean up queue entries for both players
    console.log('Cleaning up queue entries for both players');
    try {
      await this.removeFromQueue(match.player1Id);
      await this.removeFromQueue(match.player2Id);
    } catch (error) {
      console.error('Failed to clean up queue entries:', error);
    }

    console.log('Match completion successful:', updatedMatch);
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
    eloResult: { newRating: number; change: number },
    userChallengesCompleted: number
  ): Promise<void> {
    const resultString = result === 1 ? 'win' : result === 0.5 ? 'draw' : 'loss';
    
    // Use a shorter, predictable ID to prevent duplicates (max 36 chars)
    const shortMatchId = match.$id.substring(0, 16); // Use document ID instead of matchId
    const shortUserId = userId.substring(0, 16);
    const historyId = `${shortMatchId}_${shortUserId}`;
    
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.WAR_MATCH_HISTORY,
        historyId,
        {
          matchId: match.matchId,
          userId,
          opponentId,
          result: resultString,
          userScore,
          opponentScore,
          userEloBefore: userId === match.player1Id ? match.player1EloBefore : match.player2EloBefore,
          userEloAfter: eloResult.newRating,
          eloChange: eloResult.change,
          opponentEloBefore: opponentId === match.player1Id ? match.player1EloBefore : match.player2EloBefore,
          challengesSolved: userChallengesCompleted, // Use actual challenge count instead of score/20
          totalChallenges: match.challenges.length,
          matchDuration: match.endTime ? 
            new Date(match.endTime).getTime() - new Date(match.startTime).getTime() : 
            300000, // Default 5 minutes
          averageTime: match.endTime ? 
            (new Date(match.endTime).getTime() - new Date(match.startTime).getTime()) / match.challenges.length :
            60000, // Default 1 minute per challenge
          matchDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
    } catch (error: any) {
      // If document already exists, skip (prevents duplicates)
      if (error.code === 409 || error.message?.includes('Document with the requested ID already exists')) {
        console.log(`Match history entry already exists for user ${userId}, skipping...`);
        return;
      }
      throw error;
    }
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
   * Get user's match statistics
   */
  static async getUserMatchStats(userId: string): Promise<{ 
    totalGames: number; 
    wins: number; 
    losses: number; 
    draws: number;
    winRate: number;
    currentStreak: number;
  }> {
    try {
      // Get user stats from users collection
      const userDocs = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', userId)]
      );

      if (userDocs.documents.length === 0) {
        return { totalGames: 0, wins: 0, losses: 0, draws: 0, winRate: 0, currentStreak: 0 };
      }

      const user = userDocs.documents[0];
      const totalGames = user.warGamesPlayed || 0;
      const wins = user.warWins || 0;
      const losses = user.warLosses || 0;
      const draws = user.warDraws || 0;
      const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
      const currentStreak = user.warStreak || 0;

      console.log('User match stats:', { totalGames, wins, losses, draws, winRate, currentStreak });
      
      return { totalGames, wins, losses, draws, winRate, currentStreak };
    } catch (error) {
      console.error('Error getting user match stats:', error);
      return { totalGames: 0, wins: 0, losses: 0, draws: 0, winRate: 0, currentStreak: 0 };
    }
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