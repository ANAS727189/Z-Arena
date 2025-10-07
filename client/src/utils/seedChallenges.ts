import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type { Challenge } from '@/types';
import type { ChallengeDocument } from '@/services/challengeService';

// Import challenge data from JSON files
async function loadChallengeFile(filename: string): Promise<Challenge> {
  const response = await fetch(`/challenges/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to load challenge file: ${filename}`);
  }
  return response.json();
}

export async function seedChallenges() {
  const challengeFiles = Object.keys(
    import.meta.glob('/public/challenges/challenge-*.json', { eager: false })
  ).map((path) => path.split('/').pop()!);

  console.log(`🌱 Starting challenge seeding process... (${challengeFiles.length} challenges)`);

  for (const filename of challengeFiles) {
    try {
      console.log(`📥 Loading ${filename}...`);
      const challenge = await loadChallengeFile(filename);

      // Check if challenge already exists
      try {
        const existing = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.CHALLENGES,
          [Query.equal('challengeId', challenge.id)]
        );

        if (existing.documents.length > 0) {
          console.log(
            `⏭️  Challenge ${challenge.id} already exists, skipping...`
          );
          continue;
        }
      } catch (error) {
        console.log(
          `🔍 Error checking for existing challenge, proceeding with creation...`
        );
      }

      // Transform Challenge to ChallengeDocument format
      const challengeDocument: Omit<
        ChallengeDocument,
        keyof import('appwrite').Models.Document
      > = {
        challengeId: challenge.id,
        title: challenge.metadata.title,
        description: challenge.metadata.description,
        difficulty: challenge.metadata.difficulty,
        points: challenge.metadata.points,
        timeLimit: challenge.metadata.timeLimit,
        tags: challenge.metadata.tags,
        author: challenge.metadata.author,
        supportedLanguages: challenge.metadata.supportedLanguages || ['z--'], // Default to z-- language
        problemStatement: challenge.problem.statement,
        inputFormat: challenge.problem.inputFormat,
        outputFormat: challenge.problem.outputFormat,
        constraints: challenge.problem.constraints,
        examples: JSON.stringify(challenge.problem.examples || []),
        starterCodes: JSON.stringify(challenge.languages || {
          'z--': { starterCode: challenge.code?.starterCode || '' },
        }),
        solutionCodes: JSON.stringify(challenge.languages ? 
          Object.keys(challenge.languages).reduce((acc, lang) => {
            acc[lang] = challenge.languages![lang].solutionCode || '';
            return acc;
          }, {} as Record<string, string>) : {
          'z--': challenge.code?.solutionCode || '',
        }),
        hints: JSON.stringify(challenge.code?.hints || []),
        testCases: JSON.stringify(challenge.testCases || []),
        editorial: JSON.stringify(challenge.editorial || {}),
        stats: JSON.stringify(
          challenge.stats || {
            totalSubmissions: 0,
            successfulSubmissions: 0,
            averageScore: 0,
          }
        ),
        isActive: true,
        createdAt: challenge.metadata.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Add the missing starPoints field based on difficulty
        starPoints: challenge.metadata.difficulty === 'easy' ? 1 : 
                   challenge.metadata.difficulty === 'medium' ? 2 : 3,
      };

      // Create the challenge in Appwrite using challengeId as document ID
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CHALLENGES,
        challenge.id, // Use the challenge ID as the document ID
        challengeDocument
      );

      console.log(
        `✅ Successfully seeded challenge: ${challenge.metadata.title}`
      );
    } catch (error) {
      console.error(`❌ Error seeding challenge ${filename}:`, error);
    }
  }

  console.log('🎉 Challenge seeding completed!');
}

// Development helper to clear all challenges
export async function clearAllChallenges() {
  try {
    console.log('🗑️  Clearing all challenges...');

    const challenges = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CHALLENGES
    );

    for (const challenge of challenges.documents) {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.CHALLENGES,
        challenge.$id
      );
    }

    console.log(`✅ Cleared ${challenges.documents.length} challenges`);
  } catch (error) {
    console.error('❌ Error clearing challenges:', error);
  }
}

// Development helper to reseed challenges
export async function reseedChallenges() {
  await clearAllChallenges();
  await seedChallenges();
}
