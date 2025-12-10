/**
 * Database Module
 * 
 * Handles SQLite database initialization and operations
 * Stores markdown content for the carousel in the Explore screen
 * 
 * Note: Using expo-sqlite 16.0.0+ with new async API
 */

import * as SQLite from 'expo-sqlite';

/**
 * Initialize the database
 * Creates the content table and populates it with initial data if empty
 * 
 * @returns {Promise} Resolves when database is ready
 */
export const initDatabase = async () => {
  try {
    // Open the database (creates it if it doesn't exist)
    const db = await SQLite.openDatabaseAsync('explore.db');
    
    // Create the content table if it doesn't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        markdown TEXT NOT NULL
      );
    `);
    
    // Check if data already exists
    const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM content');
    
    if (result.count === 0) {
      // Insert initial markdown content if table is empty
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

      // Insert each markdown item into the database
      for (const markdown of initialData) {
        await db.runAsync('INSERT INTO content (markdown) VALUES (?)', [markdown]);
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Retrieve all content from the database
 * 
 * @returns {Promise<Array>} Array of content objects with id and markdown properties
 */
export const getContent = async () => {
  try {
    // Open the database
    const db = await SQLite.openDatabaseAsync('explore.db');
    
    // Fetch all content ordered by id
    const allRows = await db.getAllAsync('SELECT * FROM content ORDER BY id');
    
    return allRows;
  } catch (error) {
    console.error('Error getting content:', error);
    throw error;
  }
};
