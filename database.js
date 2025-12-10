/**
 * Database Module - UPDATED
 * 
 * Handles SQLite database initialization and operations
 * Now includes: search history, view history, and favorites (future)
 */

import * as SQLite from 'expo-sqlite';

/**
 * Initialize the database
 * Creates all necessary tables
 */
export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('explore.db');
    
    // Create content table (existing)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        markdown TEXT NOT NULL
      );
    `);
    
    // NEW: Create search history table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        keyword TEXT NOT NULL UNIQUE,
        timestamp INTEGER NOT NULL
      );
    `);
    
    // NEW: Create view history table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS view_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        title TEXT NOT NULL,
        image TEXT,
        teaser TEXT,
        timestamp INTEGER NOT NULL,
        date TEXT NOT NULL
      );
    `);
    
    // Insert initial content if empty (existing logic)
    const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM content');
    
    if (result.count === 0) {
      const initialData = [
        `# Welcome to Explore\n\nThis is the **first** content item with *markdown* formatting.\n\n## Features\n\n- Swipe left or right to navigate\n- Markdown support\n- SQLite storage\n\n### Links\n\nVisit [React Native](https://reactnative.dev) for more info.`,
        `# Second Item\n\nThis is the **second** piece of content.\n\n## Highlights\n\n1. Numbered lists\n2. Bold and *italic* text\n3. Multiple heading levels\n\n### More Info\n\nCheck out this [link](https://expo.dev) for details.`,
        `# Third Content\n\nWelcome to the **third** and *final* item!\n\n## Summary\n\n- Three items total\n- Swipe to explore\n- Markdown rendering\n\nVisit [GitHub](https://github.com) to learn more.`
      ];

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
 * Get all content (existing)
 */
export const getContent = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('explore.db');
    const allRows = await db.getAllAsync('SELECT * FROM content ORDER BY id');
    return allRows;
  } catch (error) {
    console.error('Error getting content:', error);
    throw error;
  }
};

// ============================================================
// SEARCH HISTORY FUNCTIONS
// ============================================================

/**
 * Get all search history keywords
 * @returns {Promise<Array<string>>} Array of search keywords (newest first)
 */
export const getSearchHistory = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('explore.db');
    const rows = await db.getAllAsync(
      'SELECT keyword FROM search_history ORDER BY timestamp DESC LIMIT 20'
    );
    return rows.map(row => row.keyword);
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

/**
 * Add a search keyword to history
 * Updates timestamp if keyword already exists
 * @param {string} keyword - Search term to save
 * @returns {Promise<Array<string>>} Updated history array
 */
export const addSearchKeyword = async (keyword) => {
  try {
    const db = await SQLite.openDatabaseAsync('explore.db');
    const timestamp = Date.now();
    
    // Insert or update (REPLACE will update if keyword exists)
    await db.runAsync(
      'INSERT OR REPLACE INTO search_history (keyword, timestamp) VALUES (?, ?)',
      [keyword.trim(), timestamp]
    );
    
    return await getSearchHistory();
  } catch (error) {
    console.error('Error adding search keyword:', error);
    throw error;
  }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('explore.db');
    await db.runAsync('DELETE FROM search_history');
  } catch (error) {
    console.error('Error clearing search history:', error);
    throw error;
  }
};

// ============================================================
// VIEW HISTORY FUNCTIONS
// ============================================================

/**
 * Add an article to view history
 * @param {Object} article - Article object with label, title, image, teaser
 */
export const addToViewHistory = async (article) => {
  try {
    const db = await SQLite.openDatabaseAsync('explore.db');
    const timestamp = Date.now();
    
    // Format date as "Month Day, Year" (e.g., "December 10, 2025")
    const date = new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Check if article already exists in history
    const existing = await db.getFirstAsync(
      'SELECT id FROM view_history WHERE label = ?',
      [article.label]
    );
    
    if (existing) {
      // Update timestamp and date for existing entry
      await db.runAsync(
        'UPDATE view_history SET timestamp = ?, date = ? WHERE label = ?',
        [timestamp, date, article.label]
      );
    } else {
      // Insert new entry
      await db.runAsync(
        'INSERT INTO view_history (label, title, image, teaser, timestamp, date) VALUES (?, ?, ?, ?, ?, ?)',
        [article.label, article.title, article.image || '', article.teaser || '', timestamp, date]
      );
    }
  } catch (error) {
    console.error('Error adding to view history:', error);
    throw error;
  }
};

/**
 * Get all view history grouped by date
 * @returns {Promise<Array>} Array of objects with date and articles
 */
export const getViewHistory = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('explore.db');
    const rows = await db.getAllAsync(
      'SELECT * FROM view_history ORDER BY timestamp DESC'
    );
    
    // Group by date
    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.date]) {
        grouped[row.date] = [];
      }
      grouped[row.date].push(row);
    });
    
    // Convert to array format: [{title: "Dec 10, 2025", data: [articles]}]
    return Object.keys(grouped).map(date => ({
      title: date,
      data: grouped[date]
    }));
  } catch (error) {
    console.error('Error getting view history:', error);
    return [];
  }
};

/**
 * Clear all view history
 */
export const clearViewHistory = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('explore.db');
    await db.runAsync('DELETE FROM view_history');
  } catch (error) {
    console.error('Error clearing view history:', error);
    throw error;
  }
};