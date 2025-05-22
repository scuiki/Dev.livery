import { openDatabaseSync } from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import { ILogin } from '../interfaces/user/ILogin';
import { IRegister } from '../interfaces/user/IRegister';
import { IUserData } from '../interfaces/user/IUserData';

class UserRepository implements ILogin, IRegister, IUserData {
  async registerUser(nome: string, email: string, celular: string, senha: string): Promise<boolean> {
    try {
      const db = openDatabaseSync('devlivery.db');
      const stmt = db.prepareSync('INSERT INTO users (nome, email, celular, senha) VALUES (?, ?, ?, ?);');
      stmt.executeSync([nome, email, celular, senha]);
      stmt.finalizeSync();
      return true;
    } catch (error: any) {
      const message = error?.message || '';
      if (message.includes('UNIQUE constraint failed: users.email')) {
        alert('Esse e-mail já está cadastrado.');
      } else {
        alert('Erro ao cadastrar: ' + message);
      }
      return false;
    }
  }

  async loginUser(email: string, senha: string): Promise<boolean> {
    try {
      const db = openDatabaseSync('devlivery.db');
      const stmt = db.prepareSync('SELECT * FROM users WHERE email = ? AND senha = ?;');
      const result = stmt.executeSync([email, senha]);
      const rows = result.getAllSync();
      stmt.finalizeSync();
      return rows.length > 0;
    } catch (error: any) {
      console.log('Erro no login:', error?.message || error);
      return false;
    }
  }

  async getCurrentUser(): Promise<any | null> {
    try {
      const email = await SecureStore.getItemAsync('userEmail');
      if (!email) return null;

      const db = openDatabaseSync('devlivery.db');
      const stmt = db.prepareSync('SELECT * FROM users WHERE email = ?;');
      const result = stmt.executeSync([email]);
      const user = result.getAllSync()[0];
      stmt.finalizeSync();

      return user || null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  }
}

export const userRepository = new UserRepository();
