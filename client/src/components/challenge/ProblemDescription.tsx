import React from 'react';
import {
  ChevronRight,
  ChevronDown,
  Settings,
  TestTube,
  FileText,
  Lightbulb,
  User,
} from 'lucide-react';
import type { Challenge } from '@/types';

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
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  challenge,
  activeTab,
  setActiveTab,
  expandedSections,
  toggleSection,
}) => {
  return (
    <div className="w-1/2 border-r border-gray-700/50 bg-gray-900/50 backdrop-blur-sm overflow-hidden flex flex-col">
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
            <div className="text-center py-12">
              <Lightbulb className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">
                Editorial Coming Soon
              </h3>
              <p className="text-gray-500 text-sm">
                Complete the challenge to unlock the editorial with detailed
                solution explanation.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">
                Your Submissions
              </h3>
              <p className="text-gray-500 text-sm">
                Submit your solution to see your submission history here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
