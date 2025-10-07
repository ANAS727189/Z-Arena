import React from 'react';
import {
  ChevronRight,
  ChevronDown,
  Settings,
  TestTube,
  FileText,
  Lightbulb,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
} from 'lucide-react';
import type { Challenge } from '@/types';
import { SubmissionResult } from './SubmissionResult';

interface ProblemDescriptionProps {
  challenge: Challenge;
  activeTab: 'description' | 'editorial' | 'submissions';
  setActiveTab: (tab: 'description' | 'editorial' | 'submissions') => void;
  expandedSections: {
    examples: boolean;
    constraints: boolean;
    hints: boolean;
  };
  toggleSection: (section: 'examples' | 'constraints' | 'hints') => void;
  submissionResult?: any;
  showSubmissionResult?: boolean;
  userHasSolved?: boolean;
  userSubmissions?: any[];
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  challenge,
  activeTab,
  setActiveTab,
  expandedSections,
  toggleSection,
  submissionResult,
  showSubmissionResult,
  userHasSolved = false,
  userSubmissions = [],
}) => {
  return (
    <div className="h-full border-r border-gray-700/50 bg-gray-900/50 backdrop-blur-sm overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-700/50 bg-gray-900/80">
        {(['description', 'editorial', 'submissions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-yellow-400 text-yellow-400 bg-yellow-400/5'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {tab === 'description' && <FileText className="w-4 h-4" />}
              {tab === 'editorial' && <Lightbulb className="w-4 h-4" />}
              {tab === 'submissions' && <User className="w-4 h-4" />}
              {tab}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'description' && (
          <>
            {/* Problem Statement */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-yellow-400 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Problem Statement
                </h2>
              </div>
              <div className="pl-4">
                <p className="text-gray-300 leading-relaxed text-base">
                  {challenge.problem.statement}
                </p>
              </div>
            </div>

            {/* Input/Output Format */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-green-400" />
                  Input Format
                </h3>
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">
                    {challenge.problem.inputFormat}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  Output Format
                </h3>
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">
                    {challenge.problem.outputFormat}
                  </p>
                </div>
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('constraints')}
                className="w-full flex items-center justify-between text-lg font-semibold text-white hover:text-yellow-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-red-400" />
                  Constraints
                </div>
                {expandedSections.constraints ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {expandedSections.constraints && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm whitespace-pre-line font-mono">
                    {challenge.problem.constraints}
                  </pre>
                </div>
              )}
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('examples')}
                className="w-full flex items-center justify-between text-lg font-semibold text-white hover:text-yellow-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-purple-400" />
                  Examples ({challenge.problem.examples.length})
                </div>
                {expandedSections.examples ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {expandedSections.examples && (
                <div className="space-y-4">
                  {challenge.problem.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700/50">
                        <h4 className="text-sm font-medium text-yellow-400">
                          Example {index + 1}
                        </h4>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-xs font-medium text-green-400">
                                INPUT
                              </span>
                            </div>
                            <pre className="bg-black/50 border border-gray-700/50 rounded p-3 text-sm text-green-300 font-mono overflow-x-auto">
                              {example.input || '(no input)'}
                            </pre>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-xs font-medium text-blue-400">
                                OUTPUT
                              </span>
                            </div>
                            <pre className="bg-black/50 border border-gray-700/50 rounded p-3 text-sm text-blue-300 font-mono overflow-x-auto">
                              {example.output}
                            </pre>
                          </div>
                        </div>
                        {example.explanation && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <span className="text-xs font-medium text-yellow-400">
                                EXPLANATION
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hints */}
            {challenge.code?.hints && challenge.code.hints.length > 0 && (
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('hints')}
                  className="w-full flex items-center justify-between text-lg font-semibold text-white hover:text-yellow-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    Hints ({challenge.code.hints.length})
                  </div>
                  {expandedSections.hints ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.hints && (
                  <div className="space-y-3">
                    {challenge.code.hints.map((hint, index) => (
                      <div
                        key={index}
                        className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed flex-1">
                            {hint}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'editorial' && (
          <div className="space-y-4">
            {userHasSolved && challenge.editorial ? (
              <div className="space-y-6">
                {/* Editorial Header */}
                <div className="border-b border-gray-700/50 pb-4">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Editorial
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Detailed solution explanation and approach
                  </p>
                </div>

                {/* Editorial Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Approach
                    </h3>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {challenge.editorial.approach}
                      </p>
                    </div>
                  </div>

                  {/* Time & Space Complexity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                      <h4 className="text-blue-400 font-semibold mb-2">
                        Time Complexity
                      </h4>
                      <code className="text-blue-300 font-mono">
                        {challenge.editorial.complexity.time}
                      </code>
                    </div>
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                      <h4 className="text-purple-400 font-semibold mb-2">
                        Space Complexity
                      </h4>
                      <code className="text-purple-300 font-mono">
                        {challenge.editorial.complexity.space}
                      </code>
                    </div>
                  </div>

                  {/* Keywords */}
                  {challenge.editorial.keywords && challenge.editorial.keywords.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">
                        Key Concepts
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {challenge.editorial.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm border border-gray-600/50"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  {userHasSolved ? 'Editorial Not Available' : 'Editorial Locked'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {userHasSolved 
                    ? 'Editorial content is not available for this challenge yet.'
                    : 'Complete the challenge to unlock the editorial with detailed solution explanation.'
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-4">
            {/* Current Submission Result */}
            {showSubmissionResult && submissionResult && (
              <div className="border-b border-gray-700/50 pb-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Latest Submission
                </h3>
                <SubmissionResult
                  submissionResult={submissionResult}
                  challenge={challenge}
                />
              </div>
            )}

            {/* Previous Submissions */}
            {userSubmissions && userSubmissions.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Submission History
                </h3>
                <div className="space-y-3">
                  {userSubmissions.map((submission) => {
                    const isCompleted = submission.status === 'completed';
                    const submissionDate = new Date(submission.submittedAt || submission.$createdAt);
                    
                    return (
                      <div
                        key={submission.$id}
                        className={`p-4 rounded-lg border ${
                          isCompleted
                            ? 'bg-green-900/10 border-green-500/30'
                            : 'bg-red-900/10 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isCompleted
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {isCompleted ? 'Accepted' : 'Failed'}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {submission.language}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              <span>{submission.score || 0} pts</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{submissionDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Test Results Summary */}
                        {submission.testResults && (
                          <div className="text-sm text-gray-400">
                            {(() => {
                              try {
                                const testResults = JSON.parse(submission.testResults);
                                const passed = testResults.filter((t: any) => t.passed).length;
                                const total = testResults.length;
                                return `${passed}/${total} test cases passed`;
                              } catch {
                                return 'Test results unavailable';
                              }
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : !showSubmissionResult ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  No Submissions Yet
                </h3>
                <p className="text-gray-500 text-sm">
                  Submit your solution to see your submission history here.
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
