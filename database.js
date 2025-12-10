/**
 * Database Module (Expo SDK 50+ compatible)
 * 
 * Uses the new async SQLite API from expo-sqlite/next
 */

import { openDatabase } from 'expo-sqlite/next';

// Create/open the database asynchronously
let dbPromise = null;

const getDb = async () => {
  if (!dbPromise) {
    dbPromise = openDatabase('explore.db');
  }
  return dbPromise;
};

/**
 * Initialize the database:
 * - Creates table if not exists
 * - Inserts initial data if table is empty
 */
export const initDatabase = async () => {
  const db = await getDb();

  // Create the table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      markdown TEXT NOT NULL
    );
  `);

  // Count rows
  const co
