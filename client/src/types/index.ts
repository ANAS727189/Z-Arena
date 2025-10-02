export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit: number; // in minutes
  testCases: TestCase[];
  starterCode: string;
  tags: string[];
  totalSubmissions: number;
  successfulSubmissions: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
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