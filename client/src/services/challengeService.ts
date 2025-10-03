import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
import type { Challenge, TestCase, TestResult, Submission } from '@/types';
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

// Code execution interfaces
export interface ExecutionRequest {
  code: string;
  language: string;
  testCases: TestCase[];
  timeLimit?: number;
}

export interface ExecutionResult {
  success: boolean;
  testResults: TestResult[];
  totalScore: number;
  executionTime: number;
  error?: string;
}

export interface Judge0Response {
  stdout: string;
  stderr: string;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
  compile_output?: string;
}

export interface ZLangResponse {
  success: boolean;
  compilerOutput: string;
  programOutput: string;
  error?: string;
}

// Language ID mappings for Judge0
export const JUDGE0_LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  go: 60,
  rust: 73,
  typescript: 74,
} as const;

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
            Query.contains('tags', query),
          ]),
        ]
      );

      return response.documents.map(this.mapDocumentToChallenge);
    } catch (error) {
      console.error('Error searching challenges:', error);
      throw error;
    }
  }

  // Get user submissions
  async getUserSubmissions(
    userId: string,
    challengeId?: string
  ): Promise<SubmissionDocument[]> {
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
      stats: JSON.parse(
        doc.stats ||
          '{"totalSubmissions":0,"successfulSubmissions":0,"averageScore":0}'
      ),
    };
  }

  // Code execution methods
  async executeCode(request: ExecutionRequest): Promise<ExecutionResult> {
    const { code, language, testCases } = request;

    try {
      if (language === 'z--') {
        return await this.executeZLangCode(code, testCases);
      } else {
        return await this.executeJudge0Code(code, language, testCases);
      }
    } catch (error: any) {
      console.error('Code execution failed:', error);
      return {
        success: false,
        testResults: [],
        totalScore: 0,
        executionTime: 0,
        error: error.message || 'Code execution failed',
      };
    }
  }

  private async executeZLangCode(
    code: string,
    testCases: TestCase[]
  ): Promise<ExecutionResult> {
    const serverUrl =
      import.meta.env.VITE_Z_COMPILER_URL || 'http://localhost:3000';
    const testResults: TestResult[] = [];
    let totalScore = 0;
    let totalExecutionTime = 0;

    try {
      for (const testCase of testCases) {
        const startTime = Date.now();

        // For Z--, we need to modify code to include input handling if needed
        const modifiedCode = this.injectInputIntoZCode(code, testCase.input);

        const response = await fetch(`${serverUrl}/api/zlang/compile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: modifiedCode }),
        });

        const executionTime = Date.now() - startTime;
        totalExecutionTime += executionTime;

        if (!response.ok) {
          const errorData = await response.json();
          testResults.push({
            testCaseId: testCase.id,
            passed: false,
            actualOutput: '',
            executionTime,
            error: errorData.message || 'Compilation failed',
          });
          continue;
        }

        const result: ZLangResponse = await response.json();

        if (!result.success) {
          testResults.push({
            testCaseId: testCase.id,
            passed: false,
            actualOutput: '',
            executionTime,
            error: result.error || 'Execution failed',
          });
          continue;
        }

        const actualOutput = result.programOutput.trim();
        const expectedOutput = testCase.output.trim();
        const passed = actualOutput === expectedOutput;

        if (passed) {
          totalScore += testCase.points;
        }

        testResults.push({
          testCaseId: testCase.id,
          passed,
          actualOutput,
          executionTime,
          error: passed
            ? undefined
            : `Expected: "${expectedOutput}", Got: "${actualOutput}"`,
        });
      }

      return {
        success: true,
        testResults,
        totalScore,
        executionTime: totalExecutionTime,
      };
    } catch (error: any) {
      return {
        success: false,
        testResults: [],
        totalScore: 0,
        executionTime: totalExecutionTime,
        error: error.message || 'Z-- execution failed',
      };
    }
  }

  private async executeJudge0Code(
    code: string,
    language: string,
    testCases: TestCase[]
  ): Promise<ExecutionResult> {
    const serverUrl =
      import.meta.env.VITE_JUDGE0_PROXY_URL || 'http://localhost:3001';
    const languageId =
      JUDGE0_LANGUAGE_IDS[language as keyof typeof JUDGE0_LANGUAGE_IDS];

    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const testResults: TestResult[] = [];
    let totalScore = 0;
    let totalExecutionTime = 0;

    try {
      for (const testCase of testCases) {
        const startTime = Date.now();

        const response = await fetch(`${serverUrl}/api/judge0/compile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language_id: languageId,
            source_code: code,
            stdin: testCase.input,
            expected_output: testCase.output,
          }),
        });

        const executionTime = Date.now() - startTime;
        totalExecutionTime += executionTime;

        if (!response.ok) {
          const errorData = await response.json();
          testResults.push({
            testCaseId: testCase.id,
            passed: false,
            actualOutput: '',
            executionTime,
            error: errorData.message || 'Judge0 request failed',
          });
          continue;
        }

        const result: Judge0Response = await response.json();

        // Handle compilation errors
        if (result.compile_output && result.compile_output.trim()) {
          testResults.push({
            testCaseId: testCase.id,
            passed: false,
            actualOutput: '',
            executionTime,
            error: `Compilation Error: ${result.compile_output.trim()}`,
          });
          continue;
        }

        // Handle runtime errors
        if (result.stderr && result.stderr.trim()) {
          testResults.push({
            testCaseId: testCase.id,
            passed: false,
            actualOutput: result.stdout || '',
            executionTime: parseFloat(result.time) * 1000 || executionTime,
            error: `Runtime Error: ${result.stderr.trim()}`,
          });
          continue;
        }

        // Handle execution status
        if (result.status.id !== 3) {
          // 3 = Accepted
          let errorMessage = result.status.description;
          if (result.status.id === 5) errorMessage = 'Time Limit Exceeded';
          else if (result.status.id === 6) errorMessage = 'Compilation Error';
          else if (result.status.id === 7)
            errorMessage = 'Runtime Error (SIGSEGV)';
          else if (result.status.id === 8)
            errorMessage = 'Runtime Error (SIGXFSZ)';
          else if (result.status.id === 9)
            errorMessage = 'Runtime Error (SIGFPE)';
          else if (result.status.id === 10)
            errorMessage = 'Runtime Error (SIGABRT)';
          else if (result.status.id === 11)
            errorMessage = 'Runtime Error (NZEC)';
          else if (result.status.id === 12)
            errorMessage = 'Runtime Error (Other)';
          else if (result.status.id === 13) errorMessage = 'Internal Error';
          else if (result.status.id === 14) errorMessage = 'Exec Format Error';

          testResults.push({
            testCaseId: testCase.id,
            passed: false,
            actualOutput: result.stdout || '',
            executionTime: parseFloat(result.time) * 1000 || executionTime,
            error: errorMessage,
          });
          continue;
        }

        // Compare outputs
        const actualOutput = (result.stdout || '').trim();
        const expectedOutput = testCase.output.trim();
        const passed = actualOutput === expectedOutput;

        if (passed) {
          totalScore += testCase.points;
        }

        testResults.push({
          testCaseId: testCase.id,
          passed,
          actualOutput,
          executionTime: parseFloat(result.time) * 1000 || executionTime,
          error: passed
            ? undefined
            : `Expected: "${expectedOutput}", Got: "${actualOutput}"`,
        });
      }

      return {
        success: true,
        testResults,
        totalScore,
        executionTime: totalExecutionTime,
      };
    } catch (error: any) {
      return {
        success: false,
        testResults: [],
        totalScore: 0,
        executionTime: totalExecutionTime,
        error: error.message || 'Judge0 execution failed',
      };
    }
  }

  private injectInputIntoZCode(code: string, input: string): string {
    // For Z-- language, we need to handle input injection
    // This is a simplified implementation - you may need to adjust based on your Z-- syntax

    if (!input.trim()) {
      return code;
    }

    // Split input into lines for processing
    const inputLines = input.trim().split('\n');

    // Simple approach: replace any readInput() calls with actual values
    // You may need to adjust this based on your Z-- input handling syntax
    let modifiedCode = code;

    // If there are input() or readInput() calls, replace them with the actual input
    inputLines.forEach(line => {
      modifiedCode = modifiedCode.replace(
        new RegExp(`(input\\(\\)|readInput\\(\\)|read\\(\\))`, 'g'),
        `"${line}"`
      );
    });

    return modifiedCode;
  }

  // Enhanced submission method with code execution
  async submitSolution(
    challengeId: string,
    userId: string,
    code: string,
    language: string
  ): Promise<Submission> {
    try {
      // Get the challenge to access test cases
      const challenge = await this.getChallenge(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Execute the code against test cases
      const executionResult = await this.executeCode({
        code,
        language,
        testCases: challenge.testCases,
        timeLimit: challenge.metadata.timeLimit * 60 * 1000, // Convert minutes to milliseconds
      });

      // Determine submission status
      const allPassed = executionResult.testResults.every(
        result => result.passed
      );
      const status =
        executionResult.success && allPassed ? 'success' : 'failed';

      // Create submission document
      const submissionDoc = {
        userId,
        challengeId,
        language,
        code,
        status: status as 'success' | 'failed',
        score: executionResult.totalScore,
        runtime: executionResult.executionTime,
        memoryUsed: 0, // TODO: Implement memory tracking
        testResults: JSON.stringify(executionResult.testResults),
        submittedAt: new Date().toISOString(),
      };

      // Save to database
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.SUBMISSIONS,
        'unique()',
        submissionDoc
      );

      // Update user stats if successful
      if (status === 'success') {
        await this.updateUserStats(
          userId,
          challengeId,
          executionResult.totalScore
        );
      }

      // Return formatted submission
      return {
        id: response.$id,
        challengeId,
        userId,
        code,
        status: status as 'success' | 'failed',
        score: executionResult.totalScore,
        executionTime: executionResult.executionTime,
        createdAt: new Date(response.$createdAt),
        testResults: executionResult.testResults,
      };
    } catch (error: any) {
      console.error('Error submitting solution:', error);

      // Create failed submission record
      const failedSubmissionDoc = {
        userId,
        challengeId,
        language,
        code,
        status: 'failed' as const,
        score: 0,
        runtime: 0,
        memoryUsed: 0,
        testResults: JSON.stringify([]),
        submittedAt: new Date().toISOString(),
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.SUBMISSIONS,
        'unique()',
        failedSubmissionDoc
      );

      return {
        id: response.$id,
        challengeId,
        userId,
        code,
        status: 'failed',
        score: 0,
        executionTime: 0,
        createdAt: new Date(response.$createdAt),
        testResults: [],
      };
    }
  }

  private async updateUserStats(
    userId: string,
    challengeId: string,
    points: number
  ): Promise<void> {
    try {
      // Try to get existing user stats
      const existingStats = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', userId)]
      );

      if (existingStats.documents.length > 0) {
        // Update existing stats
        const stats = existingStats
          .documents[0] as unknown as UserStatsDocument;
        const solvedChallenges = stats.solvedChallenges.includes(challengeId)
          ? stats.solvedChallenges
          : [...stats.solvedChallenges, challengeId];

        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          stats.$id,
          {
            totalSubmissions: stats.totalSubmissions + 1,
            successfulSubmissions: stats.successfulSubmissions + 1,
            totalPoints: stats.totalPoints + points,
            solvedChallenges,
            updatedAt: new Date().toISOString(),
          }
        );
      } else {
        // Create new user stats
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          'unique()',
          {
            userId,
            totalSubmissions: 1,
            successfulSubmissions: 1,
            totalPoints: points,
            solvedChallenges: [challengeId],
            preferredLanguages: [],
            rank: 0,
            level: 'beginner',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
      // Don't throw error here - submission was successful even if stats update failed
    }
  }
}

export const challengeService = new ChallengeService();
