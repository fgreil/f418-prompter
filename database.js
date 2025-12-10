import * as SQLite from 'expo-sqlite/legacy';

let db = null;

try {
  db = SQLite.openDatabase('explore.db');
} catch (error) {
  console.warn('[SQLite] Could not open database:', error);
  db = null;
}

/**
 * Initialize the database safely.
 */
export const initDatabase = () => {
  return new Promise((resolve) => {
    if (!db) {
      console.warn('[SQLite] initDatabase: DB unavailable — continuing without SQLite.');
      resolve();
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            markdown TEXT NOT NULL
        );`,
        [],
        () => {
          tx.executeSql(
            'SELECT COUNT(*) AS count FROM content',
            [],
            (_, result) => {
              const count = result?.rows?.item(0)?.count ?? 0;
              if (count === 0) {
                const initialData = [
                  `# Welcome...`,
                  `# Second...`,
                  `# Third...`
                ];

                initialData.forEach((markdown, index) => {
                  tx.executeSql(
                    'INSERT INTO content (markdown) VALUES (?)',
                    [markdown],
                    () => {
                      if (index === initialData.length - 1) resolve();
                    },
                    (_, error) => {
                      console.warn('[SQLite] Insert failed:', error);
                      resolve();
                      return false;
                    }
                  );
                });
              } else {
                resolve();
              }
            },
            (_, error) => {
              console.warn('[SQLite] Count failed:', error);
              resolve();
              return false;
            }
          );
        },
        (_, error) => {
          console.warn('[SQLite] Table creation failed:', error);
          resolve();
          return false;
        }
      );
    });
  });
};


/**
 * Retrieve all content (never throws)
 */
export const getContent = () => {
  return new Promise(resolve => {
    if (!db) {
      console.warn('[SQLite] getContent: DB unavailable — returning empty.');
      resolve([]);
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM content ORDER BY id',
        [],
        (_, result) => {
          const rows = [];
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i));
          }
          resolve(rows);
        },
        (_, error) => {
          console.warn('[SQLite] Query failed:', error);
          resolve([]);
          return false;
        }
      );
    });
  });
};
