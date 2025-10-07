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
  AchievementsPage,
  NotFoundPage,
  WarPage
} from './pages';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/challenge/:id" element={<ChallengePage />} />
          <Route
            path="/challenges"
            element={
              <Layout>
                <ChallengesPage />
              </Layout>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <Layout>
                <LeaderboardPage />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <ProfilePage />
              </Layout>
            }
          />
          <Route
            path="/achievements"
            element={
              <Layout>
                <AchievementsPage />
              </Layout>
            }
          />
          <Route
            path="/compete-wars"
            element={<WarPage />}
          />

          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <NotFoundPage />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
