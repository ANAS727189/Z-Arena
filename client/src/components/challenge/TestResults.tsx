import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface TestResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  executionTime: number;
  error?: string;
}

interface TestResultsProps {
  testResults: TestResult[];
  challenge: any;
  onClose: () => void;
}

export const TestResults: React.FC<TestResultsProps> = ({
  testResults,
  challenge,
  onClose,
}) => {
  if (!testResults.length) return null;

  // Check if it's an error result
  const isError =
    testResults.length === 1 && testResults[0].testCaseId === 'error';

  return (
    <div className="bg-gray-900/95 border-t border-gray-700 flex flex-col max-h-72">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-white font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          Test Results
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {isError ? (
          <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-red-400 font-medium mb-1">
                Compilation Error
              </div>
              <div className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                {testResults[0].error}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => {
              const testCase = challenge.testCases[index];
              const isPassed = result.passed;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isPassed
                      ? 'bg-green-900/20 border-green-500/30'
                      : 'bg-red-900/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isPassed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-white font-medium">
                        Test Case {index + 1}
                      </span>
                      {isPassed && (
                        <span className="text-green-400 text-sm">Passed</span>
                      )}
                      {!isPassed && (
                        <span className="text-red-400 text-sm">Failed</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {result.executionTime}ms
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-gray-400 mb-1">Input:</div>
                      <div className="bg-gray-800 p-2 rounded font-mono text-gray-200 whitespace-pre-wrap">
                        {testCase?.input || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-400 mb-1">Expected Output:</div>
                      <div className="bg-gray-800 p-2 rounded font-mono text-gray-200 whitespace-pre-wrap">
                        {testCase?.output || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-400 mb-1">Your Output:</div>
                      <div
                        className={`p-2 rounded font-mono whitespace-pre-wrap ${
                          isPassed
                            ? 'bg-green-900/30 text-green-200'
                            : 'bg-red-900/30 text-red-200'
                        }`}
                      >
                        {result.actualOutput ||
                          (result.error ? 'Runtime Error' : 'No output')}
                      </div>
                    </div>

                    {result.error && (
                      <div>
                        <div className="text-red-400 mb-1">Error:</div>
                        <div className="bg-red-900/30 p-2 rounded font-mono text-red-200 whitespace-pre-wrap">
                          {result.error}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
