import { Module } from '@nestjs/common';
import { AttendanceServiceController } from './attendance-service.controller';
import { AttendanceServiceService } from './attendance-service.service';
import { AttendancePrismaService } from './prisma/attendance-prisma.service';

@Module({
  imports: [],
  controllers: [AttendanceServiceController],
  providers: [AttendanceServiceService, AttendancePrismaService],
})
export class AttendanceServiceModule {}
