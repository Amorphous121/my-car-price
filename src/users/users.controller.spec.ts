import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      getUserById: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdf@gmail.com',
          password: '1234',
        });
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '12345' }]);
      },
    };
    fakeAuthService = {
      // singup: () => {},
      // signIn: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
