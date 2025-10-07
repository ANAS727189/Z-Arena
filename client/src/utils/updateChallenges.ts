import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type { Challenge } from '@/types';

// Import challenge data from JSON files
async function loadChallengeFile(filename: string): Promise<Challenge> {
  const response = await fetch(`/challenges/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to load challenge file: ${filename}`);
  }
  return response.json();
}

export async function updateExistingChallenges() {
  const challengeFiles = Object.keys(
    import.meta.glob('/public/challenges/challenge-*.json', { eager: false })
  ).map((path) => path.split('/').pop()!);

  console.log(`🔄 Updating existing challenges... (${challengeFiles.length} challenges)`);

  for (const filename of challengeFiles) {
    try {
      console.log(`📥 Loading ${filename}...`);
      const challenge = await loadChallengeFile(filename);

      // Check if challenge exists
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CHALLENGES,
        [Query.equal('challengeId', challenge.id)]
      );

      if (existing.documents.length > 0) {
        const docId = existing.documents[0].$id;
        
        // Update with proper language starter codes
        const updateData = {
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
          supportedLanguages: challenge.metadata.supportedLanguages || ['z--'],
          updatedAt: new Date().toISOString(),
        };

        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.CHALLENGES,
          docId,
          updateData
        );

        console.log(`✅ Updated challenge: ${challenge.metadata.title}`);
      } else {
        console.log(`⚠️  Challenge ${challenge.id} not found in database`);
      }
    } catch (error) {
      console.error(`❌ Error updating challenge ${filename}:`, error);
    }
  }

  console.log('🎉 Challenge update process completed!');
}

// Call this function to update existing challenges
// updateExistingChallenges();

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).updateExistingChallenges = updateExistingChallenges;
}