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
  // Get all challenge files dynamically
  const challengeFiles = [
    'challenge-001-hello-world.json',
    'challenge-002-two-sum-array.json',
    'challenge-003-fibonacci-sequence.json',
    'challenge-004-reverse-string.json',
    'challenge-cpp-001-smart-pointers.json',
    'challenge-cpp-002-template-metaprogramming.json',
    'challenge-cpp-003-concurrent-futures.json',
    'challenge-cpp-004-custom-allocator.json',
    'challenge-cpp-005-expression-templates.json',
    'challenge-go-001-http-server.json',
    'challenge-go-002-concurrent-processor.json',
    'challenge-go-003-jwt-auth.json',
    'challenge-go-004-rate-limiter.json',
    'challenge-go-005-json-stream.json',
    'challenge-go-006-context-timeout.json',
    'challenge-go-007-worker-pool.json',
    'challenge-go-008-circuit-breaker.json',
    'challenge-js-001-promise-pool.json',
    'challenge-js-002-event-emitter.json',
    'challenge-js-003-debounce-throttle.json',
    'challenge-js-004-async-queue.json',
    'challenge-mixed-001-lru-cache.json',
    'challenge-mixed-002-consistent-hashing.json',
    'challenge-py-001-decorator-cache.json',
    'challenge-py-002-async-scraper.json',
    'challenge-py-003-metaclass-orm.json',
    'challenge-py-004-context-manager.json',
    'challenge-py-005-generator-pipeline.json',
    'challenge-py-006-multiprocessing.json',
    'challenge-py-007-advanced-descriptors.json',
    'challenge-py-008-coroutine-scheduler.json',
    'challenge-py-009-graph-algorithms.json',
    'challenge-py-010-machine-learning-framework.json',
  ];

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
        starterCodes: JSON.stringify({
          'z--': challenge.code?.starterCode || '',
        }),
        solutionCodes: JSON.stringify({
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
