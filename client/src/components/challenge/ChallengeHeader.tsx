import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Trophy,
  Target,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import type { Challenge } from '@/types';
import { ChallengeTimerDisplay } from './ChallengeTimerDisplay';

interface ChallengeHeaderProps {
  challenge: Challenge;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  timerIsRunning?: boolean;
  timerFormattedTime?: string;
}

const getDifficultyStyles = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/10 text-green-400 border-green-500/30';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    case 'hard':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  }
};

export const ChallengeHeader: React.FC<ChallengeHeaderProps> = ({
  challenge,
  isFullscreen,
  onToggleFullscreen,
  timerIsRunning = false,
  timerFormattedTime = '00:00',
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
      <div className="max-w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/challenges')}
              className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
              <span className="hidden sm:block">Back</span>
            </button>
            <div className="w-px h-6 bg-gray-700" />
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-yellow-400" />
              <h1 className="text-lg font-bold text-white truncate max-w-[300px]">
                {challenge.metadata.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Challenge Timer */}
            <ChallengeTimerDisplay
              isRunning={timerIsRunning}
              formattedTime={timerFormattedTime}
            />
            
            <div
              className={`px-3 py-1 rounded-full border text-xs font-medium ${getDifficultyStyles(challenge.metadata.difficulty)}`}
            >
              {challenge.metadata.difficulty.toUpperCase()}
            </div>
            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {challenge.metadata.points}
              </span>
            </div>
            <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{challenge.metadata.timeLimit}m</span>
            </div>
            <button
              onClick={onToggleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
