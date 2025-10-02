import { Client, Account, Databases, Storage, Query } from 'appwrite';

// Appwrite configuration - Replace with your actual values
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id';
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'z-challenge-db';
const APPWRITE_CHALLENGES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CHALLENGES_COLLECTION_ID || 'challenges';
const APPWRITE_SUBMISSIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID || 'submissions';
const APPWRITE_USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';

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
};

// Query helpers
export { Query };

// Export the client for advanced usage
export { client };