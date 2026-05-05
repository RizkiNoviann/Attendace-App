import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeServiceController } from './employee-service.controller';
import { EmployeeServiceService } from './employee-service.service';

describe('EmployeeServiceController', () => {
  let employeeServiceController: EmployeeServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeServiceController],
      providers: [
        {
          provide: EmployeeServiceService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    employeeServiceController = app.get<EmployeeServiceController>(EmployeeServiceController);
  });

  it('should be defined', () => {
    expect(employeeServiceController).toBeDefined();
  });
});
