import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import {
  LandingPage,
  ChallengesPage,
  ChallengePage,
  LeaderboardPage,
  ProfilePage,
  SettingsPage,
  NotFoundPage,
} from './pages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page without layout (has its own navigation) */}
          <Route path="/" element={<LandingPage />} />
          
          {/* ChallengePage without layout (has its own special interface) */}
          <Route path="/challenge/:id" element={<ChallengePage />} />
          
          {/* All other pages use the layout with fixed navigation */}
          <Route path="/challenges" element={<Layout><ChallengesPage /></Layout>} />
          <Route path="/leaderboard" element={<Layout><LeaderboardPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
