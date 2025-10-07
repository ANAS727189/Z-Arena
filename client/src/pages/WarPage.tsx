import EloRatingDisplay from '@/components/compete-war/EloRatingDisplay'
import RecentWars from '@/components/compete-war/RecentWars'
import WarHeader from '@/components/compete-war/WarHeader'
import WarLeaderboardPreview from '@/components/compete-war/WarLeaderboardPreview'

const WarPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Section with Join Battle */}
      <WarHeader />
      
      {/* ELO Rating Display */}
      <div className="mb-6">
        <EloRatingDisplay />
      </div>
      
      {/* Leaderboard and Recent Wars Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WarLeaderboardPreview />
        <RecentWars />
      </div>
    </div>
  )
}

export { WarPage }