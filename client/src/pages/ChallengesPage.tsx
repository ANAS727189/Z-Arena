import React, { useState } from 'react';
import { AuthModal } from '@/components/AuthModal';
import {
  ChallengesHeader,
  SearchAndFilters,
  ChallengeCard,
  LoadingState,
  ErrorState,
  EmptyState,
  ChallengesDataTable,
} from '@/components/challenges';
import { Button } from '@/components/ui/button';
import { TableIcon, GridIcon } from 'lucide-react';
import { useChallenges } from '@/hooks/useChallenges';

export const ChallengesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const {
    // Data
    challenges,
    loading,
    error,
    seeding,
    supportedLanguages,
    showAuthModal,

    // Filter states (still used for grid view)
    searchTerm,
    selectedDifficulty,
    selectedLanguage,

    // Handlers
    handleSeedChallenges,
    handleChallengeClick,
    handleCloseAuthModal,
    handleSearchChange,
    handleDifficultyChange,
    handleLanguageChange,
  } = useChallenges();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ChallengesHeader
          onSeedChallenges={handleSeedChallenges}
          seeding={seeding}
        />

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6 bg-black text-white">
          <div className="flex items-center gap-2 bg-black text-white rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-3"
            >
              <TableIcon className="w-4 h-4 mr-1" />
              Table
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <GridIcon className="w-4 h-4 mr-1" />
              Grid
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            {challenges.length} challenge{challenges.length !== 1 ? 's' : ''} available
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error State */}
        {!loading && error && <ErrorState error={error} />}

        {/* Content */}
        {!loading && !error && (
          <>
            {viewMode === 'table' ? (
              /* Table View */
              <ChallengesDataTable
                challenges={challenges}
                loading={loading}
                onChallengeClick={(challenge) => handleChallengeClick(challenge.id)}
              />
            ) : (
              /* Grid View */
              <>
                <SearchAndFilters
                  searchTerm={searchTerm}
                  selectedDifficulty={selectedDifficulty}
                  selectedLanguage={selectedLanguage}
                  supportedLanguages={supportedLanguages}
                  onSearchChange={handleSearchChange}
                  onDifficultyChange={handleDifficultyChange}
                  onLanguageChange={handleLanguageChange}
                />
                
                <div className="grid gap-6 mt-6">
                  {challenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onChallengeClick={handleChallengeClick}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && challenges.length === 0 && <EmptyState />}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={handleCloseAuthModal} />
    </>
  );
};
