import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RequestWithUser } from '../auth/model/request-with-user';
import { FirebaseModule } from 'nestjs-firebase';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUserService = {
    createUser: jest.fn(),
    getUser: jest.fn(),
  };

  const mockRequestWithUser: RequestWithUser = {
    user: {
      uid: 'mockUid',
      email: 'test@example.com',
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],

      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const mockUser = {
      username: 'testuser',
    };

    mockUserService.createUser.mockReturnValueOnce(Promise.resolve());

    const result = await controller.createUser(mockUser, mockRequestWithUser);

    expect(mockUserService.createUser).toHaveBeenCalledWith(mockUser, mockRequestWithUser.user.uid, mockRequestWithUser.user.email);
    expect(result).toEqual(201);
  });

  it('should get user', async () => {
    const mockResult = {
      username: 'testuser',
      uid: 'mockUid',
      email: 'test@example.com',
    };

    mockUserService.getUser.mockReturnValueOnce(Promise.resolve(mockResult));

    const result = await controller.getUser(mockRequestWithUser);

    expect(mockUserService.getUser).toHaveBeenCalledWith(mockRequestWithUser.user.uid);
    expect(result).toEqual(mockResult);
  });
});
