import { Client, Databases, Query } from 'node-appwrite';

// Appwrite configuration
const client = new Client()
  .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = '68debe350002d7856a53';
const COLLECTIONS = {
  USERS: 'users',
  USER_RANKINGS: 'user_rankings',
  LEADERBOARD: 'leaderboard',
  STARS: 'stars',
  WAR_LEADERBOARD: 'war_leaderboard'
};

/**
 * Main function to update leaderboards and rankings
 */
export default async ({ req, res, log, error }) => {
  try {
    log('🏆 Starting leaderboard update process...');

    const startTime = Date.now();
    
    // Update global rankings
    const globalStats = await updateGlobalRankings(log);
    
    // Update weekly rankings
    const weeklyStats = await updateWeeklyRankings(log);
    
    // Update monthly rankings
    const monthlyStats = await updateMonthlyRankings(log);
    
    // Update star levels
    const starStats = await updateStarLevels(log);
    
    // Generate and cache leaderboard data
    const leaderboardStats = await updateLeaderboardCache(log);
    
    // Update war leaderboard
    const warLeaderboardStats = await updateWarLeaderboard(log);

    const executionTime = Date.now() - startTime;

    const result = {
      success: true,
      message: 'Leaderboard update completed',
      executionTime: `${executionTime}ms`,
      statistics: {
        global: globalStats,
        weekly: weeklyStats,
        monthly: monthlyStats,
        stars: starStats,
        leaderboard: leaderboardStats,
        warLeaderboard: warLeaderboardStats
      },
      timestamp: new Date().toISOString()
    };

    log('✅ Leaderboard update completed:', result);

    return res.json(result);

  } catch (updateError) {
    error('❌ Leaderboard update failed:', updateError);
    
    return res.json({
      success: false,
      error: updateError.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
};

/**
 * Update global rankings based on total points
 */
async function updateGlobalRankings(log) {
  try {
    log('🌍 Updating global rankings...');

    // Get all users ordered by total points
    const users = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [
        Query.orderDesc('totalPoints'),
        Query.orderDesc('successfulSubmissions'),
        Query.orderAsc('createdAt'),
        Query.limit(1000) // Process top 1000 users
      ]
    );

    let updateCount = 0;
    const batchSize = 50;

    // Update rankings in batches
    for (let i = 0; i < users.documents.length; i += batchSize) {
      const batch = users.documents.slice(i, i + batchSize);
      
      const updatePromises = batch.map(async (user, batchIndex) => {
        const globalRank = i + batchIndex + 1;
        
        if (user.globalRank !== globalRank) {
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            user.$id,
            {
              globalRank,
              rank: globalRank, // Legacy field
              updatedAt: new Date().toISOString()
            }
          );
          updateCount++;
        }
      });

      await Promise.all(updatePromises);
    }

    log(`📊 Updated ${updateCount} global rankings`);
    
    return {
      totalUsers: users.documents.length,
      updatedRankings: updateCount
    };

  } catch (err) {
    throw new Error(`Failed to update global rankings: ${err.message}`);
  }
}

/**
 * Update weekly rankings based on weekly points
 */
async function updateWeeklyRankings(log) {
  try {
    log('📅 Updating weekly rankings...');

    // Get users with weekly points > 0
    const users = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [
        Query.greaterThan('weeklyPoints', 0),
        Query.orderDesc('weeklyPoints'),
        Query.orderDesc('totalPoints'),
        Query.limit(500)
      ]
    );

    let updateCount = 0;
    
    for (let i = 0; i < users.documents.length; i++) {
      const user = users.documents[i];
      const weeklyRank = i + 1;
      
      if (user.weeklyRank !== weeklyRank) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.$id,
          {
            weeklyRank,
            updatedAt: new Date().toISOString()
          }
        );
        updateCount++;
      }
    }

    // Create historical ranking snapshot
    await createRankingSnapshot('weekly', users.documents.slice(0, 100), log);

    log(`📊 Updated ${updateCount} weekly rankings`);
    
    return {
      activeUsers: users.documents.length,
      updatedRankings: updateCount
    };

  } catch (err) {
    throw new Error(`Failed to update weekly rankings: ${err.message}`);
  }
}

/**
 * Update monthly rankings based on monthly points
 */
async function updateMonthlyRankings(log) {
  try {
    log('📆 Updating monthly rankings...');

    const users = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [
        Query.greaterThan('monthlyPoints', 0),
        Query.orderDesc('monthlyPoints'),
        Query.orderDesc('totalPoints'),
        Query.limit(500)
      ]
    );

    let updateCount = 0;
    
    for (let i = 0; i < users.documents.length; i++) {
      const user = users.documents[i];
      const monthlyRank = i + 1;
      
      if (user.monthlyRank !== monthlyRank) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.$id,
          {
            monthlyRank,
            updatedAt: new Date().toISOString()
          }
        );
        updateCount++;
      }
    }

    // Create historical ranking snapshot
    await createRankingSnapshot('monthly', users.documents.slice(0, 100), log);

    log(`📊 Updated ${updateCount} monthly rankings`);
    
    return {
      activeUsers: users.documents.length,
      updatedRankings: updateCount
    };

  } catch (err) {
    throw new Error(`Failed to update monthly rankings: ${err.message}`);
  }
}

/**
 * Update star levels for all users
 */
async function updateStarLevels(log) {
  try {
    log('⭐ Updating star levels...');

    // Get star level definitions
    const starLevels = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.STARS,
      [Query.orderAsc('starLevel')]
    );

    if (starLevels.documents.length === 0) {
      // Create default star levels if none exist
      await createDefaultStarLevels(log);
      return { message: 'Created default star levels' };
    }

    // Get users that might need star level updates
    const users = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [
        Query.greaterThan('starPoints', 0),
        Query.limit(1000)
      ]
    );

    let updateCount = 0;

    for (const user of users.documents) {
      const newStarLevel = calculateStarLevel(user.starPoints, starLevels.documents);
      const starLevelDoc = starLevels.documents.find(s => s.starLevel === newStarLevel);
      
      if (user.currentStars !== newStarLevel) {
        const nextStarLevel = starLevels.documents.find(s => s.starLevel === newStarLevel + 1);
        
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.$id,
          {
            currentStars: newStarLevel,
            starTitle: starLevelDoc?.title || 'Noob',
            nextStarRequirement: nextStarLevel?.pointsRequired || 0,
            updatedAt: new Date().toISOString()
          }
        );
        updateCount++;
      }
    }

    log(`⭐ Updated ${updateCount} star levels`);
    
    return {
      totalUsers: users.documents.length,
      updatedStarLevels: updateCount
    };

  } catch (err) {
    throw new Error(`Failed to update star levels: ${err.message}`);
  }
}

/**
 * Calculate star level based on points
 */
function calculateStarLevel(starPoints, starLevels) {
  let currentLevel = 0;
  
  for (const level of starLevels) {
    if (starPoints >= level.pointsRequired) {
      currentLevel = level.starLevel;
    } else {
      break;
    }
  }
  
  return currentLevel;
}

/**
 * Create default star levels
 */
async function createDefaultStarLevels(log) {
  const defaultStars = [
    { starLevel: 0, title: 'Noob', pointsRequired: 0, color: 'gray' },
    { starLevel: 1, title: 'Novice', pointsRequired: 100, color: 'bronze' },
    { starLevel: 2, title: 'Apprentice', pointsRequired: 300, color: 'silver' },
    { starLevel: 3, title: 'Skilled', pointsRequired: 750, color: 'gold' },
    { starLevel: 4, title: 'Expert', pointsRequired: 1500, color: 'platinum' },
    { starLevel: 5, title: 'Master', pointsRequired: 3000, color: 'diamond' },
    { starLevel: 6, title: 'Grandmaster', pointsRequired: 6000, color: 'legendary' },
    { starLevel: 7, title: 'Legend', pointsRequired: 12000, color: 'mythic' }
  ];

  for (const star of defaultStars) {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.STARS,
      'unique()',
      {
        ...star,
        icon: `star-${star.starLevel}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
  }

  log('⭐ Created default star levels');
}

/**
 * Create ranking snapshot for historical data
 */
async function createRankingSnapshot(period, topUsers, log) {
  try {
    const timestamp = new Date().toISOString();
    
    for (let i = 0; i < Math.min(topUsers.length, 100); i++) {
      const user = topUsers[i];
      
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USER_RANKINGS,
        'unique()',
        {
          userId: user.userId,
          rankingType: 'leaderboard',
          rank: i + 1,
          points: period === 'weekly' ? user.weeklyPoints : user.monthlyPoints,
          starPoints: user.starPoints,
          challengesSolved: user.solvedChallenges?.length || 0,
          currentStars: user.currentStars,
          period,
          createdAt: timestamp
        }
      );
    }

    log(`📸 Created ${period} ranking snapshot for top ${Math.min(topUsers.length, 100)} users`);
  } catch (err) {
    log(`⚠️ Failed to create ${period} ranking snapshot:`, err.message);
  }
}

/**
 * Update leaderboard cache
 */
async function updateLeaderboardCache(log) {
  try {
    log('💾 Updating leaderboard cache...');

    // Generate different leaderboard types
    const leaderboardTypes = [
      { type: 'global', filter: null },
      { type: 'weekly', filter: 'weekly' },
      { type: 'monthly', filter: 'monthly' }
    ];

    let cacheCount = 0;

    for (const { type, filter } of leaderboardTypes) {
      const leaderboardData = await generateLeaderboardData(type, filter);
      
      // Check if leaderboard cache exists
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.LEADERBOARD,
        [Query.equal('type', type)]
      );

      const cacheData = {
        type,
        filter: filter || '',
        data: JSON.stringify(leaderboardData),
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
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

      cacheCount++;
    }

    log(`💾 Updated ${cacheCount} leaderboard caches`);
    
    return {
      cacheCount,
      types: leaderboardTypes.map(l => l.type)
    };

  } catch (err) {
    throw new Error(`Failed to update leaderboard cache: ${err.message}`);
  }
}

/**
 * Generate leaderboard data for a specific type
 */
async function generateLeaderboardData(type, filter) {
  let query;
  
  switch (type) {
    case 'weekly':
      query = [
        Query.greaterThan('weeklyPoints', 0),
        Query.orderDesc('weeklyPoints'),
        Query.orderDesc('totalPoints'),
        Query.limit(100)
      ];
      break;
    case 'monthly':
      query = [
        Query.greaterThan('monthlyPoints', 0),
        Query.orderDesc('monthlyPoints'),
        Query.orderDesc('totalPoints'),
        Query.limit(100)
      ];
      break;
    default: // global
      query = [
        Query.orderDesc('totalPoints'),
        Query.orderDesc('successfulSubmissions'),
        Query.orderAsc('createdAt'),
        Query.limit(100)
      ];
  }

  const users = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, query);

  return users.documents.map((user, index) => ({
    rank: index + 1,
    userId: user.userId,
    totalPoints: user.totalPoints,
    weeklyPoints: user.weeklyPoints || 0,
    monthlyPoints: user.monthlyPoints || 0,
    successfulSubmissions: user.successfulSubmissions,
    currentStars: user.currentStars,
    starTitle: user.starTitle,
    streak: user.streak,
    country: user.country,
    isPublic: user.isPublic,
    profilePicture: user.profilePicture
  }));
}

/**
 * Update war leaderboard with ELO ratings
 */
async function updateWarLeaderboard(log) {
  try {
    log('⚔️ Updating war leaderboard...');

    // Get all users with war games played
    const users = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [
        Query.greaterThan('warGamesPlayed', 0),
        Query.orderDesc('eloRating'),
        Query.orderDesc('warWins'),
        Query.limit(1000)
      ]
    );

    let updateCount = 0;
    
    // Update war leaderboard entries
    for (let i = 0; i < users.documents.length; i++) {
      const user = users.documents[i];
      const warRank = i + 1;
      
      // Calculate win percentage
      const totalGames = (user.warWins || 0) + (user.warLosses || 0) + (user.warDraws || 0);
      const winPercentage = totalGames > 0 ? ((user.warWins || 0) / totalGames) * 100 : 0;
      
      // Check if war leaderboard entry exists
      const existingEntry = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WAR_LEADERBOARD,
        [Query.equal('userId', user.userId)]
      );
      
      const leaderboardData = {
        userId: user.userId,
        eloRating: user.eloRating || 1200,
        warWins: user.warWins || 0,
        warLosses: user.warLosses || 0,
        warDraws: user.warDraws || 0,
        warStreak: user.warStreak || 0,
        bestWarStreak: user.bestWarStreak || 0,
        warRank,
        totalWarGames: user.warGamesPlayed || 0,
        winPercentage: Math.round(winPercentage * 100) / 100,
        avgOpponentElo: user.eloRating || 1200, // Simplified for now
        lastMatchAt: user.warLastMatchAt || null,
        isProvisional: user.provisionalRating !== false,
        lastUpdated: new Date().toISOString()
      };
      
      if (existingEntry.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.WAR_LEADERBOARD,
          existingEntry.documents[0].$id,
          leaderboardData
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.WAR_LEADERBOARD,
          'unique()',
          leaderboardData
        );
      }
      
      // Update user's war rank
      if (user.warRank !== warRank) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.$id,
          {
            warRank,
            updatedAt: new Date().toISOString()
          }
        );
      }
      
      updateCount++;
    }

    log(`⚔️ Updated ${updateCount} war leaderboard entries`);
    
    return {
      totalWarPlayers: users.documents.length,
      updatedEntries: updateCount
    };

  } catch (err) {
    throw new Error(`Failed to update war leaderboard: ${err.message}`);
  }
}
