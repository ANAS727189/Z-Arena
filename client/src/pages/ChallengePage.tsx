import React from 'react';
import { useChallenge } from '@/hooks/useChallenge';
import { AuthModal } from '@/components/AuthModal';
import {
  ChallengeHeader,
  ProblemDescription,
  CodeEditorPanel,
  LoadingState,
  ErrorState,
  TimerWarningModal,
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
    handleStartChallenge,
    handleBackToMenu,
    showTimerWarning,
    timer,
    testResults,
    showTestResults,
    setShowTestResults,
    submissionResult,
    showSubmissionResult,
    navigate,
    userHasSolved,
    userSubmissions,
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
        timerIsRunning={timer.isRunning}
        timerFormattedTime={timer.formattedTime}
      />

      <TimerWarningModal
        isOpen={showTimerWarning}
        challengeTitle={challenge?.metadata?.title || 'Challenge'}
        onContinue={handleStartChallenge}
        onBack={handleBackToMenu}
      />

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {!isFullscreen && (
          <div className="w-1/2 flex flex-col">
            <ProblemDescription
              challenge={challenge}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              submissionResult={submissionResult}
              showSubmissionResult={showSubmissionResult}
              userHasSolved={userHasSolved}
              userSubmissions={userSubmissions}
            />
          </div>
        )}

        <div className={`${isFullscreen ? 'w-full' : 'w-1/2'} flex flex-col`}>
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
            testResults={testResults}
            showTestResults={showTestResults}
            setShowTestResults={setShowTestResults}
          />
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
