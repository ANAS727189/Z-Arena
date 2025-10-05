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
  SUBMISSIONS: 'submissions',
  USER_ACHIEVEMENTS: 'user_achievements',
  CHALLENGES: 'challenges'
};

/**
 * Main function to process submission and update user statistics
 */
export default async ({ req, res, log, error }) => {
  try {
    // Get submission data from the event
    const submissionData = req.bodyJson || {};
    
    log('🔄 Processing submission:', submissionData.$id);

    // Get the full submission document
    const submission = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.SUBMISSIONS,
      submissionData.$id
    );

    log('📄 Submission details:', {
      userId: submission.userId,
      challengeId: submission.challengeId,
      status: submission.status,
      score: submission.score
    });

    // Only process successful submissions
    if (submission.status !== 'completed' || submission.score <= 0) {
      log('⚠️ Submission not successful, skipping processing');
      return res.json({ success: true, message: 'Submission not successful, no processing needed' });
    }

    // Get challenge information
    const challenge = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CHALLENGES,
      [Query.equal('challengeId', submission.challengeId)]
    );

    if (challenge.documents.length === 0) {
      throw new Error(`Challenge not found: ${submission.challengeId}`);
    }

    const challengeDoc = challenge.documents[0];

    // Update user statistics
    const updatedUser = await updateUserStatistics(submission, challengeDoc, log);

    // Check and award achievements
    await checkAchievements(updatedUser, submission, challengeDoc, log);

    // Update challenge statistics
    await updateChallengeStatistics(challengeDoc, submission, log);

    const result = {
      success: true,
      message: 'Submission processed successfully',
      submissionId: submission.$id,
      userId: submission.userId,
      pointsAwarded: submission.score,
      timestamp: new Date().toISOString()
    };

    log('✅ Submission processing completed:', result);

    return res.json(result);

  } catch (processError) {
    error('❌ Submission processing failed:', processError);
    
    return res.json({
      success: false,
      error: processError.message,
      submissionId: submissionData.$id || 'unknown',
      timestamp: new Date().toISOString()
    }, 500);
  }
};

/**
 * Update user statistics based on submission
 */
async function updateUserStatistics(submission, challenge, log) {
  try {
    // Get current user stats
    const userStats = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal('userId', submission.userId)]
    );

    let userDoc;
    const isFirstSubmission = userStats.documents.length === 0;

    if (isFirstSubmission) {
      // Create new user stats document
      userDoc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        'unique()',
        createInitialUserStats(submission.userId, submission, challenge)
      );
      log('👤 Created new user stats for:', submission.userId);
    } else {
      // Update existing user stats
      userDoc = userStats.documents[0];
      const updatedStats = calculateUpdatedStats(userDoc, submission, challenge);
      
      userDoc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userDoc.$id,
        updatedStats
      );
      log('📊 Updated user stats for:', submission.userId);
    }

    return userDoc;
  } catch (err) {
    throw new Error(`Failed to update user statistics: ${err.message}`);
  }
}

/**
 * Create initial user statistics
 */
function createInitialUserStats(userId, submission, challenge) {
  const now = new Date().toISOString();
  const isEasy = challenge.difficulty === 'easy';
  const isMedium = challenge.difficulty === 'medium';
  const isHard = challenge.difficulty === 'hard';

  return {
    userId,
    totalSubmissions: 1,
    successfulSubmissions: 1,
    totalPoints: submission.score,
    solvedChallenges: [submission.challengeId],
    preferredLanguages: [submission.language],
    rank: 0, // Will be calculated by leaderboard updater
    level: 'beginner',
    globalRank: 0,
    weeklyRank: 0,
    monthlyRank: 0,
    weeklyPoints: submission.score,
    monthlyPoints: submission.score,
    lastActive: now,
    streak: 1,
    bestStreak: 1,
    avgSolveTime: submission.solveTime || 0,
    country: 'Unknown',
    profilePicture: null,
    isPublic: true,
    starPoints: submission.starPointsEarned || submission.score,
    currentStars: 0, // Will be calculated based on starPoints
    starTitle: 'Noob',
    easyChallengesSolved: isEasy ? 1 : 0,
    mediumChallengesSolved: isMedium ? 1 : 0,
    hardChallengesSolved: isHard ? 1 : 0,
    achievements: [],
    badgesEarned: [],
    nextStarRequirement: 100,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Calculate updated user statistics
 */
function calculateUpdatedStats(userDoc, submission, challenge) {
  const now = new Date().toISOString();
  const solvedChallenges = userDoc.solvedChallenges || [];
  const isNewChallenge = !solvedChallenges.includes(submission.challengeId);
  
  // Update preferred languages
  const preferredLangs = userDoc.preferredLanguages || [];
  if (!preferredLangs.includes(submission.language)) {
    preferredLangs.push(submission.language);
  }

  // Calculate streak
  const lastActive = new Date(userDoc.lastActive || userDoc.createdAt);
  const submissionTime = new Date(submission.submittedAt);
  const daysDiff = Math.floor((submissionTime - lastActive) / (1000 * 60 * 60 * 24));
  
  let newStreak = userDoc.streak || 0;
  if (daysDiff === 1) {
    newStreak += 1; // Consecutive day
  } else if (daysDiff > 1) {
    newStreak = 1; // Reset streak
  }
  // Same day doesn't change streak

  const updates = {
    totalSubmissions: (userDoc.totalSubmissions || 0) + 1,
    successfulSubmissions: (userDoc.successfulSubmissions || 0) + 1,
    totalPoints: (userDoc.totalPoints || 0) + submission.score,
    preferredLanguages: preferredLangs,
    lastActive: now,
    streak: newStreak,
    bestStreak: Math.max(userDoc.bestStreak || 0, newStreak),
    starPoints: (userDoc.starPoints || 0) + (submission.starPointsEarned || submission.score),
    updatedAt: now
  };

  // Update difficulty-specific counters and solved challenges if new
  if (isNewChallenge) {
    updates.solvedChallenges = [...solvedChallenges, submission.challengeId];
    
    if (challenge.difficulty === 'easy') {
      updates.easyChallengesSolved = (userDoc.easyChallengesSolved || 0) + 1;
    } else if (challenge.difficulty === 'medium') {
      updates.mediumChallengesSolved = (userDoc.mediumChallengesSolved || 0) + 1;
    } else if (challenge.difficulty === 'hard') {
      updates.hardChallengesSolved = (userDoc.hardChallengesSolved || 0) + 1;
    }
  }

  // Update weekly/monthly points (simplified - should consider actual time windows)
  updates.weeklyPoints = (userDoc.weeklyPoints || 0) + submission.score;
  updates.monthlyPoints = (userDoc.monthlyPoints || 0) + submission.score;

  return updates;
}

/**
 * Check and award achievements
 */
async function checkAchievements(userDoc, submission, challenge, log) {
  try {
    const achievements = [];

    // First submission achievement
    if (userDoc.totalSubmissions === 1) {
      achievements.push({
        achievementId: 'first-submission',
        achievementType: 'milestone',
        title: 'First Steps',
        description: 'Completed your first challenge submission'
      });
    }

    // First successful submission
    if (userDoc.successfulSubmissions === 1) {
      achievements.push({
        achievementId: 'first-success',
        achievementType: 'milestone',
        title: 'Problem Solver',
        description: 'Successfully solved your first challenge'
      });
    }

    // Milestone achievements
    const milestones = [5, 10, 25, 50, 100];
    if (milestones.includes(userDoc.successfulSubmissions)) {
      achievements.push({
        achievementId: `milestone-${userDoc.successfulSubmissions}`,
        achievementType: 'milestone',
        title: `${userDoc.successfulSubmissions} Challenges`,
        description: `Solved ${userDoc.successfulSubmissions} challenges`
      });
    }

    // Streak achievements
    if ([3, 7, 14, 30].includes(userDoc.streak)) {
      achievements.push({
        achievementId: `streak-${userDoc.streak}`,
        achievementType: 'streak',
        title: `${userDoc.streak} Day Streak`,
        description: `Maintained a ${userDoc.streak} day solving streak`
      });
    }

    // Language-specific achievements
    if (submission.language === 'z--' && userDoc.successfulSubmissions === 1) {
      achievements.push({
        achievementId: 'z-lang-pioneer',
        achievementType: 'language',
        title: 'Z-- Pioneer',
        description: 'First challenge solved in Z-- language'
      });
    }

    // Award achievements
    for (const achievement of achievements) {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USER_ACHIEVEMENTS,
        'unique()',
        {
          userId: userDoc.userId,
          ...achievement,
          earnedAt: new Date().toISOString(),
          metadata: JSON.stringify({ submissionId: submission.$id })
        }
      );

      log(`🏆 Awarded achievement: ${achievement.title} to user ${userDoc.userId}`);
    }

  } catch (err) {
    log('⚠️ Failed to process achievements:', err.message);
    // Don't throw - achievements are non-critical
  }
}

/**
 * Update challenge statistics
 */
async function updateChallengeStatistics(challengeDoc, submission, log) {
  try {
    const currentStats = JSON.parse(challengeDoc.stats || '{"totalSubmissions":0,"successfulSubmissions":0,"averageScore":0}');
    
    const updatedStats = {
      totalSubmissions: currentStats.totalSubmissions + 1,
      successfulSubmissions: currentStats.successfulSubmissions + 1,
      averageScore: Math.round(
        ((currentStats.averageScore * currentStats.successfulSubmissions) + submission.score) / 
        (currentStats.successfulSubmissions + 1)
      )
    };

    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.CHALLENGES,
      challengeDoc.$id,
      {
        stats: JSON.stringify(updatedStats),
        updatedAt: new Date().toISOString()
      }
    );

    log(`📈 Updated challenge statistics for: ${challengeDoc.challengeId}`);
  } catch (err) {
    log('⚠️ Failed to update challenge statistics:', err.message);
    // Don't throw - statistics are non-critical
  }
}
