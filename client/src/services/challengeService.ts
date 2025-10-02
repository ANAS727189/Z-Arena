import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
import type { Challenge } from '@/types';
import type { Models } from 'appwrite';

export interface ChallengeDocument extends Models.Document {
  challengeId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit: number;
  tags: string[];
  author: string;
  supportedLanguages: string[];
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: string; // JSON string
  starterCodes: string; // JSON string - languages mapped to starter code
  solutionCodes: string; // JSON string - languages mapped to solution code
  hints: string; // JSON string - array of hints
  testCases: string; // JSON string - array of test cases
  editorial: string; // JSON string - editorial content
  stats: string; // JSON string - challenge statistics
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionDocument extends Models.Document {
  userId: string;
  challengeId: string;
  language: string;
  code: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  score: number;
  runtime: number;
  memoryUsed: number;
  testResults: string; // JSON string - array of test results
  submittedAt: string;
}

export interface UserStatsDocument extends Models.Document {
  userId: string;
  totalSubmissions: number;
  successfulSubmissions: number;
  totalPoints: number;
  solvedChallenges: string[]; // Array of challenge IDs
  preferredLanguages: string[];
  rank: number;
  level: string;
  createdAt: string;
  updatedAt: string;
}

class ChallengeService {
  // Get all challenges with optional filtering
  async getChallenges(filters?: {
    difficulty?: string;
    language?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<Challenge[]> {
    try {
      const queries = [Query.equal('isActive', true)];
      
      if (filters?.difficulty && filters.difficulty !== 'all') {
        queries.push(Query.equal('difficulty', filters.difficulty));
      }
      
      if (filters?.language && filters.language !== 'all') {
        queries.push(Query.contains('supportedLanguages', filters.language));
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        queries.push(Query.contains('tags', filters.tags));
      }
      
      if (filters?.limit) {
        queries.push(Query.limit(filters.limit));
      }
      
      if (filters?.offset) {
        queries.push(Query.offset(filters.offset));
      }

      const response = await databases.listDocuments<ChallengeDocument>(
        DATABASE_ID,
        COLLECTIONS.CHALLENGES,
        queries
      );

      return response.documents.map(this.mapDocumentToChallenge);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw error;
    }
  }

  // Get a single challenge by ID
  async getChallenge(challengeId: string): Promise<Challenge | null> {
    try {
      const response = await databases.getDocument<ChallengeDocument>(
        DATABASE_ID,
        COLLECTIONS.CHALLENGES,
        challengeId
      );

      return this.mapDocumentToChallenge(response);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      return null;
    }
  }

  // Search challenges
  async searchChallenges(query: string): Promise<Challenge[]> {
    try {
      const response = await databases.listDocuments<ChallengeDocument>(
        DATABASE_ID,
        COLLECTIONS.CHALLENGES,
        [
          Query.equal('isActive', true),
          Query.or([
            Query.search('title', query),
            Query.search('description', query),
            Query.contains('tags', query)
          ])
        ]
      );

      return response.documents.map(this.mapDocumentToChallenge);
    } catch (error) {
      console.error('Error searching challenges:', error);
      throw error;
    }
  }

  // Submit a solution
  async submitSolution(
    userId: string,
    challengeId: string,
    language: string,
    code: string
  ): Promise<SubmissionDocument> {
    try {
      const submission = await databases.createDocument<SubmissionDocument>(
        DATABASE_ID,
        COLLECTIONS.SUBMISSIONS,
        'unique()',
        {
          userId,
          challengeId,
          language,
          code,
          status: 'pending',
          score: 0,
          runtime: 0,
          memoryUsed: 0,
          testResults: JSON.stringify([]),
          submittedAt: new Date().toISOString(),
        }
      );

      // TODO: Trigger code execution/judging process here
      // This would typically involve sending the code to Judge0 or Z-Studio compiler

      return submission;
    } catch (error) {
      console.error('Error submitting solution:', error);
      throw error;
    }
  }

  // Get user submissions
  async getUserSubmissions(userId: string, challengeId?: string): Promise<SubmissionDocument[]> {
    try {
      const queries = [Query.equal('userId', userId)];
      
      if (challengeId) {
        queries.push(Query.equal('challengeId', challengeId));
      }
      
      queries.push(Query.orderDesc('submittedAt'));

      const response = await databases.listDocuments<SubmissionDocument>(
        DATABASE_ID,
        COLLECTIONS.SUBMISSIONS,
        queries
      );

      return response.documents;
    } catch (error) {
      console.error('Error fetching user submissions:', error);
      throw error;
    }
  }

  // Get user stats
  async getUserStats(userId: string): Promise<UserStatsDocument | null> {
    try {
      const response = await databases.listDocuments<UserStatsDocument>(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', userId)]
      );

      return response.documents[0] || null;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  // Create or update user stats
  async updateUserStats(userId: string, stats: Partial<UserStatsDocument>): Promise<UserStatsDocument> {
    try {
      const existingStats = await this.getUserStats(userId);
      
      if (existingStats) {
        return await databases.updateDocument<UserStatsDocument>(
          DATABASE_ID,
          COLLECTIONS.USERS,
          existingStats.$id,
          {
            ...stats,
            updatedAt: new Date().toISOString(),
          }
        );
      } else {
        return await databases.createDocument<UserStatsDocument>(
          DATABASE_ID,
          COLLECTIONS.USERS,
          'unique()',
          {
            userId,
            totalSubmissions: 0,
            successfulSubmissions: 0,
            totalPoints: 0,
            solvedChallenges: [],
            preferredLanguages: [],
            rank: 0,
            level: 'beginner',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...stats,
          }
        );
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  // Helper method to map Appwrite document to Challenge type
  private mapDocumentToChallenge(doc: ChallengeDocument): Challenge {
    return {
      id: doc.challengeId,
      metadata: {
        title: doc.title,
        description: doc.description,
        difficulty: doc.difficulty,
        points: doc.points,
        timeLimit: doc.timeLimit,
        tags: doc.tags,
        author: doc.author,
        createdAt: doc.createdAt,
        version: '1.0',
        supportedLanguages: doc.supportedLanguages || ['z--'],
      },
      problem: {
        statement: doc.problemStatement,
        inputFormat: doc.inputFormat,
        outputFormat: doc.outputFormat,
        constraints: doc.constraints,
        examples: JSON.parse(doc.examples || '[]'),
      },
      languages: JSON.parse(doc.starterCodes || '{}'),
      testCases: JSON.parse(doc.testCases || '[]'),
      editorial: JSON.parse(doc.editorial || '{}'),
      stats: JSON.parse(doc.stats || '{"totalSubmissions":0,"successfulSubmissions":0,"averageScore":0}'),
    };
  }
}

export const challengeService = new ChallengeService();