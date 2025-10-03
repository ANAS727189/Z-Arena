import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { challengeService } from '@/services/challengeService';
import { seedChallenges } from '@/utils/seedChallenges';
import { useAuth } from '@/hooks/useAuth';
import type { Challenge } from '@/types';

export const useChallenges = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Challenges data
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Challenge['metadata']['difficulty'] | 'all'
  >('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  // UI states
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
      // Refresh challenges after seeding
      const loadedChallenges = await challengeService.getChallenges();
      setChallenges(loadedChallenges);
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

    // Filter states
    searchTerm,
    selectedDifficulty,
    selectedLanguage,

    // Handlers
    handleSeedChallenges,
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
