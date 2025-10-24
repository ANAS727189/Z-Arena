import { useState } from 'react';
import EloRatingDisplay from '@/components/compete-war/EloRatingDisplay'
import RecentWars from '@/components/compete-war/RecentWars'
import WarHeader from '@/components/compete-war/WarHeader'
import WarLeaderboardPreview from '@/components/compete-war/WarLeaderboardPreview'
import { BattleRoom } from '@/components/compete-war/BattleRoom'
import { Layout } from '@/components/Layout'
import type { WarMatch } from '@/types';

const WarPage = () => {
  const [currentMatch, setCurrentMatch] = useState<WarMatch | null>(null);
  const [battleView, setBattleView] = useState<'lobby' | 'battle'>('lobby');

  // **EXPLANATION**: The WarPage now has two views:
  // 1. Lobby view - shows ELO, leaderboard, recent wars, and matchmaking
  // 2. Battle view - shows the full-screen battle room interface

  const handleMatchFound = (match: WarMatch) => {
    console.log('Match found:', match);
    setCurrentMatch(match);
    setBattleView('battle');
  };

  const handleMatchComplete = (result: 'victory' | 'defeat' | 'draw') => {
    console.log('Match completed with result:', result);
    // Don't auto-navigate - let user click the button
    // The modal will handle user navigation
  };

  const handleLeaveMatch = () => {
    console.log('User leaving match, returning to lobby');
    setCurrentMatch(null);
    setBattleView('lobby');
  };

  if (battleView === 'battle' && currentMatch) {
    return (
      <BattleRoom 
        match={currentMatch}
        onMatchComplete={handleMatchComplete}
        onLeaveMatch={handleLeaveMatch}
      />
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section with Join Battle */}
        <WarHeader onMatchFound={handleMatchFound} />
        
        {/* ELO Rating Display */}
        <div className="mb-6">
          <EloRatingDisplay />
        </div>
        
        {/* Leaderboard and Recent Wars Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WarLeaderboardPreview />
          <RecentWars />
        </div>
      </div>
    </Layout>
  )
}

export { WarPage }