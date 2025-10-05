import { Client, Account, Databases, Storage, Query } from 'appwrite';

// Appwrite configuration
const APPWRITE_ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID =
  import.meta.env.VITE_APPWRITE_PROJECT_ID || '68debdc70018c2c2a3f3';
const APPWRITE_DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID || '68debe350002d7856a53';
const APPWRITE_CHALLENGES_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_CHALLENGES_COLLECTION_ID || 'challenges';
const APPWRITE_SUBMISSIONS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID || 'submissions';
const APPWRITE_USERS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';
const APPWRITE_STARS_LEVELS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_STARS_LEVELS_COLLECTION_ID || 'stars';
const APPWRITE_ACHIEVEMENTS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_ACHIEVEMENTS_COLLECTION_ID || 'user_achievements';
const APPWRITE_LEADERBOARD_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_LEADERBOARD_COLLECTION_ID || 'leaderboard';
const APPWRITE_USER_RANKINGS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_USER_RANKINGS_COLLECTION_ID || 'user_rankings';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DATABASE_ID = APPWRITE_DATABASE_ID;
export const COLLECTIONS = {
  CHALLENGES: APPWRITE_CHALLENGES_COLLECTION_ID,
  SUBMISSIONS: APPWRITE_SUBMISSIONS_COLLECTION_ID,
  USERS: APPWRITE_USERS_COLLECTION_ID,
  STARS: APPWRITE_STARS_LEVELS_COLLECTION_ID,
  USER_ACHIEVEMENTS: APPWRITE_ACHIEVEMENTS_COLLECTION_ID,
  LEADERBOARD: APPWRITE_LEADERBOARD_COLLECTION_ID,
  USER_RANKINGS: APPWRITE_USER_RANKINGS_COLLECTION_ID,
};

// Query helpers
export { Query };

// Export the client for advanced usage
export { client };
