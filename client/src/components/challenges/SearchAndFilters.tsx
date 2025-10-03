import { Search, Filter, Code2 } from 'lucide-react';
import type { Challenge } from '@/types';

interface SearchAndFiltersProps {
  searchTerm: string;
  selectedDifficulty: Challenge['metadata']['difficulty'] | 'all';
  selectedLanguage: string;
  supportedLanguages: string[];
  onSearchChange: (value: string) => void;
  onDifficultyChange: (
    value: Challenge['metadata']['difficulty'] | 'all'
  ) => void;
  onLanguageChange: (value: string) => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  selectedDifficulty,
  selectedLanguage,
  supportedLanguages,
  onSearchChange,
  onDifficultyChange,
  onLanguageChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder="Search challenges, tags, or topics..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[var(--text-secondary)] focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)]/20 transition-all outline-none"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
          <select
            value={selectedDifficulty}
            onChange={e =>
              onDifficultyChange(
                e.target.value as Challenge['metadata']['difficulty'] | 'all'
              )
            }
            className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg px-4 py-2 text-white focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)]/20 transition-all outline-none"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-[var(--text-secondary)]" />
          <select
            value={selectedLanguage}
            onChange={e => onLanguageChange(e.target.value)}
            className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg px-4 py-2 text-white focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)]/20 transition-all outline-none"
          >
            <option value="all">All Languages</option>
            {supportedLanguages.map(lang => (
              <option key={lang} value={lang}>
                {lang === 'z--'
                  ? 'Z--'
                  : lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
