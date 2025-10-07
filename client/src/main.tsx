import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Analytics } from "@vercel/analytics/react"
// Import for console access to challenge update utilities
import '@/utils/updateChallenges';
import '@/utils/replaceChallenge';

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Analytics />
  </>
);
