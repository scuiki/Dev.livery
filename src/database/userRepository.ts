import * as SecureStore from 'expo-secure-store';
import { ILogin } from '../interfaces/user/ILogin';
import { IRegister } from '../interfaces/user/IRegister';
import { IUserData } from '../interfaces/user/IUserData';
import { User } from '../types/User';

const API_URL = 'http://192.168.2.129:3000';

class UserRepository implements ILogin, IRegister, IUserData {
  async registerUser(nome: string, email: string, celular: string, senha: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, celular, senha }),
      });

      const data = await response.json();

      if (response.ok) return true;
      if (data.error?.includes('UNIQUE')) alert('E-mail já cadastrado.');
      else alert('Erro ao cadastrar: ' + data.error);

      return false;
    } catch (error: any) {
      alert('Erro: ' + error.message);
      return false;
    }
  }

  async loginUser(email: string, senha: string): Promise<boolean> {
    try {
      // ✅ Lógica especial para admin
      if (email === 'admin' && senha === '123') {
        await SecureStore.setItemAsync('userEmail', email);
        return true;
      }

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const user = await response.json();

      if (response.ok && user) {
        await SecureStore.setItemAsync('userEmail', email);
        return true;
      }

      alert('Credenciais inválidas.');
      return false;
    } catch (error: any) {
      alert('Erro ao fazer login: ' + error.message);
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const email = await SecureStore.getItemAsync('userEmail');
      if (!email) return null;

      // Se for admin, retorna manualmente
      if (email === 'admin') {
        return { nome: 'Administrador', email: 'admin' } as User;
      }

      const response = await fetch(`${API_URL}/users/byEmail/${email}`);
      if (!response.ok) return null;

      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  }
}

export const userRepository = new UserRepository();
