## Padrões de Projeto Aplicados

### Interface Segregation Principle (ISP)

O princípio da Segregação de Interfaces foi aplicado no repositório de usuários (`userRepository.ts`), que anteriormente centralizava todas as funções relacionadas a login, cadastro e dados do usuário.

Para atender ao ISP, foram criadas três interfaces separadas:

```ts
// ILogin.ts
export interface ILogin {
  loginUser(email: string, senha: string): Promise<boolean>;
}

// IRegister.ts
export interface IRegister {
  registerUser(nome: string, email: string, celular: string, senha: string): Promise<boolean>;
}

// IUserData.ts
export interface IUserData {
  getCurrentUser(): Promise<any | null>;
}
```

Essas interfaces são implementadas em uma única classe `UserRepository`, mas cada parte da aplicação importa **apenas a interface que realmente utiliza**, reduzindo acoplamento e melhorando a organização.

```ts
class UserRepository implements ILogin, IRegister, IUserData {
  // implementação dos três métodos
}

export const userRepository = new UserRepository();
```

Exemplo de uso em uma tela que só precisa da função de login:

```ts
import type { ILogin } from '../interfaces/user/ILogin';
const authService: ILogin = userRepository;

await authService.loginUser(email, senha);
```

Esse modelo permite reaproveitamento, facilita testes e está de acordo com a letra I do SOLID.
