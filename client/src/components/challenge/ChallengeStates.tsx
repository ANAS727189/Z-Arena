import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface LoadingStateProps {
  loading: boolean;
}

interface ErrorStateProps {
  onBackToChallenges: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex items-center gap-3 text-white">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading challenge...</span>
      </div>
    </div>
  );
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  onBackToChallenges,
}) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">
          Challenge Not Found
        </h1>
        <p className="text-gray-400 mb-6">
          The challenge you're looking for doesn't exist.
        </p>
        <button
          onClick={onBackToChallenges}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
        >
          Back to Challenges
        </button>
      </div>
    </div>
  );
};
