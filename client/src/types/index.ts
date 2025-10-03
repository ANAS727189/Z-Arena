export interface Challenge {
  id: string;
  metadata: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    timeLimit: number;
    tags: string[];
    author: string;
    createdAt: string;
    version: string;
    supportedLanguages?: string[]; // Optional for backward compatibility
  };
  problem: {
    statement: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string;
    examples: Array<{
      input: string;
      output: string;
      explanation: string;
    }>;
  };
  // Legacy languages structure (for backward compatibility)
  languages?: Record<
    string,
    {
      starterCode: string;
      solutionCode: string;
      hints: string[];
      judge0Id: number | null;
      compilerType: 'z-studio' | 'judge0';
    }
  >;
  // New simplified code structure
  code?: {
    starterCode: string;
    solutionCode: string;
    hints: string[];
  };
  testCases: TestCase[];
  editorial: {
    approach: string;
    complexity: {
      time: string;
      space: string;
    };
    keywords: string[];
  };
  // Runtime stats (managed by backend)
  stats?: {
    totalSubmissions: number;
    successfulSubmissions: number;
    averageScore: number;
  };
}

export interface TestCase {
  id: string;
  input: string;
  output: string;
  points: number;
  isHidden: boolean;
  timeout: number; // in milliseconds
}

export interface Submission {
  id: string;
  challengeId: string;
  userId: string;
  code: string;
  status: 'pending' | 'success' | 'failed' | 'timeout' | 'error';
  score: number;
  executionTime: number;
  createdAt: Date;
  testResults: TestResult[];
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  executionTime: number;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalScore: number;
  solvedChallenges: number;
  rank: number;
  joinedAt: Date;
}
