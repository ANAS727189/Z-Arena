import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { WarService } from '@/services/warService';
import { challengeService } from '@/services/challengeService';
import { client } from '@/lib/appwrite';
import type { WarMatch, Challenge } from '@/types';

interface BattleState {
  currentChallenge: Challenge | null;
  currentChallengeIndex: number;
  challenges: Challenge[];
  timeRemaining: number;
  isActive: boolean;
  showWarning: boolean;
  myProgress: {
    challengesCompleted: number;
    currentChallenge: number;
  };
  opponentProgress: {
    userId: string;
    challengesCompleted: number;
    currentChallenge: number;
    lastActivity: Date | null;
    isOnline: boolean;
  } | null;
  battleResult: 'victory' | 'defeat' | null;
  battleCompleted: boolean;
}

export const useBattleRoom = (match: WarMatch | null) => {
  const { user } = useAuth();
  const timerRef = useRef<number | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const [battleState, setBattleState] = useState<BattleState>({
    currentChallenge: null,
    currentChallengeIndex: 0,
    challenges: [],
    timeRemaining: 300, // 5 minutes
    isActive: true,
    showWarning: false,
    myProgress: {
      challengesCompleted: 0,
      currentChallenge: 0,
    },
    opponentProgress: null,
    battleResult: null,
    battleCompleted: false,
  });

  // **EXPLANATION**: This hook manages all the battle room state and real-time functionality
  // It handles timer management, challenge loading, opponent tracking, and WebSocket subscriptions

  // Initialize battle when match is provided
  useEffect(() => {
    if (match && user) {
      initializeBattle();
    }

    return () => {
      cleanup();
    };
  }, [match, user]);

  const initializeBattle = async () => {
    if (!match || !user) return;

    try {
      // Load all challenges for the match
      const loadedChallenges = await loadMatchChallenges(match.challenges.map((c: any) => typeof c === 'string' ? c : c.$id));
      
      setBattleState(prev => ({
        ...prev,
        challenges: loadedChallenges,
        currentChallenge: loadedChallenges[0] || null,
        currentChallengeIndex: 0,
      }));

      // Start timer
      startBattleTimer();
      
      // Setup real-time subscriptions
      setupRealtimeSubscriptions();
      
      // Load initial opponent progress
      await loadOpponentProgress();
      
    } catch (error) {
      console.error('Failed to initialize battle:', error);
    }
  };

  const loadMatchChallenges = async (challengeIds: string[]): Promise<Challenge[]> => {
    // **EXPLANATION**: Load all challenges for the battle from the database
    const challenges: Challenge[] = [];
    
    for (const challengeId of challengeIds) {
      try {
        const challenge = await challengeService.getChallenge(challengeId);
        if (challenge) {
          challenges.push(challenge);
        }
      } catch (error) {
        console.error(`Failed to load challenge ${challengeId}:`, error);
      }
    }
    
    return challenges;
  };

  const startBattleTimer = () => {
    // **EXPLANATION**: Start the 5-minute countdown timer with warnings
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setBattleState(prev => {
        const newTime = prev.timeRemaining - 1;
        
        // Show warning at 60 seconds
        const showWarning = newTime <= 60 && newTime > 0;
        
        // Auto-complete battle when timer reaches 0
        if (newTime <= 0) {
          handleTimeUp();
          return {
            ...prev,
            timeRemaining: 0,
            isActive: false,
            showWarning: false,
            battleCompleted: true,
          };
        }
        
        return {
          ...prev,
          timeRemaining: newTime,
          showWarning,
        };
      });
    }, 1000);
  };

  const setupRealtimeSubscriptions = () => {
    // **EXPLANATION**: Setup WebSocket subscriptions for real-time opponent tracking
    if (!user || !match) return;

    const opponentId = match.player1Id === user.$id ? match.player2Id : match.player1Id;

    try {
      // Subscribe to opponent's challenge attempts
      const unsubscribe = client.subscribe(
        [`databases.${import.meta.env.VITE_APPWRITE_DATABASE_ID}.collections.war_challenge_attempts.documents`],
        (response) => {
          console.log('Real-time update:', response);
          
          // Filter for this match and opponent
          const payload = response.payload as any;
          if (payload.matchId === match.$id && payload.userId === opponentId) {
            updateOpponentProgress(payload);
          }
        }
      );

      unsubscribeRef.current = unsubscribe;
    } catch (error) {
      console.error('Failed to setup real-time subscriptions:', error);
    }
  };

  const loadOpponentProgress = async () => {
    // **EXPLANATION**: Load current opponent progress from database
    if (!match || !user) return;

    try {
      const opponentId = match.player1Id === user.$id ? match.player2Id : match.player1Id;
      const progress = await WarService.getOpponentProgress(match.$id, opponentId);
      
      setBattleState(prev => ({
        ...prev,
        opponentProgress: {
          userId: opponentId,
          challengesCompleted: progress.challengesCompleted,
          currentChallenge: progress.currentChallenge,
          lastActivity: progress.lastActivity,
          isOnline: progress.isOnline,
        },
      }));
    } catch (error) {
      console.error('Failed to load opponent progress:', error);
    }
  };

  const updateOpponentProgress = (attemptData: any) => {
    // **EXPLANATION**: Update opponent progress from real-time events
    setBattleState(prev => ({
      ...prev,
      opponentProgress: {
        userId: attemptData.userId,
        challengesCompleted: attemptData.challengesCompleted || 0,
        currentChallenge: attemptData.challengeIndex || 0,
        lastActivity: new Date(),
        isOnline: true,
      },
    }));
  };

  const handleTimeUp = async () => {
    // **EXPLANATION**: Handle when the 5-minute timer expires
    setBattleState(prev => {
      const opponentCompleted = prev.opponentProgress?.challengesCompleted || 0;
      const myCompleted = prev.myProgress.challengesCompleted;
      
      let result: 'victory' | 'defeat';
      if (myCompleted > opponentCompleted) {
        result = 'victory';
      } else if (myCompleted < opponentCompleted) {
        result = 'defeat';
      } else {
        // Tie - treating as defeat for simplicity
        result = 'defeat';
      }

      return {
        ...prev,
        battleResult: result,
        battleCompleted: true,
        isActive: false,
      };
    });

    // Update match status in database
    if (match) {
      try {
        await WarService.updateMatchStatus(match.$id, 'completed');
      } catch (error) {
        console.error('Failed to update match status:', error);
      }
    }
  };

  const completeChallenge = async () => {
    // **EXPLANATION**: Handle when user completes a challenge
    if (!match || !user) return;

    const newCompleted = battleState.myProgress.challengesCompleted + 1;
    const newChallengeIndex = battleState.currentChallengeIndex + 1;
    
    setBattleState(prev => ({
      ...prev,
      myProgress: {
        ...prev.myProgress,
        challengesCompleted: newCompleted,
        currentChallenge: newChallengeIndex,
      },
    }));

    // Submit attempt to database for real-time sync
    try {
      await WarService.submitBattleAttempt({
        matchId: match.$id,
        userId: user.$id,
        challengeId: match.challenges[battleState.currentChallengeIndex],
        challengeIndex: battleState.currentChallengeIndex,
        completedAt: new Date(),
        isCorrect: true,
        code: '', // Add empty code for now
        language: 'javascript', // Add default language
      });
    } catch (error) {
      console.error('Failed to submit challenge attempt:', error);
    }

    // Check if battle is won or move to next challenge
    if (newCompleted >= match.challenges.length || 
        newCompleted > (battleState.opponentProgress?.challengesCompleted || 0)) {
      
      setBattleState(prev => ({
        ...prev,
        battleResult: 'victory',
        battleCompleted: true,
        isActive: false,
      }));

      // Update match status
      try {
        await WarService.updateMatchStatus(match.$id, 'completed', user.$id);
      } catch (error) {
        console.error('Failed to update match status:', error);
      }
      
      return;
    }

    // Move to next challenge
    if (newChallengeIndex < battleState.challenges.length) {
      setBattleState(prev => ({
        ...prev,
        currentChallenge: prev.challenges[newChallengeIndex],
        currentChallengeIndex: newChallengeIndex,
      }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cleanup = () => {
    // **EXPLANATION**: Clean up timers and subscriptions
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  };

  return {
    battleState,
    completeChallenge,
    formatTime,
    loadOpponentProgress,
  };
};