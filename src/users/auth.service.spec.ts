import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  const users: User[] = [];

  beforeEach(async () => {
    fakeUserService = {
      find: (email: string) => {
        const filteredResults = users.filter((user) => user.email === email);
        return Promise.resolve(filteredResults);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 10000), email, password };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should create an new user with salted and hashed password', async () => {
    const user = await service.singup('asdf@gmail.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error when user signup with existing email', async () => {
    await service.singup('abc@gmail.com', '1234');

    try {
      await service.singup('abc@gmail.com', '1234');
    } catch (error) {
      expect(error.message).toBe('Email in use');
    }
  });

  it('throws if signin is called with an unused email.', async () => {
    try {
      await service.signIn('done@gmail.com', '1234');
    } catch (error) {
      expect(error.message).toBe('User not found!');
    }
  });

  it('throws if an invalid password is provided', (done) => {
    service.singup('pratham@gmail.com', '123456');

    service
      .signIn('pratham@gmail.com', '12345')
      .then()
      .catch(() => done());
  });

  it('returns a user if correct password is provided.', async () => {
    await service.singup('asdfg@gmail.com', '1234');

    const user = await service.signIn('asdfg@gmail.com', '1234');
    expect(user).toBeDefined();
    expect(user).toHaveProperty('email', 'asdfg@gmail.com');
  });
});
