import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceServiceController } from './attendance-service.controller';
import { AttendanceServiceService } from './attendance-service.service';

describe('AttendanceServiceController', () => {
  let attendanceServiceController: AttendanceServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceServiceController],
      providers: [
        {
          provide: AttendanceServiceService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    attendanceServiceController = app.get<AttendanceServiceController>(AttendanceServiceController);
  });

  it('should be defined', () => {
    expect(attendanceServiceController).toBeDefined();
  });
});
