import { Trophy, Clock, Users, ArrowRight } from 'lucide-react';
import type { Challenge } from '@/types';

interface ChallengeCardProps {
  challenge: Challenge;
  onChallengeClick: (id: string) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onChallengeClick,
}) => {
  const getSuccessRate = (challenge: Challenge) => {
    if (!challenge.stats || challenge.stats.totalSubmissions === 0) {
      return 0;
    }
    return Math.round(
      (challenge.stats.successfulSubmissions /
        challenge.stats.totalSubmissions) *
        100
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'border-green-500 text-green-400 bg-green-500/10';
      case 'medium':
        return 'border-yellow-500 text-yellow-400 bg-yellow-500/10';
      case 'hard':
        return 'border-red-500 text-red-400 bg-red-500/10';
      default:
        return 'border-gray-500 text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div
      key={challenge.id}
      className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 hover:border-[var(--accent-purple)]/50 transition-all cursor-pointer group"
      onClick={() => onChallengeClick(challenge.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-heading text-xl font-bold text-white group-hover:text-[var(--accent-cyan)] transition-colors">
              {challenge.metadata.title}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.metadata.difficulty)}`}
            >
              {challenge.metadata.difficulty}
            </span>
          </div>

          <p className="font-body text-[var(--text-secondary)] mb-4 line-clamp-2">
            {challenge.metadata.description.split('\n')[0]}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {challenge.metadata.tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-[var(--background-primary)] text-[var(--text-secondary)] text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
            {challenge.metadata.tags.length > 4 && (
              <span className="px-2 py-1 bg-[var(--background-primary)] text-[var(--text-secondary)] text-xs rounded-md">
                +{challenge.metadata.tags.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center space-x-6 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>{challenge.metadata.points} pts</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{challenge.metadata.timeLimit} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>
                {challenge.stats?.totalSubmissions?.toLocaleString() || 0}{' '}
                attempts
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-green-400">
                {getSuccessRate(challenge)}% success
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {challenge.metadata.points}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">points</div>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};
