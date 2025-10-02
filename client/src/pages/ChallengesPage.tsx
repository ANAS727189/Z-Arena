import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, Users, Trophy, Code2, ArrowRight, Loader2, Database, LogOut } from 'lucide-react';
import { challengeService } from '@/services/challengeService';
import { useAuth } from '@/hooks/useAuth';
import { seedChallenges } from '@/utils/seedChallenges';
import { AuthModal } from '@/components/AuthModal';
import type { Challenge } from '../types';

export const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Challenge['metadata']['difficulty'] | 'all'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [seeding, setSeeding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load challenges from Appwrite
  useEffect(() => {
    async function fetchChallenges() {
      try {
        const loadedChallenges = await challengeService.getChallenges();
        setChallenges(loadedChallenges);
        setError(null);
      } catch (error: any) {
        console.error('Failed to load challenges from database:', error);
        
        // Set user-friendly error message
        if (error.message?.includes('not authorized') || error.message?.includes('401')) {
          setError('⚠️ Permission error: Please check Appwrite collection permissions. Challenges collection needs "any" read permission.');
        } else if (error.message?.includes('not found')) {
          setError('❌ Database or collection not found. Please check your Appwrite configuration.');
        } else {
          setError(`🚨 Failed to load challenges: ${error.message || 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  // Filter challenges based on search criteria
  const filteredChallenges = challenges.filter(challenge => {
    // Search filter
    if (searchTerm && !challenge.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !challenge.metadata.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !challenge.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Difficulty filter
    if (selectedDifficulty !== 'all' && challenge.metadata.difficulty !== selectedDifficulty) {
      return false;
    }
    
    // Language filter
    if (selectedLanguage !== 'all' && !challenge.metadata.supportedLanguages?.includes(selectedLanguage)) {
      return false;
    }
    
    return true;
  });

  // Get supported languages from all challenges
  const supportedLanguages = Array.from(
    new Set(challenges.flatMap(c => c.metadata.supportedLanguages || ['z--']))
  ).sort();

  // Seed challenges function
  const handleSeedChallenges = async () => {
    setSeeding(true);
    try {
      await seedChallenges();
      // Refresh challenges after seeding
      const loadedChallenges = await challengeService.getChallenges();
      setChallenges(loadedChallenges);
    } catch (error) {
      console.error('Failed to seed challenges:', error);
    } finally {
      setSeeding(false);
    }
  };

  const getSuccessRate = (challenge: Challenge) => {
    if (!challenge.stats || challenge.stats.totalSubmissions === 0) {
      return 0;
    }
    return Math.round((challenge.stats.successfulSubmissions / challenge.stats.totalSubmissions) * 100);
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
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
              Code Challenges
            </h1>
            {/* Development Seeding Button */}
            {import.meta.env.DEV && (
              <button
                onClick={handleSeedChallenges}
                disabled={seeding}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {seeding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Seed DB
                  </>
                )}
              </button>
            )}
          </div>
          <p className="font-body text-xl text-[var(--text-secondary)] mb-6">
            Master programming through hands-on challenges across multiple languages
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
            
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as Challenge['metadata']['difficulty'] | 'all')}
                  className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg px-4 py-2 text-white focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)]/20 transition-all outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-[var(--text-secondary)]" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg px-4 py-2 text-white focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)]/20 transition-all outline-none"
                >
                  <option value="all">All Languages</option>
                  {supportedLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === 'z--' ? 'Z--' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 text-[var(--accent-purple)] animate-spin" />
              <span className="text-white font-medium">Loading challenges...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-2xl mx-auto mt-12 p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">Configuration Error</h3>
                <p className="text-red-200 text-sm leading-relaxed mb-4">{error}</p>
                <div className="bg-red-950/50 p-3 rounded text-xs text-red-300">
                  <strong>Quick Fix:</strong> Go to Appwrite Console → Databases → challenges collection → Settings → Update Permissions → Set Read permission to "any"
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Challenge Grid */}
        {!loading && !error && (
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
                      {challenge.metadata.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.metadata.difficulty)}`}>
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
                      <span>{challenge.stats?.totalSubmissions?.toLocaleString() || 0} attempts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-green-400">{getSuccessRate(challenge)}% success</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{challenge.metadata.points}</div>
                    <div className="text-xs text-[var(--text-secondary)]">points</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {!loading && filteredChallenges.length === 0 && (
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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};