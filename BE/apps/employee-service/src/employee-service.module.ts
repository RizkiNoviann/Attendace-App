import { Module } from '@nestjs/common';
import { EmployeeServiceController } from './employee-service.controller';
import { EmployeeServiceService } from './employee-service.service';
import { EmployeePrismaService } from './prisma/employee-prisma.service';

@Module({
  imports: [],
  controllers: [EmployeeServiceController],
  providers: [EmployeeServiceService, EmployeePrismaService],
})
export class EmployeeServiceModule {}
