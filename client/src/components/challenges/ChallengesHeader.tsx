import { Database, Loader2 } from 'lucide-react';

interface ChallengesHeaderProps {
  onSeedChallenges: () => void;
  seeding: boolean;
}

export const ChallengesHeader: React.FC<ChallengesHeaderProps> = ({
  onSeedChallenges,
  seeding,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
          Code Challenges
        </h1>
        {/* Development Seeding Button */}
        {import.meta.env.DEV && (
          <button
            onClick={onSeedChallenges}
            disabled={seeding}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {seeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Seeding...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Seed DB
              </>
            )}
          </button>
        )}
      </div>
      <p className="font-body text-xl text-[var(--text-secondary)] mb-6">
        Master programming through hands-on challenges across multiple languages
      </p>
    </div>
  );
};
