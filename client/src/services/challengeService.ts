import { databases, account, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';
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
  solutionCodes: string; // JSON string - languages mapped to solutions
  hints: string; // JSON string - array of hints
  testCases: string; // JSON string - array of test cases
  editorial: string; // JSON string - editorial content
  stats: string; // JSON string - challenge statistics
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  starPoints: number; // Points needed for star level calculation
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
  globalRank: number;
  weeklyRank: number;
  monthlyRank: number;
  weeklyPoints: number;
  monthlyPoints: number;
  currentStreak: number;
  maxStreak: number;
  lastSolvedDate: string;
  lastActive?: string;
  streak: number;
  bestStreak: number;
  avgSolveTime: number;
  country?: string;
  profilePicture?: string;
  isPublic: boolean;
  starPoints: number;
  currentStars: number;
  starTitle: string;
  easyChallengesSolved: number;
  mediumChallengesSolved: number;
  hardChallengesSolved: number;
  achievements: string[];
  badgesEarned: string[];
  nextStarRequirement: number;
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
      } else {
        queries.push(Query.limit(100));
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

  // Check if user has solved a challenge
  async hasUserSolvedChallenge(userId: string, challengeId: string): Promise<boolean> {
    try {
      const userStats = await this.getUserStats(userId);
      return userStats?.solvedChallenges?.includes(challengeId) || false;
    } catch (error) {
      console.error('Error checking if user solved challenge:', error);
      return false;
    }
  }

  // Calculate streak based on user's submission history
  private calculateStreak(userStats: UserStatsDocument): { currentStreak: number; maxStreak: number } {
    const today = new Date();
    const lastSolvedDate = userStats.lastSolvedDate ? new Date(userStats.lastSolvedDate) : null;
    
    // If no last solved date, streak is 0
    if (!lastSolvedDate) {
      return { currentStreak: 0, maxStreak: userStats.maxStreak || 0 };
    }
    
    // Calculate days difference
    const timeDiff = today.getTime() - lastSolvedDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    let currentStreak = userStats.currentStreak || 0;
    
    // If solved today (same day), maintain streak
    if (daysDiff === 0) {
      // Already solved today, no change to streak
    }
    // If solved yesterday, increment streak
    else if (daysDiff === 1) {
      currentStreak += 1;
    }
    // If more than 1 day gap, reset streak
    else if (daysDiff > 1) {
      currentStreak = 1; // Reset to 1 for today's solve
    }
    
    const maxStreak = Math.max(currentStreak, userStats.maxStreak || 0);
    
    return { currentStreak, maxStreak };
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

    console.log('🚀 Executing code:', {
      language,
      testCasesCount: testCases?.length || 0,
      testCases: testCases?.map(tc => ({ id: tc?.id, hasId: !!tc?.id }))
    });

    // Validate test cases
    if (!testCases || testCases.length === 0) {
      return {
        success: false,
        testResults: [],
        totalScore: 0,
        executionTime: 0,
        error: 'No test cases provided for code execution',
      };
    }

    // Check for test cases without IDs
    const invalidTestCases = testCases.filter(tc => !tc || !tc.id);
    if (invalidTestCases.length > 0) {
      console.error('❌ Found test cases without IDs:', invalidTestCases);
      return {
        success: false,
        testResults: [],
        totalScore: 0,
        executionTime: 0,
        error: `Invalid test cases found: ${invalidTestCases.length} test cases are missing IDs`,
      };
    }

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
      import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
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
            error: errorData.error || errorData.message || 'Compilation failed',
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
          // Use proportional scoring: each test case contributes equally
          totalScore += 1; // Count passed tests, will calculate final score later
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

      // Calculate final score as percentage of passed tests
      const passedTests = totalScore; // totalScore now represents number of passed tests
      const totalTests = testCases.length;
      const scorePercentage = totalTests > 0 ? passedTests / totalTests : 0;
      const finalScore = Math.round(scorePercentage * 100); // Convert to percentage (0-100)

      return {
        success: true,
        testResults,
        totalScore: finalScore,
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
      import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
    const languageId =
      JUDGE0_LANGUAGE_IDS[language as keyof typeof JUDGE0_LANGUAGE_IDS];

    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const testResults: TestResult[] = [];
    let totalScore = 0;
    let totalExecutionTime = 0;

    try {
      console.log('🔄 Starting Judge0 execution for', testCases.length, 'test cases');
      
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`🧪 Processing test case ${i + 1}:`, {
          id: testCase?.id,
          hasInput: !!testCase?.input,
          hasOutput: !!testCase?.output,
          hasExpectedOutput: !!(testCase as any)?.expectedOutput,
          properties: Object.keys(testCase || {}),
          testCase: testCase
        });
        
        if (!testCase || !testCase.id) {
          console.error('❌ Invalid test case encountered:', testCase);
          testResults.push({
            testCaseId: 'unknown',
            passed: false,
            actualOutput: '',
            executionTime: 0,
            error: 'Test case is missing or has no ID',
          });
          continue;
        }

        const startTime = Date.now();
        console.log(`📤 Sending request to ${serverUrl}/api/judge0/compile`);

        const response = await fetch(`${serverUrl}/api/judge0/compile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language_id: languageId,
            source_code: code,
            stdin: testCase.input,
            expected_output: testCase.output || (testCase as any).expectedOutput,
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
            error:
              errorData.error || errorData.message || 'Judge0 request failed',
          });
          continue;
        }

        const responseData = await response.json();
        console.log(`📥 Raw server response for test case ${i + 1}:`, responseData);
        
        // Extract the actual Judge0 result from the server response
        const result: Judge0Response = responseData.output || responseData;
        console.log(`📥 Judge0 response for test case ${i + 1}:`, result);
        console.log(`🔍 Response structure check:`, {
          hasStatus: !!result.status,
          hasStatusId: !!result.status?.id,
          statusValue: result.status,
          responseKeys: Object.keys(result)
        });

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
        if (!result.status || result.status.id !== 3) {
          // 3 = Accepted
          let errorMessage = result.status?.description || 'Unknown execution error';
          if (result.status?.id === 5) errorMessage = 'Time Limit Exceeded';
          else if (result.status?.id === 6) errorMessage = 'Compilation Error';
          else if (result.status?.id === 7)
            errorMessage = 'Runtime Error (SIGSEGV)';
          else if (result.status?.id === 8)
            errorMessage = 'Runtime Error (SIGXFSZ)';
          else if (result.status?.id === 9)
            errorMessage = 'Runtime Error (SIGFPE)';
          else if (result.status?.id === 10)
            errorMessage = 'Runtime Error (SIGABRT)';
          else if (result.status?.id === 11)
            errorMessage = 'Runtime Error (NZEC)';
          else if (result.status?.id === 12)
            errorMessage = 'Runtime Error (Other)';
          else if (result.status?.id === 13) errorMessage = 'Internal Error';
          else if (result.status?.id === 14) errorMessage = 'Exec Format Error';

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
        const expectedOutput = (testCase.output || (testCase as any).expectedOutput || '').trim();
        const passed = actualOutput === expectedOutput;

        if (passed) {
          // Use proportional scoring: each test case contributes equally
          // regardless of individual test case points
          totalScore += 1; // Count passed tests, will calculate final score later
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

      // Calculate final score as percentage of passed tests
      const passedTests = totalScore; // totalScore now represents number of passed tests
      const totalTests = testCases.length;
      const scorePercentage = totalTests > 0 ? passedTests / totalTests : 0;
      
      // Note: Final score will be calculated in submitSolution based on challenge.metadata.points
      // For now, return the percentage (0-1) as totalScore
      const finalScore = Math.round(scorePercentage * 100); // Convert to percentage (0-100)

      return {
        success: true,
        testResults,
        totalScore: finalScore,
        executionTime: totalExecutionTime,
      };
    } catch (error: any) {
      console.error('❌ Judge0 execution failed with error:', error);
      console.error('Error stack:', error.stack);
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
        executionResult.success && allPassed ? 'completed' : 'failed';
      
      // Calculate actual score based on challenge points and percentage passed
      const scorePercentage = executionResult.totalScore / 100; // Convert from 0-100 to 0-1
      const actualScore = Math.round(challenge.metadata.points * scorePercentage);
      
      console.log('🧪 Submission status determination:', {
        executionSuccess: executionResult.success,
        allTestsPassed: allPassed,
        scorePercentage: scorePercentage,
        challengePoints: challenge.metadata.points,
        actualScore: actualScore,
        testResults: executionResult.testResults.map(t => ({ 
          id: t.testCaseId, 
          passed: t.passed,
          error: t.error 
        })),
        finalStatus: status
      });

      // Create submission document
      const submissionDoc = {
        userId,
        challengeId,
        language,
        code,
        status: status as 'completed' | 'failed',
        score: actualScore,
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

      // Note: User stats, achievements, and rankings are now automatically handled 
      // by the submission-processor Appwrite Function when a submission is created
      if (status === 'completed') {
        console.log('🏆 Challenge completed! Functions will process stats and achievements...');
        
        // Trigger achievement check after a short delay to allow function processing
        setTimeout(() => {
          import('./achievementPollingService').then(({ achievementPollingService }) => {
            achievementPollingService.forceCheck();
          });
        }, 3000); // 3 second delay
      }

      // Return formatted submission
      return {
        id: response.$id,
        challengeId,
        userId,
        code,
        status: status as 'completed' | 'failed',
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

  /**
   * Legacy method - now handled by submission-processor Appwrite Function
   * This method provides immediate user stats updates as a fallback
   */
  async updateUserStatsLegacy(
    userId: string,
    challengeId: string,
    points: number
  ): Promise<void> {
    try {
      console.log('🔄 Updating user stats for:', { userId, challengeId, points });
      
      // Get current user info
      const user = await account.get();
      console.log('👤 Current user:', { id: user.$id, name: user.name, email: user.email });
      
      // Try to get existing user stats
      const existingStats = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', userId)]
      );
      
      console.log('📊 Existing stats query result:', {
        found: existingStats.documents.length,
        databaseId: DATABASE_ID,
        collectionId: COLLECTIONS.USERS,
        queryUserId: userId
      });

      if (existingStats.documents.length > 0) {
        // Update existing stats
        const stats = existingStats
          .documents[0] as unknown as UserStatsDocument;
        const solvedChallenges = stats.solvedChallenges.includes(challengeId)
          ? stats.solvedChallenges
          : [...stats.solvedChallenges, challengeId];

        console.log('📈 Updating existing stats:', {
          oldStats: {
            totalSubmissions: stats.totalSubmissions,
            successfulSubmissions: stats.successfulSubmissions,
            totalPoints: stats.totalPoints,
            solvedChallenges: stats.solvedChallenges.length
          },
          newValues: {
            totalSubmissions: stats.totalSubmissions + 1,
            successfulSubmissions: stats.successfulSubmissions + 1,
            totalPoints: stats.totalPoints + points,
            solvedChallenges: solvedChallenges.length
          }
        });

        // Calculate streak for existing user
        const { currentStreak, maxStreak } = this.calculateStreak(stats);
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

        const updateResult = await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          stats.$id,
          {
            profilePicture: (user.prefs as any)?.profileImage || stats.profilePicture,
            totalSubmissions: stats.totalSubmissions + 1,
            successfulSubmissions: stats.successfulSubmissions + 1,
            totalPoints: stats.totalPoints + points,
            solvedChallenges,
            lastActive: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            weeklyPoints: stats.weeklyPoints + points,
            monthlyPoints: stats.monthlyPoints + points,
            starPoints: stats.starPoints + points,
            currentStars: (stats.starPoints + points) >= 30 ? 7 : (stats.starPoints + points) >= 25 ? 5 : (stats.starPoints + points) >= 15 ? 3 : (stats.starPoints + points) >= 5 ? 2 : 1,
            starTitle: (stats.starPoints + points) >= 30 ? 'ZMaster' : (stats.starPoints + points) >= 25 ? 'Expert' : (stats.starPoints + points) >= 15 ? 'Rookie' : (stats.starPoints + points) >= 5 ? 'Pookie' : 'Noob',
            currentStreak,
            maxStreak,
            lastSolvedDate: today,
          }
        );
        
        console.log('✅ Stats updated successfully:', updateResult.$id);
      } else {
        // Create new user stats
        console.log('🆕 Creating new user stats document');
        
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const createResult = await databases.createDocument(
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
            globalRank: 0,
            weeklyRank: 0,
            monthlyRank: 0,
            weeklyPoints: points,
            monthlyPoints: points,
            lastActive: new Date().toISOString(),
            currentStreak: 1,
            maxStreak: 1,
            lastSolvedDate: today,
            avgSolveTime: 0,
            country: 'India',
            profilePicture: (user.prefs as any)?.profileImage || null,
            isPublic: true,
            starPoints: points,
            currentStars: points >= 7 ? 5 : points >= 5 ? 4 : points >= 3 ? 3 : points >= 2 ? 2 : 1,
            starTitle: points >= 7 ? 'ZMaster' : points >= 5 ? 'Expert' : points >= 3 ? 'Rookie' : points >= 2 ? 'Pookie' : 'Noob',
            easyChallengesSolved: 0,
            mediumChallengesSolved: 0,
            hardChallengesSolved: 0,
            achievements: [],
            badgesEarned: [],
            nextStarRequirement: points >= 7 ? 30 : points >= 5 ? 25 : points >= 3 ? 15 : points >= 2 ? 5 : 5,
          }
        );
        
        console.log('✅ New stats created successfully:', createResult.$id);
      }
    } catch (error) {
      console.error('❌ Error updating user stats:', error);
      console.error('Debug info:', {
        DATABASE_ID,
        USERS_COLLECTION: COLLECTIONS.USERS,
        userId,
        challengeId,
        points
      });
      // Don't throw error here - submission was successful even if stats update failed
    }
  }
}

export const challengeService = new ChallengeService();
