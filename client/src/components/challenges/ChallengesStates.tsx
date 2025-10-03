import { Loader2, Search } from 'lucide-react';

interface LoadingStateProps {}

export const LoadingState: React.FC<LoadingStateProps> = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-6 h-6 text-[var(--accent-purple)] animate-spin" />
        <span className="text-white font-medium">Loading challenges...</span>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">⚠️</div>
        <div>
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Configuration Error
          </h3>
          <p className="text-red-200 text-sm leading-relaxed mb-4">{error}</p>
          <div className="bg-red-950/50 p-3 rounded text-xs text-red-300">
            <strong>Quick Fix:</strong> Go to Appwrite Console → Databases →
            challenges collection → Settings → Update Permissions → Set Read
            permission to "any"
          </div>
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {}

export const EmptyState: React.FC<EmptyStateProps> = () => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-[var(--background-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-[var(--text-secondary)]" />
      </div>
      <h3 className="font-heading text-xl font-bold text-white mb-2">
        No challenges found
      </h3>
      <p className="font-body text-[var(--text-secondary)]">
        Try adjusting your search terms or filters
      </p>
    </div>
  );
};
