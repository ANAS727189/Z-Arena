import React from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  AlertTriangle,
} from 'lucide-react';

interface SubmissionResultProps {
  submissionResult: any;
  challenge: any;
}

export const SubmissionResult: React.FC<SubmissionResultProps> = ({
  submissionResult,
  challenge,
}) => {
  if (!submissionResult) return null;

  const isCompleted = submissionResult.status === 'completed';
  const hasError = submissionResult.error;

  const passedTests =
    submissionResult.testResults?.filter((r: any) => r.passed).length || 0;
  const totalTests = submissionResult.testResults?.length || 0;
  const successRate =
    totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Your Solution</h2>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isCompleted
              ? 'bg-green-900/30 text-green-400 border border-green-500/30'
              : 'bg-red-900/30 text-red-400 border border-red-500/30'
          }`}
        >
          {isCompleted ? 'Accepted' : 'Failed'}
        </div>
      </div>

      {/* Overall Result */}
      <div
        className={`p-4 rounded-lg border ${
          isCompleted
            ? 'bg-green-900/20 border-green-500/30'
            : 'bg-red-900/20 border-red-500/30'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-green-400" />
          ) : (
            <XCircle className="w-6 h-6 text-red-400" />
          )}
          <div>
            <div className="text-white font-medium">
              {isCompleted ? '🎉 Congratulations!' : '❌ Solution Failed'}
            </div>
            <div className="text-gray-300 text-sm">
              {isCompleted
                ? `All test cases passed! You've earned ${submissionResult.score} points.`
                : hasError
                  ? submissionResult.error
                  : `${passedTests}/${totalTests} test cases passed`}
            </div>
          </div>
        </div>

        {/* Stats */}
        {!hasError && (
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-600">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {successRate}%
              </div>
              <div className="text-xs text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4" />
                {submissionResult.score}
              </div>
              <div className="text-xs text-gray-400">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                {submissionResult.executionTime || 0}ms
              </div>
              <div className="text-xs text-gray-400">Runtime</div>
            </div>
          </div>
        )}
      </div>

      {/* Test Results Details */}
      {!hasError &&
        submissionResult.testResults &&
        submissionResult.testResults.length > 0 && (
          <div>
            <h3 className="text-white font-medium mb-4">
              Test Cases ({passedTests}/{totalTests} passed)
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {submissionResult.testResults.map(
                (result: any, index: number) => {
                  const testCase = challenge.testCases[index];
                  const isPassed = result.passed;

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        isPassed
                          ? 'bg-green-900/10 border-green-500/20'
                          : 'bg-red-900/10 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {isPassed ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-white text-sm font-medium">
                            Test Case {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock className="w-3 h-3" />
                          {result.executionTime}ms
                        </div>
                      </div>

                      {!isPassed && (
                        <div className="space-y-2 text-xs">
                          {testCase && !testCase.isHidden && (
                            <>
                              <div>
                                <span className="text-gray-400">Input: </span>
                                <span className="text-gray-300 font-mono">
                                  {testCase.input}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">
                                  Expected:{' '}
                                </span>
                                <span className="text-gray-300 font-mono">
                                  {testCase.output}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">
                                  Your Output:{' '}
                                </span>
                                <span className="text-red-300 font-mono">
                                  {result.actualOutput || 'No output'}
                                </span>
                              </div>
                            </>
                          )}
                          {testCase && testCase.isHidden && (
                            <div className="text-gray-400">
                              Hidden test case - Details not shown
                            </div>
                          )}
                          {result.error && (
                            <div>
                              <span className="text-red-400">Error: </span>
                              <span className="text-red-300 font-mono text-xs">
                                {result.error}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

      {/* Error Details */}
      {hasError && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-red-400 font-medium mb-1">
                Submission Error
              </div>
              <div className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                {submissionResult.error}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
