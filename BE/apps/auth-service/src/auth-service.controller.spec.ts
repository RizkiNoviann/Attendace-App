import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';

describe('AuthServiceController', () => {
  let authServiceController: AuthServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthServiceController],
      providers: [
        {
          provide: AuthServiceService,
          useValue: {
            login: jest.fn(),
            logout: jest.fn(),
            getProfile: jest.fn(),
            createAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    authServiceController = app.get<AuthServiceController>(AuthServiceController);
  });

  it('should be defined', () => {
    expect(authServiceController).toBeDefined();
  });
});
