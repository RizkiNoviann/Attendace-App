import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { AuthPrismaService } from './prisma/auth-prisma.service';

@Module({
  imports: [],
  controllers: [AuthServiceController],
  providers: [AuthServiceService, AuthPrismaService],
})
export class AuthServiceModule {}
