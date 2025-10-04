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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  PlayIcon,
  ClockIcon,
  TrophyIcon,
  TagIcon,
} from 'lucide-react';
import type { Challenge } from '@/types';

interface ChallengesDataTableProps {
  challenges: Challenge[];
  loading?: boolean;
  onChallengeClick: (challenge: Challenge) => void;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 hover:bg-green-200',
  medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  hard: 'bg-red-100 text-red-800 hover:bg-red-200',
};

const difficultyOrder = { easy: 1, medium: 2, hard: 3 };

export const ChallengesDataTable: React.FC<ChallengesDataTableProps> = ({
  challenges,
  loading: isLoading = false,
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
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold text-left justify-start"
          >
            Challenge
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const challenge = row.original;
          return (
            <div className="space-y-1">
              <div className="font-semibold text-gray-900">
                {challenge.metadata.title}
              </div>
              <div className="text-sm text-gray-500 line-clamp-2">
                {challenge.metadata.description.split('\n')[0]}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {challenge.metadata.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {challenge.metadata.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{challenge.metadata.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          );
        },
        size: 400,
      },
      {
        id: 'difficulty',
        accessorFn: (row) => row.metadata.difficulty,
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Difficulty
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const difficulty = row.getValue('difficulty') as string;
          return (
            <Badge
              className={`${difficultyColors[difficulty as keyof typeof difficultyColors]} font-medium capitalize`}
            >
              {difficulty}
            </Badge>
          );
        },
        sortingFn: (rowA, rowB) => {
          const a = rowA.getValue('difficulty') as keyof typeof difficultyOrder;
          const b = rowB.getValue('difficulty') as keyof typeof difficultyOrder;
          return difficultyOrder[a] - difficultyOrder[b];
        },
        size: 100,
      },
      {
        id: 'points',
        accessorFn: (row) => row.metadata.points,
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Points
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1 font-medium text-amber-600">
            <TrophyIcon className="w-4 h-4" />
            {row.getValue('points')}
          </div>
        ),
        size: 80,
      },
      {
        id: 'timeLimit',
        accessorFn: (row) => row.metadata.timeLimit,
        header: 'Time Limit',
        cell: ({ row }) => (
          <div className="flex items-center gap-1 text-gray-600">
            <ClockIcon className="w-4 h-4" />
            {row.getValue('timeLimit')}m
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: 'stats',
        header: 'Success Rate',
        cell: ({ row }) => {
          const stats = row.getValue('stats') as Challenge['stats'];
          if (!stats || stats.totalSubmissions === 0) {
            return <span className="text-gray-400">No data</span>;
          }
          const successRate = Math.round(
            (stats.successfulSubmissions / stats.totalSubmissions) * 100
          );
          return (
            <div className="space-y-1">
              <div className="text-sm font-medium">{successRate}%</div>
              <div className="text-xs text-gray-500">
                {stats.successfulSubmissions}/{stats.totalSubmissions}
              </div>
            </div>
          );
        },
        size: 120,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button
            onClick={() => onChallengeClick(row.original)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlayIcon className="w-4 h-4 mr-1" />
            Start
          </Button>
        ),
        size: 80,
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
  const searchFilter = (table.getColumn('title')?.getFilterValue() ?? '') as string;

  return (
    <Card className="w-full bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white">
            Programming Challenges
          </CardTitle>
          <div className="text-sm text-gray-400">
            {table.getFilteredRowModel().rows.length} challenge(s) found
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <SearchIcon className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search challenges..."
              value={searchFilter}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                table.getColumn('title')?.setFilterValue(event.target.value)
              }
              className="h-9 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-gray-400" />
            <Select
              value={difficultyFilter}
              onValueChange={(value: string) =>
                table.getColumn('difficulty')?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-32 h-9 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">All Levels</SelectItem>
                <SelectItem value="easy" className="text-white hover:bg-gray-700">Easy</SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                <SelectItem value="hard" className="text-white hover:bg-gray-700">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-800/50 border-b border-gray-700 hover:bg-gray-800/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="font-semibold text-gray-300 border-r border-gray-700 last:border-r-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

                        <TableBody>
              {isLoading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <TableRow key={index} className="hover:bg-gray-800/30 border-b border-gray-800">
                    {columns.map((_, colIndex) => (
                      <TableCell key={colIndex} className="text-gray-400 border-r border-gray-800 last:border-r-0">
                        <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-800/30 cursor-pointer border-b border-gray-800 last:border-b-0"
                    onClick={() => onChallengeClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-gray-300 border-r border-gray-800 last:border-r-0">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-b border-gray-800">
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                    No challenges found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>Rows per page:</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value: string) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-16 bg-gray-800 border-gray-700 text-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {[5, 10, 20, 30, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`} className="text-gray-300 hover:bg-gray-700">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount() || 1}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};