// _utils/database.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('splittrack.db');

export const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        amount REAL,
        created_at TEXT
      );`
    );
  });
};

export const addExpense = (description, amount) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO expenses (description, amount, created_at) VALUES (?, ?, ?)`,
      [description, amount, new Date().toISOString()]
    );
  });
};

export const getExpenses = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM expenses ORDER BY created_at DESC`,
      [],
      (_, { rows }) => callback(rows._array)
    );
  });
};
