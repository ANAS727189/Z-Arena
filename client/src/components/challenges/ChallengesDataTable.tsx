import React, { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowUpDownIcon,
  SearchIcon,
  FilterIcon,
  ClockIcon,
  TrophyIcon
} from 'lucide-react';
import type { Challenge } from '@/types';

interface ChallengesDataTableProps {
  challenges: Challenge[];
  loading?: boolean;
  solvedChallenges?: string[];
  onChallengeClick: (challenge: Challenge) => void;
}

const difficultyColors = {
  easy: 'border-green-500 text-green-400 bg-green-500/10',
  medium: 'border-yellow-500 text-yellow-400 bg-yellow-500/10',
  hard: 'border-red-500 text-red-400 bg-red-500/10',
};

export const ChallengesDataTable: React.FC<ChallengesDataTableProps> = ({
  challenges,
  loading: isLoading = false,
  solvedChallenges = [],
  onChallengeClick,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<Challenge>[]>(
    () => [
      {
        id: 'title',
        accessorFn: (row) => row.metadata.title,
        filterFn: 'includesString',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold text-left justify-start text-white hover:text-white hover:bg-transparent"
          >
            Challenge
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const challenge = row.original;
          const difficulty = challenge.metadata.difficulty;
          const stats = challenge.stats;
          const successRate = stats && stats.totalSubmissions > 0 
            ? Math.round((stats.successfulSubmissions / stats.totalSubmissions) * 100)
            : 0;

          return (
            <div className="py-4">
              {/* Title and difficulty on same line */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                    {challenge.metadata.title}
                  </h3>
                  {/* Solved/Unsolved Status */}
                  {solvedChallenges.includes(challenge.id) ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/50">
                      ✓ Solved
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/50">
                      Unsolved
                    </span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}>
                  {difficulty}
                </span>
              </div>

              {/* Description */}
              <p className="text-white/70 text-sm mb-4 line-clamp-2">
                {challenge.metadata.description.split('\n')[0]}
              </p>

              {/* Stats row */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <TrophyIcon className="w-4 h-4" />
                    <span className="font-medium">{challenge.metadata.points} pts</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <ClockIcon className="w-4 h-4" />
                    <span>{challenge.metadata.timeLimit}m</span>
                  </div>
                  {stats && stats.totalSubmissions > 0 && (
                    <div className="text-white/60">
                      <span className="font-medium text-green-400">{successRate}%</span> success
                    </div>
                  )}
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChallengeClick(row.original);
                  }}
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-medium px-6"
                >
                  Start Challenge
                </Button>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {challenge.metadata.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded-md border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
                {challenge.metadata.tags.length > 4 && (
                  <span className="text-xs text-white/50">
                    +{challenge.metadata.tags.length - 4} more
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      // Hidden columns for filtering only - they won't be rendered
      {
        id: 'difficulty',
        accessorFn: (row) => row.metadata.difficulty,
        filterFn: 'equals',
        header: '',
        cell: () => null,
        size: 0,
        enableSorting: false,
        enableColumnFilter: true,
        meta: {
          hidden: true,
        } as any,
      },
      {
        id: 'language',
        accessorFn: (row) => row.metadata.supportedLanguages?.join(',') || '',
        filterFn: 'includesString',
        header: '',
        cell: () => null,
        size: 0,
        enableSorting: false,
        enableColumnFilter: true,
        meta: {
          hidden: true,
        } as any,
      },
    ],
    [onChallengeClick]
  );

  const table = useReactTable({
    data: challenges,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  const difficultyFilter = (table.getColumn('difficulty')?.getFilterValue() ?? '') as string;
  const languageFilter = (table.getColumn('language')?.getFilterValue() ?? '') as string;
  const searchFilter = (table.getColumn('title')?.getFilterValue() ?? '') as string;

  // Get unique supported languages
  const supportedLanguages = useMemo(() => {
    const langSet = new Set<string>();
    challenges.forEach(challenge => {
      challenge.metadata.supportedLanguages?.forEach(lang => langSet.add(lang));
    });
    return Array.from(langSet).sort();
  }, [challenges]);

  return (
    <div className="w-full bg-black border border-white/20 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Programming Challenges</h2>
          {/* <div className="text-sm text-white/60">
            {table.getFilteredRowModel().rows.length} challenge{table.getFilteredRowModel().rows.length !== 1 ? 's' : ''} found
          </div> */}
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <SearchIcon className="w-5 h-5 text-white/60" />
            <Input
              placeholder="Search challenges..."
              value={searchFilter}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                table.getColumn('title')?.setFilterValue(event.target.value)
              }
              className="h-10 bg-black border-white/30 text-white placeholder:text-white/60 focus:border-white focus:bg-black focus:text-white"
              style={{ color: 'white' }}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <FilterIcon className="w-5 h-5 text-white/60" />
            <Select
              value={difficultyFilter}
              onValueChange={(value: string) =>
                table.getColumn('difficulty')?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-36 h-10 bg-black border-white/30 text-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all" className="text-white hover:bg-white/10">All Levels</SelectItem>
                <SelectItem value="easy" className="text-white hover:bg-white/10">Easy</SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-white/10">Medium</SelectItem>
                <SelectItem value="hard" className="text-white hover:bg-white/10">Hard</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={languageFilter}
              onValueChange={(value: string) =>
                table.getColumn('language')?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-36 h-10 bg-black border-white/30 text-white">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all" className="text-white hover:bg-white/10">All Languages</SelectItem>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="text-white hover:bg-white/10">
                    {lang.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="border-b border-white/20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-black hover:bg-black">
                {headerGroup.headers.map((header) => {
                  // Skip hidden columns
                  if ((header.column.columnDef.meta as any)?.hidden) return null;
                  
                  return (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-white px-6 py-4 text-left"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Loading skeleton
              [...Array(5)].map((_, index) => (
                <TableRow key={index} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell className="px-6">
                    <div className="py-4">
                      <div className="h-6 bg-white/20 rounded animate-pulse mb-3"></div>
                      <div className="h-4 bg-white/10 rounded animate-pulse mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-white/10 rounded animate-pulse"></div>
                        <div className="h-6 w-12 bg-white/10 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-white/10 hover:bg-green-500/5 cursor-pointer group transition-colors"
                  onClick={() => onChallengeClick(row.original)}
                >
                    {row.getVisibleCells().map((cell) => {
                      // Skip hidden columns
                      if ((cell.column.columnDef.meta as any)?.hidden) return null;                    return (
                      <TableCell key={cell.id} className="px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b border-white/10">
                <TableCell className="h-32 text-center text-white/60 px-6">
                  <div className="flex flex-col items-center justify-center">
                    <SearchIcon className="w-8 h-8 mb-2 text-white/40" />
                    <p>No challenges found</p>
                    <p className="text-sm text-white/40 mt-1">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/20 bg-black">
        <div className="flex items-center gap-3 text-sm text-white/80">
          <span>Rows per page:</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-16 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20">
              {[5, 10, 20, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="text-white hover:bg-white/10">
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-white/80">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount() || 1}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};