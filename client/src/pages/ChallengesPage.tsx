import { AuthModal } from '@/components/AuthModal';
import {
  Navigation,
  ChallengesHeader,
  SearchAndFilters,
  ChallengeCard,
  LoadingState,
  ErrorState,
  EmptyState,
} from '@/components/challenges';
import { useChallenges } from '@/hooks/useChallenges';

export const ChallengesPage: React.FC = () => {
  const {
    // Data
    challenges,
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
  } = useChallenges();

  return (
    <div className="min-h-screen bg-[var(--background-primary)]">
      <Navigation
        user={user}
        onNavigateHome={handleNavigateHome}
        onNavigateChallenges={handleNavigateChallenges}
        onNavigateLeaderboard={handleNavigateLeaderboard}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <ChallengesHeader
          onSeedChallenges={handleSeedChallenges}
          seeding={seeding}
        />

        <SearchAndFilters
          searchTerm={searchTerm}
          selectedDifficulty={selectedDifficulty}
          selectedLanguage={selectedLanguage}
          supportedLanguages={supportedLanguages}
          onSearchChange={handleSearchChange}
          onDifficultyChange={handleDifficultyChange}
          onLanguageChange={handleLanguageChange}
        />

        {loading && <LoadingState />}

        {!loading && error && <ErrorState error={error} />}

        {!loading && !error && (
          <div className="grid gap-6">
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onChallengeClick={handleChallengeClick}
              />
            ))}
          </div>
        )}

        {!loading && challenges.length === 0 && <EmptyState />}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={handleCloseAuthModal} />
    </div>
  );
};
