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

export async function replaceChallenge(oldChallengeId: string, newChallengeFilename: string) {
  try {
    console.log(`🔄 Replacing challenge ${oldChallengeId} with ${newChallengeFilename}...`);
    
    // Load the new challenge data
    const newChallenge = await loadChallengeFile(newChallengeFilename);
    
    // Find the old challenge in the database
    const existingDocs = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CHALLENGES,
      [Query.equal('challengeId', oldChallengeId)]
    );

    if (existingDocs.documents.length > 0) {
      // Delete the old challenge
      const oldDocId = existingDocs.documents[0].$id;
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.CHALLENGES,
        oldDocId
      );
      console.log(`🗑️  Deleted old challenge: ${oldChallengeId}`);
    }

    // Create the new challenge document
    const challengeDocument: Omit<
      ChallengeDocument,
      keyof import('appwrite').Models.Document
    > = {
      challengeId: newChallenge.id,
      title: newChallenge.metadata.title,
      description: newChallenge.metadata.description,
      difficulty: newChallenge.metadata.difficulty,
      points: newChallenge.metadata.points,
      timeLimit: newChallenge.metadata.timeLimit,
      tags: newChallenge.metadata.tags,
      author: newChallenge.metadata.author,
      supportedLanguages: newChallenge.metadata.supportedLanguages || ['z--'],
      problemStatement: newChallenge.problem.statement,
      inputFormat: newChallenge.problem.inputFormat,
      outputFormat: newChallenge.problem.outputFormat,
      constraints: newChallenge.problem.constraints,
      examples: JSON.stringify(newChallenge.problem.examples || []),
      starterCodes: JSON.stringify(newChallenge.languages || {
        'z--': { starterCode: newChallenge.code?.starterCode || '' },
      }),
      solutionCodes: JSON.stringify(newChallenge.languages ? 
        Object.keys(newChallenge.languages).reduce((acc, lang) => {
          acc[lang] = newChallenge.languages![lang].solutionCode || '';
          return acc;
        }, {} as Record<string, string>) : {
        'z--': newChallenge.code?.solutionCode || '',
      }),
      hints: JSON.stringify(newChallenge.code?.hints || []),
      testCases: JSON.stringify(newChallenge.testCases || []),
      editorial: JSON.stringify(newChallenge.editorial || {}),
      stats: JSON.stringify(
        newChallenge.stats || {
          totalSubmissions: 0,
          successfulSubmissions: 0,
          averageScore: 0,
        }
      ),
      isActive: true,
      createdAt: newChallenge.metadata.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      starPoints: newChallenge.metadata.difficulty === 'easy' ? 1 : 
                 newChallenge.metadata.difficulty === 'medium' ? 2 : 3,
    };

    // Create the new challenge using the new challenge ID as document ID
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CHALLENGES,
      newChallenge.id,
      challengeDocument
    );

    console.log(`✅ Successfully replaced challenge with: ${newChallenge.metadata.title}`);
    return newChallenge.id;
  } catch (error) {
    console.error(`❌ Error replacing challenge:`, error);
    throw error;
  }
}

// Quick function to replace the async scraper challenge
export async function replaceAsyncScraperChallenge() {
  return await replaceChallenge('py-async-web-scraper', 'challenge-py-002-async-scraper.json');
}

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).replaceChallenge = replaceChallenge;
  (window as any).replaceAsyncScraperChallenge = replaceAsyncScraperChallenge;
}