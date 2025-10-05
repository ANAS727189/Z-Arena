import { Client, Databases, Query } from 'node-appwrite';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Appwrite configuration
const client = new Client()
  .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = '68debe350002d7856a53';
const COLLECTIONS = {
  CHALLENGES: 'challenges'
};

/**
 * Main function to seed challenges from JSON files
 */
export default async ({ req, res, log, error }) => {
  try {
    log('🌱 Starting challenge seeding process...');

    // Get challenge files from the mounted challenges directory
    const challengesDir = '/mnt/challenges'; // Mounted directory in Appwrite Functions
    const challengeFiles = getChallengeFiles(challengesDir);

    log(`📁 Found ${challengeFiles.length} challenge files`);

    let seededCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const filename of challengeFiles) {
      try {
        log(`📥 Processing ${filename}...`);
        
        const challenge = loadChallengeFile(join(challengesDir, filename));
        
        // Check if challenge already exists
        const existing = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.CHALLENGES,
          [Query.equal('challengeId', challenge.id)]
        );

        if (existing.documents.length > 0) {
          log(`⏭️  Challenge ${challenge.id} already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Transform Challenge to ChallengeDocument format
        const challengeDocument = transformChallengeToDocument(challenge);

        // Create challenge document
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.CHALLENGES,
          'unique()',
          challengeDocument
        );

        log(`✅ Successfully seeded challenge: ${challenge.id}`);
        seededCount++;

      } catch (fileError) {
        error(`❌ Error processing ${filename}:`, fileError);
        errorCount++;
      }
    }

    const result = {
      success: true,
      message: `Challenge seeding completed`,
      statistics: {
        totalFiles: challengeFiles.length,
        seeded: seededCount,
        skipped: skippedCount,
        errors: errorCount
      },
      timestamp: new Date().toISOString()
    };

    log('🎉 Challenge seeding process completed:', result);

    return res.json(result);

  } catch (mainError) {
    error('❌ Challenge seeding failed:', mainError);
    
    return res.json({
      success: false,
      error: mainError.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
};

/**
 * Get all challenge JSON files from directory
 */
function getChallengeFiles(challengesDir) {
  try {
    return readdirSync(challengesDir)
      .filter(file => file.endsWith('.json') && file.startsWith('challenge-'))
      .sort();
  } catch (err) {
    throw new Error(`Failed to read challenges directory: ${err.message}`);
  }
}

/**
 * Load and parse challenge JSON file
 */
function loadChallengeFile(filepath) {
  try {
    const fileContent = readFileSync(filepath, 'utf8');
    const challenge = JSON.parse(fileContent);
    
    // Basic validation
    if (!challenge.id || !challenge.metadata || !challenge.problem) {
      throw new Error('Invalid challenge format');
    }
    
    return challenge;
  } catch (err) {
    throw new Error(`Failed to load challenge file ${filepath}: ${err.message}`);
  }
}

/**
 * Transform Challenge object to ChallengeDocument format
 */
function transformChallengeToDocument(challenge) {
  return {
    challengeId: challenge.id,
    title: challenge.metadata.title,
    description: challenge.metadata.description,
    difficulty: challenge.metadata.difficulty,
    points: challenge.metadata.points,
    timeLimit: challenge.metadata.timeLimit,
    tags: challenge.metadata.tags,
    author: challenge.metadata.author,
    supportedLanguages: challenge.metadata.supportedLanguages || ['z--'],
    problemStatement: challenge.problem.statement,
    inputFormat: challenge.problem.inputFormat,
    outputFormat: challenge.problem.outputFormat,
    constraints: challenge.problem.constraints,
    examples: JSON.stringify(challenge.problem.examples || []),
    starterCodes: JSON.stringify(challenge.languages || { 'z--': challenge.code?.starterCode || '' }),
    solutionCodes: JSON.stringify({ 'z--': challenge.code?.solutionCode || '' }),
    hints: JSON.stringify(challenge.code?.hints || []),
    testCases: JSON.stringify(challenge.testCases || []),
    editorial: JSON.stringify(challenge.editorial || {}),
    stats: JSON.stringify({
      totalSubmissions: 0,
      successfulSubmissions: 0,
      averageScore: 0
    }),
    isActive: true,
    starPoints: challenge.metadata.points || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
