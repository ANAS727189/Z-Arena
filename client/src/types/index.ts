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
  status: 'pending' | 'running' | 'completed' | 'failed';
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

// War Feature Interfaces
export interface WarMatch {
  $id: string;
  matchId: string;
  player1Id: string;
  player2Id: string;
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  challenges: string[]; // Array of challenge IDs
  startTime: string;
  endTime?: string;
  winnerId?: string;
  player1FinalScore: number;
  player2FinalScore: number;
  player1EloChange: number;
  player2EloChange: number;
  player1EloBefore: number;
  player2EloBefore: number;
  timeLimit: number;
  matchType?: string;
  region: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface WarChallenge {
  challengeId: string;
  challengeIndex: number;
  player1Code?: string;
  player2Code?: string;
  player1Score: number;
  player2Score: number;
  player1Time: number;
  player2Time: number;
  player1Status: 'pending' | 'submitted' | 'completed';
  player2Status: 'pending' | 'submitted' | 'completed';
}

export interface WarQueue {
  $id: string;
  userId: string;
  eloRating: number;
  queuedAt: string;
  status: 'waiting' | 'matched' | 'cancelled';
  preferredLanguages: string[];
  region: string;
  maxWaitTime?: number;
  expandedRange: number;
  $createdAt: string;
  $updatedAt: string;
}

export interface WarLeaderboard {
  $id: string;
  userId: string;
  eloRating: number;
  warWins: number;
  warLosses: number;
  warDraws: number;
  warStreak: number;
  bestWarStreak: number;
  warRank: number;
  totalWarGames: number;
  winPercentage: number;
  avgOpponentElo: number;
  lastMatchAt?: string;
  isProvisional: boolean;
  lastUpdated: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface WarMatchHistory {
  $id: string;
  matchId: string;
  userId: string;
  opponentId: string;
  result: 'win' | 'loss' | 'draw';
  userScore: number;
  opponentScore: number;
  userEloBefore: number;
  userEloAfter: number;
  eloChange: number;
  opponentEloBefore: number;
  challengesSolved: number;
  totalChallenges: number;
  matchDuration: number;
  averageTime: number;
  matchDate: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface WarChallengeAttempt {
  $id: string;
  matchId: string;
  userId: string;
  challengeId: string;
  challengeIndex: number;
  code: string;
  language: string;
  status: 'pending' | 'submitted' | 'completed' | 'failed';
  score: number;
  runtime: number;
  testResults?: string;
  submittedAt?: string;
  completedAt?: string;
  timeSpent: number;
  attempts: number;
  $createdAt: string;
  $updatedAt: string;
}
