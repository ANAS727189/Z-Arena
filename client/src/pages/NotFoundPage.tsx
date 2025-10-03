import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-white mb-4">404</h1>
        <p className="font-body text-xl text-[var(--text-secondary)] mb-8">
          Page not found
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center mx-auto"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Home
        </button>
      </div>
    </div>
  );
};
