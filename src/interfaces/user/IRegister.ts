export interface IRegister {
    registerUser(nome: string, email: string, celular: string, senha: string): Promise<boolean>;
  }
  