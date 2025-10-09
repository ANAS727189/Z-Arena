import { Search, Filter, Code2 } from 'lucide-react';
import type { Challenge } from '@/types';
import { Input } from '@/components/ui/input'; // Assuming shadcn/ui Input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Assuming shadcn/ui Select

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
    <div className="flex flex-col md:flex-row items-center gap-4 rounded-xl border border-white/10 bg-black p-4 backdrop-blur-sm">
      
      {/* --- Search Input --- */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search challenges, tags, or topics..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full bg-black/30 border-white/10 rounded-lg pl-10 pr-4 py-3 h-12 text-white placeholder-gray-500 focus:border-green-400/50 focus:ring-green-400/20"
        />
      </div>

      {/* --- Filter Dropdowns --- */}
      <div className="flex w-full md:w-auto gap-4">
        {/* Difficulty Filter */}
        <div className="flex-1">
          {/* UPDATED: Using a styled Select component */}
          <Select
            value={selectedDifficulty}
            onValueChange={(value) => onDifficultyChange(value as Challenge['metadata']['difficulty'] | 'all')}
          >
            <SelectTrigger className="w-full h-12 bg-black/30 border-white/10 rounded-lg text-white data-[placeholder]:text-gray-500 hover:bg-black/50 focus:border-green-400/50 focus:ring-green-400/20">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <SelectValue placeholder="All Levels" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-900/80 border-white/10 text-white backdrop-blur-md">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language Filter */}
        <div className="flex-1">
          <Select
            value={selectedLanguage}
            onValueChange={(value) => onLanguageChange(value)}
          >
            <SelectTrigger className="w-full h-12 bg-black/30 border-white/10 rounded-lg text-white data-[placeholder]:text-gray-500 hover:bg-black/50 focus:border-green-400/50 focus:ring-green-400/20">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-gray-500" />
                <SelectValue placeholder="All Languages" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-900/80 border-white/10 text-white backdrop-blur-md">
              <SelectItem value="all">All Languages</SelectItem>
              {supportedLanguages.map(lang => (
                <SelectItem key={lang} value={lang}>
                  {lang === 'z--'
                    ? 'Z--'
                    : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};