import React from 'react';
import { useChallenge } from '@/hooks/useChallenge';
import { AuthModal } from '@/components/AuthModal';
import {
  ChallengeHeader,
  ProblemDescription,
  CodeEditorPanel,
  LoadingState,
  ErrorState,
} from '@/components/challenge';

export const ChallengePage: React.FC = () => {
  const {
    challenge,
    loading,
    selectedLanguage,
    code,
    setCode,
    submitting,
    testing,
    activeTab,
    setActiveTab,
    isFullscreen,
    setIsFullscreen,
    editorTheme,
    setEditorTheme,
    fontSize,
    setFontSize,
    showMinimap,
    setShowMinimap,
    expandedSections,
    showAuthModal,
    setShowAuthModal,
    handleLanguageChange,
    handleEditorDidMount,
    toggleSection,
    handleTestCode,
    handleSubmit,
    navigate,
  } = useChallenge();

  if (loading) {
    return <LoadingState loading={loading} />;
  }

  if (!challenge) {
    return <ErrorState onBackToChallenges={() => navigate('/challenges')} />;
  }

  return (
    <div
      className={`min-h-screen bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      <ChallengeHeader
        challenge={challenge}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      />

      <div className="flex h-[calc(100vh-64px)]">
        {!isFullscreen && (
          <ProblemDescription
            challenge={challenge}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}

        <CodeEditorPanel
          challenge={challenge}
          selectedLanguage={selectedLanguage}
          code={code}
          setCode={setCode}
          handleLanguageChange={handleLanguageChange}
          fontSize={fontSize}
          setFontSize={setFontSize}
          showMinimap={showMinimap}
          setShowMinimap={setShowMinimap}
          editorTheme={editorTheme}
          setEditorTheme={setEditorTheme}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          handleEditorDidMount={handleEditorDidMount}
          testing={testing}
          submitting={submitting}
          handleTestCode={handleTestCode}
          handleSubmit={handleSubmit}
        />
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
