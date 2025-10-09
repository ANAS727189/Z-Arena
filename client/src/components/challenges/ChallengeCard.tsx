import { Trophy, Clock, Users, ArrowRight, BarChart2, CheckCircle } from 'lucide-react';
import type { Challenge } from '@/types';
import { motion } from 'framer-motion';

interface ChallengeCardProps {
  challenge: Challenge;
  onChallengeClick: (id: string) => void;
  solved: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onChallengeClick,
  solved,
}) => {
  const { title, description, tags, difficulty, points, timeLimit } = challenge.metadata;
  const { totalSubmissions, successfulSubmissions } = challenge.stats || {};
  
  const successRate =
    (totalSubmissions ?? 0) > 0
      ? Math.round(((successfulSubmissions ?? 0) / (totalSubmissions ?? 1)) * 100)
      : 0;

  const difficultyConfig = {
    easy: { className: 'text-green-400 bg-green-500/10 border-green-500/20', label: 'Easy' },
    medium: { className: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', label: 'Medium' },
    hard: { className: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Hard' },
  };
  const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || { className: 'text-gray-400 bg-gray-500/10 border-gray-500/20', label: 'Unknown' };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <motion.div
      variants={itemVariants}
      onClick={() => onChallengeClick(challenge.id)}
      className="group relative flex flex-col h-full rounded-xl border border-white/10 bg-gray-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-green-400/60 hover:-translate-y-1 cursor-pointer"
    >
      {/* Glow effect on hover */}
      <div className="absolute top-0 left-0 h-full w-full bg-green-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl z-0"></div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top section: Title, Description, Tags */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">{title}</h3>
                {solved ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Solved
                    </span>
                ): (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-500/10 px-2 py-1 rounded-full border border-gray-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        Unsolved
                    </span>
                )}
            </div>
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
              {config.label}
            </span>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{description.split('\n')[0]}</p>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-md">
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-md">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Bottom section: Stats and CTA */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-end justify-between">
          <div className="flex gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2 text-yellow-400" title="Points">
              <Trophy className="w-4 h-4" />
              <span className="font-mono font-semibold">{points} pts</span>
            </div>
            <div className="flex items-center gap-2 text-green-400" title="Success Rate">
              <BarChart2 className="w-4 h-4" />
              <span className="font-mono font-semibold">{successRate}%</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400" title="Total Attempts">
              <Users className="w-4 h-4" />
              <span className="font-mono">{totalSubmissions?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400" title="Time Limit">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{timeLimit}m</span>
            </div>
          </div>

          {/* Right-hand side CTA */}
          <div className="flex items-center gap-2 text-gray-400 group-hover:text-green-400 transition-colors">
            <span className="font-semibold text-sm hidden sm:inline">Solve</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};