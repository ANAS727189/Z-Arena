import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { challengeService } from '@/services/challengeService';
import { seedChallenges } from '@/utils/seedChallenges';
import { useAuth } from '@/hooks/useAuth';
import { ChallengesCache } from '@/utils/challengesCache';
import type { Challenge } from '@/types';

export const useChallenges = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Challenges data
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Challenge['metadata']['difficulty'] | 'all'
  >('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  // UI states
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load challenges from cache first, then from Appwrite if needed
  useEffect(() => {
    async function fetchChallenges() {
      try {
        // First, try to load from cache
        const cachedChallenges = ChallengesCache.getCachedChallenges();
        if (cachedChallenges && cachedChallenges.length > 0) {
          console.log('📚 Loading challenges from cache');
          setChallenges(cachedChallenges);
          setLoading(false);
          setError(null);
          return;
        }

        // If no cache or cache is invalid, fetch from database
        console.log('🔄 Loading challenges from database');
        const loadedChallenges = await challengeService.getChallenges();
        setChallenges(loadedChallenges);
        setError(null);
        
        // Cache the loaded challenges
        if (loadedChallenges.length > 0) {
          ChallengesCache.setCachedChallenges(loadedChallenges);
        }
      } catch (error: any) {
        console.error('Failed to load challenges from database:', error);

        // Set user-friendly error message
        if (
          error.message?.includes('not authorized') ||
          error.message?.includes('401')
        ) {
          setError(
            '⚠️ Permission error: Please check Appwrite collection permissions. Challenges collection needs "any" read permission.'
          );
        } else if (error.message?.includes('not found')) {
          setError(
            '❌ Database or collection not found. Please check your Appwrite configuration.'
          );
        } else {
          setError(
            `🚨 Failed to load challenges: ${error.message || 'Unknown error'}`
          );
        }
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  // Load user's solved challenges
  useEffect(() => {
    async function fetchUserStats() {
      if (user) {
        try {
          const userStats = await challengeService.getUserStats(user.$id);
          setSolvedChallenges(userStats?.solvedChallenges || []);
        } catch (error) {
          console.error('Failed to load user stats:', error);
          setSolvedChallenges([]);
        }
      } else {
        setSolvedChallenges([]);
      }
    }

    fetchUserStats();
  }, [user]);

  // Filter challenges based on search criteria
  const filteredChallenges = challenges.filter(challenge => {
    // Search filter
    if (
      searchTerm &&
      !challenge.metadata.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      !challenge.metadata.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      !challenge.metadata.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    // Difficulty filter
    if (
      selectedDifficulty !== 'all' &&
      challenge.metadata.difficulty !== selectedDifficulty
    ) {
      return false;
    }

    // Language filter
    if (
      selectedLanguage !== 'all' &&
      !challenge.metadata.supportedLanguages?.includes(selectedLanguage)
    ) {
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
      // Clear cache since we're adding new challenges
      ChallengesCache.clearCache();
      // Refresh challenges after seeding
      const loadedChallenges = await challengeService.getChallenges();
      setChallenges(loadedChallenges);
      // Update cache with new challenges
      if (loadedChallenges.length > 0) {
        ChallengesCache.setCachedChallenges(loadedChallenges);
      }
    } catch (error) {
      console.error('Failed to seed challenges:', error);
    } finally {
      setSeeding(false);
    }
  };

  // Navigation handlers
  const handleNavigateHome = () => navigate('/');
  const handleNavigateChallenges = () => navigate('/challenges');
  const handleNavigateLeaderboard = () => navigate('/leaderboard');
  const handleChallengeClick = (id: string) => navigate(`/challenge/${id}`);

  // Auth handlers
  const handleSignIn = () => setShowAuthModal(true);
  const handleSignOut = () => logout();
  const handleCloseAuthModal = () => setShowAuthModal(false);

  // Refresh challenges from database (clears cache)
  const handleRefreshChallenges = async () => {
    setLoading(true);
    try {
      ChallengesCache.clearCache();
      const loadedChallenges = await challengeService.getChallenges();
      setChallenges(loadedChallenges);
      setError(null);
      if (loadedChallenges.length > 0) {
        ChallengesCache.setCachedChallenges(loadedChallenges);
      }
    } catch (error: any) {
      console.error('Failed to refresh challenges:', error);
      setError(`Failed to refresh challenges: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter handlers
  const handleSearchChange = (value: string) => setSearchTerm(value);
  const handleDifficultyChange = (
    value: Challenge['metadata']['difficulty'] | 'all'
  ) => setSelectedDifficulty(value);
  const handleLanguageChange = (value: string) => setSelectedLanguage(value);

  return {
    // Data
    challenges: filteredChallenges,
    loading,
    error,
    seeding,
    user,
    supportedLanguages,
    showAuthModal,
    solvedChallenges,

    // Filter states
    searchTerm,
    selectedDifficulty,
    selectedLanguage,

    // Handlers
    handleSeedChallenges,
    handleRefreshChallenges,
    handleNavigateHome,
    handleNavigateChallenges,
    handleNavigateLeaderboard,
    handleChallengeClick,
    handleSignIn,
    handleSignOut,
    handleCloseAuthModal,
    handleSearchChange,
    handleDifficultyChange,
    handleLanguageChange,
  };
};
