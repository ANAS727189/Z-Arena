# Z-Challenger Database Schema Documentation

## Database Collections Overview

This document outlines the complete Appwrite database schema for the Z-Challenger application, including all collections, their columns, relationships, and data flow.

---

## 📊 Collections Summary

| Collection | Purpose | Key Relationships |
|------------|---------|------------------|
| `users` | User statistics and profile data | Primary entity, referenced by all other collections |
| `submissions` | Code submission records | Links to users and challenges |
| `user_achievements` | User achievement tracking | Links to users |
| `stars` | Star level definitions | Referenced by user stats |
| `user_rankings` | Ranking data by period | Links to users |
| `leaderboard` | Cached leaderboard data | Aggregated user data |

---

## 📋 Detailed Schema

### 1. Users Collection (`users`)
**Purpose**: Central user profile and statistics management

| Column | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `$id` | String | ✓ | NULL | Auto-generated document ID |
| `userId` | String(50) | ✓ | NULL | User identifier |
| `totalSubmissions` | Integer | | 0 | Total code submissions |
| `successfulSubmissions` | Integer | | 0 | Successful submissions count |
| `totalPoints` | Integer | | 0 | Total points earned |
| `solvedChallenges` | Array(50) | | NULL | Array of solved challenge IDs |
| `preferredLanguages` | Array(20) | | NULL | User's preferred programming languages |
| `rank` | Integer | | 0 | Current global rank |
| `level` | String(20) | | "beginner" | User skill level |
| `$createdAt` | DateTime | ✓ | NULL | Account creation timestamp |
| `$updatedAt` | DateTime | ✓ | NULL | Last update timestamp |
| `globalRank` | Integer | | 0 | Global leaderboard position |
| `weeklyRank` | Integer | | 0 | Weekly leaderboard position |
| `monthlyRank` | Integer | | 0 | Monthly leaderboard position |
| `weeklyPoints` | Integer | | 0 | Points earned this week |
| `monthlyPoints` | Integer | | 0 | Points earned this month |
| `lastActive` | DateTime | | NULL | Last activity timestamp |
| `streak` | Integer | | 0 | Current solving streak |
| `bestStreak` | Integer | | 0 | Best streak achieved |
| `avgSolveTime` | Integer | | 0 | Average solve time in seconds |
| `country` | String(1000) | | "India" | User's country |
| `profilePicture` | String(10000) | | NULL | Profile picture URL |
| `isPublic` | Boolean | | true | Profile visibility setting |
| `starPoints` | Integer | | 0 | Points for star calculation |
| `currentStars` | Integer | | 0 | Current star level |
| `starTitle` | String(1000) | | "Noob" | Current star title |
| `easyChallengesSolved` | Integer | | 0 | Easy challenges completed |
| `mediumChallengesSolved` | Integer | | 0 | Medium challenges completed |
| `hardChallengesSolved` | Integer | | 0 | Hard challenges completed |
| `achievements` | Array(100000) | | NULL | Array of achievement IDs |
| `badgesEarned` | Array(10000) | | NULL | Array of earned badges |
| `nextStarRequirement` | Integer | | 5 | Points needed for next star |

### 2. Submissions Collection (`submissions`)
**Purpose**: Track all code submissions and their results

| Column | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `$id` | String | ✓ | NULL | Auto-generated document ID |
| `userId` | String(50) | ✓ | NULL | Reference to user |
| `challengeId` | String(50) | ✓ | NULL | Reference to challenge |
| `language` | String(20) | ✓ | NULL | Programming language used |
| `code` | String(50000) | ✓ | NULL | Submitted code |
| `status` | String | ✓ | NULL | Submission status |
| `score` | Integer | | 0 | Points earned |
| `runtime` | Integer | | 0 | Execution time in ms |
| `memoryUsed` | Integer | | 0 | Memory usage in bytes |
| `testResults` | String(10000) | ✓ | NULL | JSON test results |
| `submittedAt` | DateTime | ✓ | NULL | Submission timestamp |
| `starPointsEarned` | Integer | | 0 | Star points from submission |
| `difficultyLevel` | String(1000) | | NULL | Challenge difficulty |
| `solveTime` | Integer | | 0 | Time to solve in seconds |
| `attempts` | Integer | | 1 | Number of attempts |
| `hintsUsed` | Integer | | 0 | Number of hints used |
| `isFirstSolve` | Boolean | | false | First time solving flag |
| `$createdAt` | DateTime | ✓ | NULL | Creation timestamp |
| `$updatedAt` | DateTime | ✓ | NULL | Update timestamp |

### 3. User Achievements Collection (`user_achievements`)
**Purpose**: Track user achievements and badges

| Column | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `$id` | String | ✓ | NULL | Auto-generated document ID |
| `userId` | String(10000) | ✓ | NULL | Reference to user |
| `achievementId` | String(1000) | ✓ | NULL | Achievement identifier |
| `achievementType` | String(1000) | ✓ | NULL | Type of achievement |
| `title` | String(1000) | ✓ | NULL | Achievement title |
| `description` | String(1000) | ✓ | NULL | Achievement description |
| `earnedAt` | DateTime | ✓ | NULL | When achievement was earned |
| `metadata` | String(1000) | | NULL | Additional achievement data |
| `$createdAt` | DateTime | ✓ | NULL | Creation timestamp |
| `$updatedAt` | DateTime | ✓ | NULL | Update timestamp |

### 4. Stars Collection (`stars`)
**Purpose**: Define star levels and requirements

| Column | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `$id` | String | ✓ | NULL | Auto-generated document ID |
| `starLevel` | Integer | ✓ | NULL | Star level (0-7) |
| `title` | String(1000) | ✓ | NULL | Star level title |
| `pointsRequired` | Integer | ✓ | NULL | Points needed for this level |
| `color` | String(1000) | ✓ | NULL | Star color/theme |
| `icon` | String(1000) | | NULL | Star icon identifier |
| `$createdAt` | DateTime | ✓ | NULL | Creation timestamp |
| `$updatedAt` | DateTime | ✓ | NULL | Update timestamp |

### 5. User Rankings Collection (`user_rankings`)
**Purpose**: Store historical ranking data

| Column | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `$id` | String | ✓ | NULL | Auto-generated document ID |
| `userId` | String(10000) | ✓ | NULL | Reference to user |
| `rankingType` | String(1000) | ✓ | NULL | Type of ranking |
| `rank` | Integer | ✓ | NULL | Rank position |
| `points` | Integer | ✓ | NULL | Points at time of ranking |
| `starPoints` | Integer | ✓ | NULL | Star points at ranking |
| `challengesSolved` | Integer | ✓ | NULL | Challenges solved count |
| `currentStars` | Integer | ✓ | NULL | Star level at ranking |
| `period` | String(1000) | ✓ | NULL | Ranking period (daily/weekly/monthly) |
| `createdAt` | DateTime | ✓ | NULL | Ranking snapshot time |
| `$createdAt` | DateTime | ✓ | NULL | Creation timestamp |
| `$updatedAt` | DateTime | ✓ | NULL | Update timestamp |

### 6. Leaderboard Collection (`leaderboard`)
**Purpose**: Cache computed leaderboard data

| Column | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `$id` | String | ✓ | NULL | Auto-generated document ID |
| `type` | String(1000) | ✓ | NULL | Leaderboard type |
| `filter` | String(1000) | | NULL | Filter criteria |
| `data` | String(10000) | ✓ | NULL | JSON leaderboard data |
| `lastUpdated` | DateTime | ✓ | NULL | Last update timestamp |
| `expiresAt` | DateTime | ✓ | NULL | Cache expiration time |
| `$createdAt` | DateTime | ✓ | NULL | Creation timestamp |
| `$updatedAt` | DateTime | ✓ | NULL | Update timestamp |

---

## 🔗 Relationships & Data Flow

### Primary Relationships:
1. **Users → Submissions**: One-to-many (userId)
2. **Users → User Achievements**: One-to-many (userId)
3. **Users → User Rankings**: One-to-many (userId)
4. **Stars → Users**: One-to-many (referenced by currentStars)
5. **Leaderboard**: Aggregated data from Users collection

### Data Flow:
1. User submits code → Creates Submission record
2. Successful submission → Updates User stats
3. User stats update → Triggers achievement checks
4. Achievement earned → Creates User Achievement record
5. Periodic ranking calculation → Creates User Ranking records
6. Leaderboard cache refresh → Updates Leaderboard collection

---

## 📈 Indexing Strategy

### Recommended Indexes:
- `users.userId` (Primary lookup)
- `submissions.userId` (User submissions)
- `submissions.challengeId` (Challenge submissions)
- `user_achievements.userId` (User achievements)
- `user_rankings.userId` (User rankings)
- `user_rankings.period` (Period-based queries)
- `leaderboard.type` (Leaderboard type lookup)

---

## 🚀 Performance Considerations

1. **User Stats**: Frequently updated, consider atomic operations
2. **Submissions**: High-volume collection, partition by date
3. **Leaderboard**: Cached data with TTL for performance
4. **Rankings**: Historical data, consider archiving strategy
5. **Achievements**: Append-only, optimized for reads

---

## 🔒 Security Rules

Each collection should implement:
- User-based access control
- Read permissions for public profiles
- Write permissions for authenticated users only
- Admin-only access for system collections (stars, leaderboard)