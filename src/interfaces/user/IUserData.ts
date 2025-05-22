import type { User } from '../../types/User';

export interface IUserData {
  getCurrentUser(): Promise<User | null>;
}
