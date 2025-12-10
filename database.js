/**
 * Database Module
 * 
 * Handles SQLite database initialization and operations
 * Stores markdown content for the carousel in the Explore screen
 */

import * as SQLite from 'expo-sqlite';

// Open the database (creates it if it doesn't exist)
const db = SQLite.openDatabase('explore.db');

/**
 * Initialize the database
 * Creates the content table and populates it with initial data if empty
 * 
 * @returns {Promise} Resolves when database is ready
 */
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Create the content table if it doesn't exist
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          markdown TEXT NOT NULL
        );`,
        [],
        () => {
          // Check if data already exists
          tx.executeSql(
            'SELECT COUNT(*) as count FROM content',
            [],
            (_, result) => {
              if (result.rows.item(0).count === 0) {
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
                initialData.forEach((markdown, index) => {
                  tx.executeSql(
                    'INSERT INTO content (markdown) VALUES (?)',
                    [markdown],
                    () => {
                      // Resolve promise after last insert
                      if (index === initialData.length - 1) {
                        resolve();
                      }
                    },
                    (_, error) => {
                      reject(error);
                      return false;
                    }
                  );
                });
              } else {
                // Data already exists, no need to insert
                resolve();
              }
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

/**
 * Retrieve all content from the database
 * 
 * @returns {Promise<Array>} Array of content objects with id and markdown properties
 */
export const getContent = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM content ORDER BY id',
        [],
        (_, result) => {
          // Convert result rows to array
          const content = [];
          for (let i = 0; i < result.rows.length; i++) {
            content.push(result.rows.item(i));
          }
          resolve(content);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
