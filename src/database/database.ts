import { openDatabaseSync } from 'expo-sqlite';

export const initDB = () => {
  const db = openDatabaseSync('devlivery.db');

  const stmt = db.prepareSync(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      celular TEXT,
      senha TEXT NOT NULL
    )`
  );

  stmt.executeSync();
  stmt.finalizeSync();
};
