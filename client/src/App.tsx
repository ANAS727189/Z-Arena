import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  LandingPage,
  ChallengesPage,
  ChallengePage,
  LeaderboardPage,
  ProfilePage,
  NotFoundPage
} from './pages';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenge/:id" element={<ChallengePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
