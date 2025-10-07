import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Target,
  Sword,
  Crown,
  Volume2,
  VolumeX,
  AlertTriangle
} from 'lucide-react';
import { CodeEditorPanel, ProblemDescription } from '@/components/challenge';
import type { WarMatch, Challenge } from '@/types';
import { WarService } from '@/services/warService';
import { client } from '@/lib/appwrite';
import { useAuth } from '@/hooks/useAuth';

interface BattleRoomProps {
  match: WarMatch;
  onMatchComplete: (result: 'victory' | 'defeat' | 'draw') => void;
  onLeaveMatch: () => void;
}

interface OpponentProgress {
  userId: string;
  challengesCompleted: number;
  currentChallenge: number;
  lastActivity: Date;
  isOnline: boolean;
}

interface BattleTimer {
  timeRemaining: number;
  isActive: boolean;
  showWarning: boolean;
}

export const BattleRoom: React.FC<BattleRoomProps> = ({
  match,
  onMatchComplete,
  onLeaveMatch,
}) => {
  const { user } = useAuth();
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [battleTimer, setBattleTimer] = useState<BattleTimer>({
    timeRemaining: 300, // 5 minutes
    isActive: true,
    showWarning: false,
  });
  
  // Opponent tracking
  const [opponentProgress, setOpponentProgress] = useState<OpponentProgress | null>(null);
  const [myProgress, setMyProgress] = useState({
    challengesCompleted: 0,
    currentChallenge: 0,
  });
  
  // Battle state
  const [battleCompleted, setBattleCompleted] = useState(false);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | 'draw' | null>(null);
  const [matchCompleting, setMatchCompleting] = useState(false); // Guard against multiple completion calls
  const [finalResults, setFinalResults] = useState<{
    myCompleted: number;
    opponentCompleted: number;
  } | null>(null);
  
  // Timer management
  const timerRef = useRef<number | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Challenge editor state
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('// Your battle code here\n');
  const [testing, setTesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'editorial' | 'submissions'>('description');
  const [expandedSections, setExpandedSections] = useState({
    examples: true,
    constraints: false,
    hints: false,
  });
  const [fontSize, setFontSize] = useState(14);
  const [showMinimap, setShowMinimap] = useState(true);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showTestResults, setShowTestResults] = useState(false);

  // **EXPLANATION**: This component creates a professional battle room interface that:
  // 1. Reuses existing challenge editor components (CodeEditorPanel, ProblemDescription)
  // 2. Adds real-time opponent tracking using Appwrite subscriptions
  // 3. Implements a 5-minute countdown timer with warnings
  // 4. Shows split-screen view with your code vs opponent progress
  // 5. Handles match completion and victory/defeat states

  // Initialize battle room
  useEffect(() => {
    if (match && match.challenges.length > 0 && user) {
      loadCurrentChallenge();
      startBattleTimer();
      
      // Load initial opponent progress
      const opponentId = match.player1Id === user.$id ? match.player2Id : match.player1Id;
      loadInitialOpponentProgress(opponentId);
      
      // Delay subscription setup to prevent immediate triggers from existing data
      setTimeout(() => {
        setupRealtimeSubscriptions();
      }, 1000); // 1 second delay
    }

    return () => {
      cleanupSubscriptions();
      // Clean up timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [match]);

  const loadInitialOpponentProgress = async (opponentId: string) => {
    try {
      const progress = await WarService.getOpponentProgress(match.$id, opponentId);
      console.log('📊 Initial opponent progress loaded:', progress);
      setOpponentProgress({
        userId: opponentId,
        challengesCompleted: progress.challengesCompleted,
        currentChallenge: progress.currentChallenge,
        lastActivity: progress.lastActivity ? new Date(progress.lastActivity) : new Date(),
        isOnline: progress.isOnline
      });
    } catch (error) {
      console.error('Failed to load initial opponent progress:', error);
    }
  };

  const loadCurrentChallenge = async (index?: number) => {
    const challengeIndex = index ?? currentChallengeIndex;
    console.log('🔍 loadCurrentChallenge called with:', {
      challengesExist: !!match.challenges,
      challengesLength: match.challenges?.length,
      challenges: match.challenges,
      currentIndex: challengeIndex,
      passedIndex: index
    });

    try {
      const challengeId = match.challenges[challengeIndex];
      console.log('🎯 Attempting to load challenge ID:', challengeId);
      
      if (!challengeId || challengeId === null) {
        throw new Error(`Challenge ID is null or undefined: ${challengeId}`);
      }
      
      // Use challengeService to get proper challenge data with language-specific starter code
      const { challengeService } = await import('@/services/challengeService');
      const service = challengeService;
      const realChallenge = await service.getChallenge(challengeId);

      if (!realChallenge) {
        throw new Error(`Challenge not found: ${challengeId}`);
      }

      setCurrentChallenge(realChallenge);
      
      // Set language-specific starter code
      const firstLang = realChallenge.metadata.supportedLanguages?.[0] || 'z--';
      setSelectedLanguage(firstLang);
      
      let starterCode = '';
      if (realChallenge.languages && realChallenge.languages[firstLang]) {
        starterCode = realChallenge.languages[firstLang].starterCode || '';
      } else if (realChallenge.code?.starterCode) {
        starterCode = realChallenge.code.starterCode;
      } else {
        // Use default starter code template for the language
        const { getStarterCode } = await import('@/utils/starterCodes');
        starterCode = getStarterCode(firstLang, realChallenge.metadata?.title);
      }
      
      setCode(starterCode);
      
    } catch (error) {
      console.error('Failed to load challenge:', error);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // **EXPLANATION**: Set up WebSocket subscriptions to track opponent progress in real-time
    if (!user || !match) return;

    const opponentId = match.player1Id === user.$id ? match.player2Id : match.player1Id;

    try {
      const unsubscribe = client.subscribe(
        [`databases.${import.meta.env.VITE_APPWRITE_DATABASE_ID}.collections.war_challenge_attempts.documents`],
        (response) => {
          console.log('Real-time subscription event:', response.events, response.payload);
          
          // Only handle actual updates/creates, not initial/existing data
          if (response.events.includes('databases.*.collections.*.documents.*.create') || 
              response.events.includes('databases.*.collections.*.documents.*.update')) {
            const payload = response.payload as any;
            if (payload.matchId === match.$id && payload.userId === opponentId) {
              console.log('Processing opponent progress update:', payload);
              updateOpponentProgress(payload);
            }
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Failed to setup real-time subscriptions:', error);
    }
  };

  const updateOpponentProgress = async (attemptData: any) => {
    // **EXPLANATION**: Update opponent's progress when they complete challenges
    // Don't rely on attemptData.challengesCompleted - fetch actual progress from database
    let opponentCompleted = 0;
    
    try {
      const actualProgress = await WarService.getOpponentProgress(match.$id, attemptData.userId);
      opponentCompleted = actualProgress.challengesCompleted || 0;
      
      console.log('🔄 Updating opponent progress:', {
        opponentId: attemptData.userId,
        opponentCompleted,
        totalChallenges: match.challenges.length,
        challengesValid: match.challenges.length > 0 && match.challenges[0] !== null,
        battleCompleted,
        battleDuration: battleTimer.timeRemaining,
        actualProgress
      });
      
      setOpponentProgress({
        userId: attemptData.userId,
        challengesCompleted: opponentCompleted,
        currentChallenge: actualProgress.currentChallenge || 0,
        lastActivity: new Date(),
        isOnline: true,
      });
    } catch (error) {
      console.error('Failed to get opponent progress:', error);
      // Fallback to the original method if API call fails
      opponentCompleted = attemptData.challengesCompleted || 0;
      setOpponentProgress({
        userId: attemptData.userId,
        challengesCompleted: opponentCompleted,
        currentChallenge: attemptData.challengeIndex || 0,
        lastActivity: new Date(),
        isOnline: true,
      });
    }

    // Only check for opponent victory if:
    // 1. We have valid challenges (not null)
    // 2. Opponent actually completed some challenges (> 0)
    // 3. Opponent completed ALL challenges
    // 4. Battle is not already completed
    // 5. Battle has been running for at least 10 seconds (to prevent immediate wins)
    // 6. Match is not already being completed
    const hasValidChallenges = match.challenges.length > 0 && match.challenges.every(id => id !== null);
    const battleHasStarted = battleTimer.timeRemaining < 295; // Battle has been running for at least 5 seconds
    
    if (hasValidChallenges && 
        opponentCompleted > 0 && 
        opponentCompleted >= match.challenges.length && 
        !battleCompleted &&
        !matchCompleting &&
        battleHasStarted) {
      
      console.log('🏆 Opponent won the battle!');
      setBattleCompleted(true);
      setBattleResult('defeat');
      setMatchCompleting(true);

      // Store final results for display
      setFinalResults({
        myCompleted: myProgress.challengesCompleted,
        opponentCompleted: opponentCompleted
      });
      
      // Complete the match in database
      try {
        console.log('Opponent completed all challenges - completing match:', {
          matchId: match.$id,
          winnerId: attemptData.userId,
          opponentCompleted: opponentCompleted,
          myCompleted: myProgress.challengesCompleted
        });
        await WarService.completeMatch(match.$id, attemptData.userId, opponentCompleted, myProgress.challengesCompleted);
        console.log('Match completed successfully after opponent victory');
      } catch (error) {
        console.error('Failed to complete match:', error);
      }
      
      onMatchComplete('defeat');
    }

    // Play sound notification if enabled
    if (soundEnabled) {
      playProgressSound();
    }
  };

  const startBattleTimer = () => {
    // **EXPLANATION**: Start a fresh 5-minute timer from when battle room opens
    console.log('🕒 Starting battle timer - 5 minutes from now');
    
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const battleStartTime = new Date().getTime(); // Start timer from now
    
    timerRef.current = setInterval(() => {
      setBattleTimer(prev => {
        // Calculate remaining time from battle room start (not match creation time)
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - battleStartTime) / 1000);
        const newTime = Math.max(0, 300 - elapsedSeconds); // 5 minutes = 300 seconds
        
        const showWarning = newTime <= 60 && newTime > 0;
        
        console.log('⏰ Timer update:', { elapsedSeconds, newTime, showWarning });
        
        // Auto-complete battle when timer reaches 0
        if (newTime <= 0 && prev.timeRemaining > 0) {
          console.log('⏰ Timer expired - completing match');
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeUp();
          return { ...prev, timeRemaining: 0, isActive: false, showWarning: false };
        }

        return { ...prev, timeRemaining: newTime, showWarning };
      });
    }, 1000);
  };

  const handleTimeUp = async () => {
    // **EXPLANATION**: Handle when the 5-minute timer expires
    // Don't complete the match if it's called within the first 10 seconds (likely an initialization bug)
    const currentTime = new Date().getTime();
    const matchStartTime = new Date(match.startTime).getTime();
    const battleDuration = (currentTime - matchStartTime) / 1000;
    
    console.log('⏰ Timer expired - completing match:', {
      matchId: match.$id,
      myCompleted: myProgress.challengesCompleted,
      opponentCompleted: opponentProgress?.challengesCompleted || 0,
      battleDuration: battleDuration,
      timeRemaining: battleTimer.timeRemaining,
      battleCompleted,
      matchCompleting
    });
    
    // Don't complete if battle just started (likely a timer initialization bug)
    if (battleDuration < 10) {
      console.log('🚫 Ignoring timer expiry - battle just started');
      return;
    }

    // Don't complete if already completed or completing
    if (battleCompleted || matchCompleting) {
      console.log('🚫 Ignoring timer expiry - match already completed/completing');
      return;
    }
    
    setBattleCompleted(true);
    setMatchCompleting(true);
    
    // Determine winner based on challenges completed
    const opponentCompleted = opponentProgress?.challengesCompleted || 0;
    const myCompleted = myProgress.challengesCompleted;
    const opponentId = match.player1Id === user!.$id ? match.player2Id : match.player1Id;
    
    // Get actual challenge counts from database for accuracy  
    let actualMyCompleted = myCompleted;
    let actualOpponentCompleted = opponentCompleted;
    
    try {
      console.log('🔍 Getting actual challenge counts from database...');
      console.log('🔍 Match ID:', match.$id);
      console.log('🔍 My User ID:', user!.$id);
      console.log('🔍 Opponent ID:', opponentId);
      
      const myProgress = await WarService.getOpponentProgress(match.$id, user!.$id);
      console.log('🔍 Raw my progress from API:', myProgress);
      
      const opponentProgress = await WarService.getOpponentProgress(match.$id, opponentId);
      console.log('🔍 Raw opponent progress from API:', opponentProgress);
      
      actualMyCompleted = myProgress.challengesCompleted;
      actualOpponentCompleted = opponentProgress.challengesCompleted;
      
      console.log('📊 Database challenge counts:', {
        myCompleted: actualMyCompleted,
        opponentCompleted: actualOpponentCompleted,
        localMyCompleted: myCompleted,
        localOpponentCompleted: opponentCompleted
      });
    } catch (error) {
      console.error('Failed to get actual challenge counts:', error);
    }
    
    console.log('🏁 Final battle results:', {
      myCompleted: actualMyCompleted,
      opponentCompleted: actualOpponentCompleted,
      myUserId: user!.$id,
      opponentId,
      battleDuration
    });

    // Store final results for display
    setFinalResults({
      myCompleted: actualMyCompleted,
      opponentCompleted: actualOpponentCompleted
    });
    
    let result: 'victory' | 'defeat' | 'draw';
    let winnerId: string | undefined;
    
    if (actualMyCompleted > actualOpponentCompleted) {
      result = 'victory';
      winnerId = user!.$id;
      setBattleResult('victory');
      console.log('🎉 Player victory!', { myCompleted: actualMyCompleted, opponentCompleted: actualOpponentCompleted });
    } else if (actualMyCompleted < actualOpponentCompleted) {
      result = 'defeat';
      winnerId = opponentId;
      setBattleResult('defeat');
      console.log('😞 Player defeat!', { myCompleted: actualMyCompleted, opponentCompleted: actualOpponentCompleted });
    } else {
      // Handle draw case properly - no winner
      result = 'draw';
      winnerId = undefined; // No winner for draws
      setBattleResult('draw');
      console.log('🤝 Match is a draw!', { myCompleted: actualMyCompleted, opponentCompleted: actualOpponentCompleted });
    }

    // Complete the match in database
    try {
      console.log('Completing match with winnerId:', winnerId);
      await WarService.completeMatch(match.$id, winnerId, actualMyCompleted, actualOpponentCompleted);
      console.log('Match completed successfully');
    } catch (error) {
      console.error('Failed to complete match on timeout:', error);
    }

    onMatchComplete(result);
  };

  const handleChallengeComplete = async () => {
    // **EXPLANATION**: Handle when user completes a challenge
    const newCompleted = myProgress.challengesCompleted + 1;
    
    console.log('🎉 handleChallengeComplete called:', {
      previousCompleted: myProgress.challengesCompleted,
      newCompleted: newCompleted,
      challengeIndex: currentChallengeIndex,
      challengeId: match.challenges[currentChallengeIndex],
      matchId: match.$id,
      userId: user!.$id
    });
    
    setMyProgress(prev => ({
      ...prev,
      challengesCompleted: newCompleted,
    }));

    // Submit attempt to database for real-time sync
    try {
      console.log('📤 Submitting challenge attempt to database:', {
        matchId: match.$id,
        userId: user!.$id,
        challengeId: match.challenges[currentChallengeIndex],
        challengeIndex: currentChallengeIndex,
        challengesCompleted: newCompleted,
        language: selectedLanguage,
        code: code ? `${code.substring(0, 50)}...` : 'empty'
      });
      
      const attemptResult = await WarService.submitBattleAttempt({
        matchId: match.$id,
        userId: user!.$id,
        challengeId: match.challenges[currentChallengeIndex],
        challengeIndex: currentChallengeIndex,
        completedAt: new Date(),
        isCorrect: true,
        code: code, // Add the current code solution
        language: selectedLanguage, // Add the selected language
      });
      
      console.log('✅ Challenge attempt submitted successfully:', attemptResult);
    } catch (error) {
      console.error('❌ Failed to submit challenge attempt:', error);
    }

    // Check if ALL challenges completed
    if (newCompleted >= match.challenges.length && !battleCompleted && !matchCompleting) {
      setBattleCompleted(true);
      setBattleResult('victory');
      setMatchCompleting(true);

      // Store final results for display
      const opponentCompleted = opponentProgress?.challengesCompleted || 0;
      setFinalResults({
        myCompleted: newCompleted,
        opponentCompleted: opponentCompleted
      });
      
      // Complete the match in database
      try {
        console.log('Player completed all challenges - completing match:', {
          matchId: match.$id,
          winnerId: user!.$id,
          myCompleted: newCompleted,
          opponentCompleted: opponentCompleted
        });
        await WarService.completeMatch(match.$id, user!.$id, newCompleted, opponentCompleted);
        console.log('Match completed successfully after player victory');
      } catch (error) {
        console.error('Failed to complete match:', error);
      }
      
      onMatchComplete('victory');
      return;
    }

    // Move to next challenge
    if (currentChallengeIndex < match.challenges.length - 1) {
      const nextIndex = currentChallengeIndex + 1;
      setCurrentChallengeIndex(nextIndex);
      loadCurrentChallenge(nextIndex); // Pass the new index directly
    }
  };

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    
    if (!currentChallenge) return;
    
    // Get appropriate starter code with priority order:
    // 1. Challenge-specific language starter code
    // 2. Challenge general starter code
    // 3. Default language starter code template
    let starterCode = '';
    if (currentChallenge.languages && currentChallenge.languages[language]) {
      starterCode = currentChallenge.languages[language].starterCode || '';
    } else if (currentChallenge.code?.starterCode) {
      starterCode = currentChallenge.code.starterCode;
    } else {
      // Use default starter code template for the language
      const { getStarterCode } = await import('@/utils/starterCodes');
      starterCode = getStarterCode(language, currentChallenge.metadata?.title);
    }
    
    setCode(starterCode);
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    console.log('Editor mounted:', editor, monaco);
  };

  const handleTestCode = async () => {
    if (!currentChallenge) {
      alert('Challenge not loaded. Please refresh the page.');
      return;
    }

    if (!code.trim()) {
      alert('Please write some code before testing!');
      return;
    }

    setTesting(true);
    try {
      const { challengeService } = await import('@/services/challengeService');
      const service = challengeService;
      
      const result = await service.executeCode({
        code,
        language: selectedLanguage,
        testCases: currentChallenge.testCases.slice(0, 3), // Test only first 3 cases for preview
        timeLimit: currentChallenge.metadata.timeLimit * 60 * 1000,
      });

      // Store test results and show the results panel
      setTestResults(result.testResults || []);
      setShowTestResults(true);

      if (!result.success && result.error) {
        console.error('Code execution error:', result.error);
      }
    } catch (error: any) {
      console.error('Test execution failed:', error);
      setTestResults([{
        id: 'error',
        passed: false,
        input: '',
        expectedOutput: '',
        actualOutput: '',
        executionTime: 0,
        memory: 0,
        error: error.message || 'Test execution failed'
      }]);
      setShowTestResults(true);
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async () => {
    console.log('� SUBMIT CALLED! handleSubmit triggered in BattleRoom');
    console.log('�🚀 SUBMIT: Starting challenge submission', {
      challengeId: match.challenges[currentChallengeIndex],
      currentIndex: currentChallengeIndex,
      codeLength: code.length,
      language: selectedLanguage,
      hasCurrentChallenge: !!currentChallenge
    });

    if (!currentChallenge) {
      alert('Challenge not loaded. Please refresh the page.');
      return;
    }

    if (!code.trim()) {
      alert('Please write some code before submitting!');
      return;
    }

    setSubmitting(true);
    try {
      const { challengeService } = await import('@/services/challengeService');
      const service = challengeService;
      
      // Execute all test cases for submission
      const result = await service.executeCode({
        code,
        language: selectedLanguage,
        testCases: currentChallenge.testCases, // Use all test cases for submission
        timeLimit: currentChallenge.metadata.timeLimit * 60 * 1000,
      });

      // Check if all test cases passed
      const allPassed = result.testResults?.every((test: any) => test.passed) ?? false;
      
      console.log('🔍 DETAILED Challenge submission result:', {
        allPassed,
        challengeId: match.challenges[currentChallengeIndex],
        currentIndex: currentChallengeIndex,
        totalTests: result.testResults?.length || 0,
        passedTests: result.testResults?.filter((test: any) => test.passed).length || 0,
        failedTests: result.testResults?.filter((test: any) => !test.passed).length || 0,
        code: code.substring(0, 100) + '...', // First 100 chars of code
        language: selectedLanguage,
        detailedResults: result.testResults?.map((test: any, idx: number) => ({
          testIndex: idx,
          passed: test.passed,
          input: test.input?.substring(0, 50) || 'No input',
          expected: test.expectedOutput?.substring(0, 100) || 'No expected output',
          actual: test.actualOutput?.substring(0, 100) || 'No actual output',
          error: test.error?.substring(0, 200) || 'No error',
          executionTime: test.executionTime || 0
        })) || []
      });
      
      if (allPassed) {
        // Challenge completed successfully
        console.log('✅ All test cases passed - calling handleChallengeComplete');
        handleChallengeComplete();
      } else {
        // Show submission results
        console.log('❌ Some test cases failed:', result.testResults);
        setTestResults(result.testResults || []);
        setShowTestResults(true);
        alert('Some test cases failed. Please check your solution and try again.');
      }
    } catch (error: any) {
      console.error('Submission failed:', error);
      alert(`Submission failed: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSection = (section: 'examples' | 'constraints' | 'hints') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const playProgressSound = () => {
    // **EXPLANATION**: Play notification sound when opponent makes progress
    if (soundEnabled) {
      const audio = new Audio('/sound-alarm.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cleanupSubscriptions = () => {
    // Cleanup WebSocket subscriptions
  };

  // **EXPLANATION**: The render splits the screen into sections:
  // 1. Battle header with timer and progress
  // 2. Split view: Problem description (left) and Code editor (right)
  // 3. Battle completion modal

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden">
      {/* Battle Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          {/* Battle Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-purple-400">
              <Sword className="w-5 h-5" />
              <span className="font-bold">Battle Room</span>
            </div>
            <div className="w-px h-6 bg-gray-600"></div>
            <span className="text-gray-300 text-sm">
              Challenge {currentChallengeIndex + 1} of {match.challenges.length}
            </span>
          </div>

          {/* Battle Timer */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              battleTimer.showWarning 
                ? 'bg-red-900/20 border-red-500/50 text-red-400' 
                : 'bg-gray-800/50 border-gray-600/50 text-white'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg font-bold">
                {formatTime(battleTimer.timeRemaining)}
              </span>
            </div>

            {/* DEBUG: Manual Complete Button */}
            <button
              onClick={() => {
                console.log('🎯 MANUAL: Completing challenge', myProgress.challengesCompleted + 1);
                handleChallengeComplete();
              }}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold"
            >
              Complete Challenge (DEBUG)
            </button>

            {/* Sound Toggle */}
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* My Progress */}
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Your Progress</span>
              <span className="text-sm font-bold text-blue-400">
                {myProgress.challengesCompleted}/{match.challenges.length}
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(myProgress.challengesCompleted / match.challenges.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Opponent Progress */}
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Opponent</span>
                <div className={`w-2 h-2 rounded-full ${
                  opponentProgress?.isOnline ? 'bg-green-400' : 'bg-red-400'
                }`} />
              </div>
              <span className="text-sm font-bold text-red-400">
                {opponentProgress?.challengesCompleted || 0}/{match.challenges.length}
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((opponentProgress?.challengesCompleted || 0) / match.challenges.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Battle Area */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Problem Description - Left Side */}
        <div className="w-1/2 border-r border-gray-700/50">
          {currentChallenge && (
            <ProblemDescription
              challenge={currentChallenge}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              submissionResult={undefined}
              showSubmissionResult={false}
            />
          )}
        </div>

        {/* Code Editor - Right Side */}
        <div className="w-1/2">
          {currentChallenge && (
            <CodeEditorPanel
              challenge={currentChallenge}
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
              isFullscreen={false}
              setIsFullscreen={() => {}} // Disable fullscreen in battle mode
              handleEditorDidMount={handleEditorDidMount}
              testing={testing}
              submitting={submitting}
              handleTestCode={handleTestCode}
              handleSubmit={handleSubmit} // Proper submit handler that validates all test cases
              testResults={testResults}
              showTestResults={showTestResults}
              setShowTestResults={setShowTestResults}
            />
          )}
        </div>
      </div>

      {/* Battle Completion Modal */}
      <AnimatePresence>
        {battleCompleted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 max-w-md w-full mx-4"
            >
              <div className="text-center">
                {battleResult === 'victory' ? (
                  <>
                    <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-yellow-400 mb-2">Victory!</h2>
                    <p className="text-gray-300 mb-6">
                      You completed {finalResults?.myCompleted || myProgress.challengesCompleted} challenges vs opponent's {finalResults?.opponentCompleted || opponentProgress?.challengesCompleted || 0}!
                    </p>
                  </>
                ) : battleResult === 'draw' ? (
                  <>
                    <Sword className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-blue-400 mb-2">Draw</h2>
                    <p className="text-gray-300 mb-6">
                      Both players completed {finalResults?.myCompleted || myProgress.challengesCompleted} challenges. A well-fought battle!
                    </p>
                  </>
                ) : (
                  <>
                    <Target className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Defeat</h2>
                    <p className="text-gray-300 mb-6">
                      Your opponent completed {finalResults?.opponentCompleted || opponentProgress?.challengesCompleted || 0} challenges vs your {finalResults?.myCompleted || myProgress.challengesCompleted}!
                    </p>
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={onLeaveMatch}
                    className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Leave Battle
                  </button>
                  <button
                    onClick={() => window.location.href = '/war'}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-all"
                  >
                    New Battle
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Warning Modal */}
      <AnimatePresence>
        {battleTimer.showWarning && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className="bg-red-900/90 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-100 font-medium">
                Only {formatTime(battleTimer.timeRemaining)} remaining!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};