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
  const countResult = await db.getFirstAsync(
    'SELECT COUNT(*) AS count FROM content'
  );

  if (countResult.count === 0) {
    const initialData = [
      `# Welcome to Explore

This is the **first** content item with *markdown* formatting.

## Features

- Swipe left or right to navigate
- Markdown support
- SQLite storage

### Links

Visit [React Native](https://reactnative.dev) for more info.`,
      `# Second Item

This is the **second** piece of content.

## Highlights

1. Numbered lists
2. Bold and *italic* text
3. Multiple heading levels

### More Info

Check out this [link](https://expo.dev) for details.`,
      `# Third Content

Welcome to the **third** and *final* item!

## Summary

- Three items total
- Swipe to explore
- Markdown rendering

Visit [GitHub](https://github.com) to learn more.`
    ];

    // Insert markdown items inside a single transaction
    await db.withTransactionAsync(async () => {
      for (const markdown of initialData) {
        await db.runAsync(
          'INSERT INTO content (markdown) VALUES (?)',
          [markdown]
        );
      }
    });
  }
};

/**
 * Retrieve all content rows from the database
 */
export const getContent = async () => {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM content ORDER BY id'
  );
  return rows;
};
