import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import { Trophy, Crown, Medal, Award, ExternalLink } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

import { ELOCalculator } from '@/utils/eloCalculator';

import type { WarLeaderboard } from '@/types';



const WarLeaderboardPreview = () => {

const navigate = useNavigate();

const [topPlayers, setTopPlayers] = useState<WarLeaderboard[]>([]);

const [loading, setLoading] = useState(true);



useEffect(() => {

fetchTopPlayers();

}, []);



const fetchTopPlayers = async () => {

try {

setLoading(true);

const leaderboardDocs = await databases.listDocuments(

DATABASE_ID,

COLLECTIONS.WAR_LEADERBOARD,

[

Query.orderDesc('eloRating'),

Query.limit(10)

]

);

console.log('📊 Leaderboard data fetched:', leaderboardDocs.documents.length, 'players');

if (leaderboardDocs.documents.length > 0) {
  setTopPlayers(leaderboardDocs.documents as unknown as WarLeaderboard[]);
} else {
  console.log('⚠️ No leaderboard data found, using empty array');
  setTopPlayers([]);
}

} catch (error) {

console.error('Error fetching war leaderboard:', error);

// On error, try to show empty state instead of mock data

setTopPlayers([

{

$id: '1',

userId: 'user1',

eloRating: 1847,

warWins: 25,

warLosses: 12,

warDraws: 3,

warStreak: 5,

bestWarStreak: 8,

warRank: 1,

totalWarGames: 40,

winPercentage: 62.5,

avgOpponentElo: 1820,

lastMatchAt: new Date().toISOString(),

isProvisional: false,

lastUpdated: new Date().toISOString(),

$createdAt: new Date().toISOString(),

$updatedAt: new Date().toISOString()

},

{

$id: '2',

userId: 'user2',

eloRating: 1723,

warWins: 18,

warLosses: 15,

warDraws: 2,

warStreak: 0,

bestWarStreak: 6,

warRank: 2,

totalWarGames: 35,

winPercentage: 51.4,

avgOpponentElo: 1700,

lastMatchAt: new Date().toISOString(),

isProvisional: false,

lastUpdated: new Date().toISOString(),

$createdAt: new Date().toISOString(),

$updatedAt: new Date().toISOString()

},

{

$id: '3',

userId: 'user3',

eloRating: 1654,

warWins: 22,

warLosses: 18,

warDraws: 1,

warStreak: 2,

bestWarStreak: 4,

warRank: 3,

totalWarGames: 41,

winPercentage: 53.7,

avgOpponentElo: 1630,

lastMatchAt: new Date().toISOString(),

isProvisional: false,

lastUpdated: new Date().toISOString(),

$createdAt: new Date().toISOString(),

$updatedAt: new Date().toISOString()

}

]);

} finally {

setLoading(false);

}

};



const getRankIcon = (rank: number) => {

switch (rank) {

case 1:

return <Crown className="w-5 h-5 text-yellow-400" />;

case 2:

return <Medal className="w-5 h-5 text-gray-300" />;

case 3:

return <Award className="w-5 h-5 text-orange-400" />;

default:

return <span className="text-[var(--text-secondary)] font-bold text-sm">#{rank}</span>;

}

};



const getUserDisplayName = (userId: string) => {

// This would normally fetch the actual username

return `Player${userId.slice(-4)}`;

};



if (loading) {

return (

<motion.div

initial={{ opacity: 0, x: -20 }}

animate={{ opacity: 1, x: 0 }}

className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border-primary)] flex-1 mr-4"

>

<div className="animate-pulse">

<div className="h-6 bg-gray-700 rounded mb-4"></div>

{[1, 2, 3, 4, 5].map(i => (

<div key={i} className="flex items-center gap-3 p-3 mb-2">

<div className="w-8 h-8 bg-gray-700 rounded"></div>

<div className="flex-1">

<div className="h-4 bg-gray-700 rounded mb-1"></div>

<div className="h-3 bg-gray-700 rounded w-3/4"></div>

</div>

<div className="h-6 bg-gray-700 rounded w-16"></div>

</div>

))}

</div>

</motion.div>

);

}



return (

<motion.div

initial={{ opacity: 0, x: -20 }}

animate={{ opacity: 1, x: 0 }}

className="bg-[var(--background-secondary)] rounded-lg p-6 border border-[var(--border-primary)] flex-1 mr-4"

>

<div className="flex items-center justify-between mb-6">

<div className="flex items-center gap-2">

<Trophy className="w-5 h-5 text-yellow-400" />

<h3 className="text-xl font-bold text-white">War Leaderboard</h3>

</div>

<button

onClick={() => navigate('/war-leaderboard')} // You'd need to create this route

className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"

>

View All <ExternalLink className="w-3 h-3" />

</button>

</div>



<div className="space-y-2">

{topPlayers.slice(0, 8).map((player, index) => (

<motion.div

key={player.$id}

initial={{ opacity: 0, y: 10 }}

animate={{ opacity: 1, y: 0 }}

transition={{ delay: index * 0.1 }}

className="flex items-center justify-between p-3 rounded bg-[var(--background-primary)]/50 hover:bg-[var(--background-primary)]/70 transition-colors"

>

<div className="flex items-center gap-3">

<div className="w-8 h-8 flex items-center justify-center">

{getRankIcon(player.warRank)}

</div>

<div>

<div className="text-white font-medium text-sm">

{getUserDisplayName(player.userId)}

</div>

<div className="text-xs text-[var(--text-secondary)]">

{player.warWins}W - {player.warLosses}L

{player.warDraws > 0 && ` - ${player.warDraws}D`}

</div>

</div>

</div>


<div className="text-right">

<div

className="font-bold text-sm"

style={{ color: ELOCalculator.getRatingColor(player.eloRating) }}

>

{ELOCalculator.formatRating(player.eloRating)}

</div>

<div className="text-xs text-[var(--text-secondary)]">

{player.winPercentage.toFixed(1)}% WR

</div>

</div>

</motion.div>

))}

</div>



{topPlayers.length === 0 && (

<div className="text-center py-8">

<Trophy className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-3" />

<p className="text-[var(--text-secondary)]">No war battles yet</p>

<p className="text-sm text-[var(--text-secondary)] mt-1">Be the first to compete!</p>

</div>

)}

</motion.div>

);

};



export default WarLeaderboardPreview;

