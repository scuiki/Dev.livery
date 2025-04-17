import { openDatabaseSync } from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

export const registerUser = (
  nome: string,
  email: string,
  celular: string,
  senha: string
): Promise<boolean> => {
  try {
    const db = openDatabaseSync('devlivery.db');
    const stmt = db.prepareSync(
      'INSERT INTO users (nome, email, celular, senha) VALUES (?, ?, ?, ?);'
    );

    stmt.executeSync([nome, email, celular, senha]);
    stmt.finalizeSync();

    return Promise.resolve(true);
  } catch (error: any) {
    const message = error?.message || '';
    console.log('Erro ao cadastrar:', message);

    if (message.includes('UNIQUE constraint failed: users.email')) {
      alert('Esse e-mail já está cadastrado.');
    } else {
      alert('Erro ao cadastrar: ' + message);
    }

    return Promise.resolve(false);
  }
};

export const loginUser = (
  email: string,
  senha: string
): Promise<boolean> => {
  try {
    const db = openDatabaseSync('devlivery.db');
    const stmt = db.prepareSync(
      'SELECT * FROM users WHERE email = ? AND senha = ?;'
    );

    const result = stmt.executeSync([email, senha]);
    const rows = result.getAllSync();

    stmt.finalizeSync();

    console.log('Resultado loginUser:', rows);
    return Promise.resolve(rows.length > 0);
  } catch (error: any) {
    console.log('Erro no login:', error?.message || error);
    return Promise.resolve(false);
  }
};

export const getCurrentUser = async (): Promise<any | null> => {
  try {
    const email = await SecureStore.getItemAsync('userEmail');
    if (!email) return null;

    const db = openDatabaseSync('devlivery.db');
    const stmt = db.prepareSync('SELECT * FROM users WHERE email = ?;');
    const result = stmt.executeSync([email]);
    const [user] = result.getAllSync();
    stmt.finalizeSync();
    return user ?? null;
  } catch (error: any) {
    console.log('Erro ao buscar usuário logado:', error.message || error);
    return null;
  }
};