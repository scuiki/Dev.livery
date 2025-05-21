export interface ILogin {
    loginUser(email: string, senha: string): Promise<boolean>;
  }
  