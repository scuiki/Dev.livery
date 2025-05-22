## Padrões de Projeto Aplicados

### Interface Segregation Principle (ISP)

O princípio da Segregação de Interfaces foi aplicado no repositório de usuários (`userRepository.ts`), que anteriormente centralizava todas as funções de login, cadastro e recuperação de dados do usuário.

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

Essas interfaces são implementadas em uma única classe `UserRepository`, mas cada parte da aplicação importa **apenas a interface que realmente utiliza**, seguindo o ISP.

##Aplicações no projeto

```ts
class UserRepository implements ILogin, IRegister, IUserData {
  // implementação dos três métodos
}

export const userRepository = new UserRepository();
```

login.tsx depende apenas da interface ILogin:

```ts
import type { ILogin } from '../interfaces/user/ILogin';
const authService: ILogin = userRepository;

await authService.loginUser(email, senha);
```

register.tsx depende apenas da interface IRegister:

```ts
import type { IRegister } from '../interfaces/user/IRegister';
const registerService: IRegister = userRepository;

await registerService.registerUser(nome, email, celular, senha);
```

profile.tsx depende apenas da interface IUserData, com tipagem segura:

```ts
import type { IUserData } from '../interfaces/user/IUserData';
import type { User } from '../types/User';

const userService: IUserData = userRepository;
const [usuario, setUsuario] = useState<User | null>(null);
```

Esse modelo permite reaproveitamento, facilita testes e está de acordo com a letra I do SOLID.
