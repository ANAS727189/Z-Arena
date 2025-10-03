// Utility functions for challenge management
import type { Challenge } from '@/types';

/**
 * Loads all challenges from the challenges directory
 * In production, this would be handled by Appwrite Functions
 */
export async function loadChallenges(): Promise<Challenge[]> {
  const challenges: Challenge[] = [];

  try {
    // For development, we'll manually import our JSON files
    // In production, this would fetch from Appwrite database
    const challengeFiles = [
      'challenge-001-hello-world.json',
      'challenge-002-two-sum-array.json',
      'challenge-003-fibonacci-sequence.json',
      'challenge-004-reverse-string.json',
    ];

    for (const filename of challengeFiles) {
      try {
        const response = await fetch(`/challenges/${filename}`);
        if (response.ok) {
          const challenge = (await response.json()) as Challenge;
          challenges.push(challenge);
        }
      } catch (error) {
        console.error(`Failed to load challenge ${filename}:`, error);
      }
    }

    // Sort challenges by creation date (newest first)
    challenges.sort(
      (a, b) =>
        new Date(b.metadata.createdAt).getTime() -
        new Date(a.metadata.createdAt).getTime()
    );
  } catch (error) {
    console.error('Failed to load challenges:', error);
  }

  return challenges;
}

/**
 * Loads a specific challenge by ID
 */
export async function loadChallenge(id: string): Promise<Challenge | null> {
  try {
    // In production, this would query Appwrite database
    const challenges = await loadChallenges();
    return challenges.find(challenge => challenge.id === id) || null;
  } catch (error) {
    console.error(`Failed to load challenge ${id}:`, error);
    return null;
  }
}

/**
 * Filters challenges based on search criteria
 */
export function filterChallenges(
  challenges: Challenge[],
  filters: {
    search?: string;
    difficulty?: string;
    language?: string;
    tags?: string[];
  }
): Challenge[] {
  return challenges.filter(challenge => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = challenge.metadata.title
        .toLowerCase()
        .includes(searchLower);
      const matchesDescription = challenge.metadata.description
        .toLowerCase()
        .includes(searchLower);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty !== 'all') {
      if (challenge.metadata.difficulty !== filters.difficulty) return false;
    }

    // Language filter
    if (filters.language && filters.language !== 'all') {
      if (!challenge.metadata.supportedLanguages?.includes(filters.language))
        return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag =>
        challenge.metadata.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });
}

/**
 * Gets unique tags from all challenges
 */
export function getUniqueTags(challenges: Challenge[]): string[] {
  const tagSet = new Set<string>();
  challenges?.forEach(challenge => {
    challenge.metadata.tags?.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * Gets difficulty distribution for analytics
 */
export function getDifficultyStats(challenges: Challenge[]) {
  const stats = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  challenges?.forEach(challenge => {
    stats[challenge.metadata.difficulty]++;
  });

  return stats;
}

/**
 * Calculates total points available
 */
export function getTotalPoints(challenges: Challenge[]): number {
  return challenges.reduce(
    (total, challenge) => total + challenge.metadata.points,
    0
  );
}

/**
 * Gets supported languages across all challenges
 */
export function getSupportedLanguages(challenges: Challenge[]): string[] {
  const languageSet = new Set<string>();
  challenges?.forEach(challenge => {
    challenge.metadata.supportedLanguages?.forEach(lang =>
      languageSet.add(lang)
    );
  });
  return Array.from(languageSet).sort();
}

/**
 * Validates challenge data against our schema
 * In production, this would use the JSON schema validator
 */
export function validateChallenge(challenge: any): challenge is Challenge {
  // Basic validation - in production use JSON schema validation
  return (
    challenge &&
    typeof challenge.id === 'string' &&
    challenge.metadata &&
    challenge.problem &&
    challenge.languages &&
    Array.isArray(challenge.testCases) &&
    challenge.editorial
  );
}
