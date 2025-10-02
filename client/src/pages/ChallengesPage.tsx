import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, Users, Trophy, Code2, ArrowRight } from 'lucide-react';
import { sampleChallenges, getDifficultyColor } from '../data/challenges';
import type { Challenge } from '../types';

export const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Challenge['difficulty'] | 'all'>('all');

  const filteredChallenges = sampleChallenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getSuccessRate = (challenge: Challenge) => {
    return Math.round((challenge.successfulSubmissions / challenge.totalSubmissions) * 100);
  };

  return (
    <div className="min-h-screen bg-[var(--background-primary)]">
      {/* Navigation */}
      <nav className="bg-[var(--background-secondary)] border-b border-[var(--border-primary)] px-4 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-lg font-bold text-white">Z-Challenge</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => navigate('/challenges')}
              className="text-white font-medium"
            >
              Challenges
            </button>
            <button 
              onClick={() => navigate('/leaderboard')}
              className="text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Leaderboard
            </button>
            <button className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Code Challenges
          </h1>
          <p className="font-body text-xl text-[var(--text-secondary)] mb-6">
            Master the Z-- programming language through hands-on challenges
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search challenges, tags, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[var(--text-secondary)] focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)]/20 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as Challenge['difficulty'] | 'all')}
                  className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg px-4 py-2 text-white focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)]/20 transition-all outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Grid */}
        <div className="grid gap-6">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 hover:border-[var(--accent-purple)]/50 transition-all cursor-pointer group"
              onClick={() => navigate(`/challenge/${challenge.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-heading text-xl font-bold text-white group-hover:text-[var(--accent-cyan)] transition-colors">
                      {challenge.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  
                  <p className="font-body text-[var(--text-secondary)] mb-4 line-clamp-2">
                    {challenge.description.split('\n')[0]}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {challenge.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[var(--background-primary)] text-[var(--text-secondary)] text-xs rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                    {challenge.tags.length > 4 && (
                      <span className="px-2 py-1 bg-[var(--background-primary)] text-[var(--text-secondary)] text-xs rounded-md">
                        +{challenge.tags.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4" />
                      <span>{challenge.points} pts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{challenge.timeLimit} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{challenge.totalSubmissions.toLocaleString()} attempts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-green-400">{getSuccessRate(challenge)}% success</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{challenge.points}</div>
                    <div className="text-xs text-[var(--text-secondary)]">points</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--background-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-2">No challenges found</h3>
            <p className="font-body text-[var(--text-secondary)]">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};