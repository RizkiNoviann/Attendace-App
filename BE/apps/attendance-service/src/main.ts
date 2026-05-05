import { NestFactory } from '@nestjs/core';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AttendanceServiceModule } from './attendance-service.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AttendanceServiceModule,
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((value) => value.trim()) ?? true,
    credentials: true,
  });

  const uploadRoot = join(process.cwd(), 'uploads');
  const attendanceUploadPath = join(uploadRoot, 'attendance');

  if (!existsSync(attendanceUploadPath)) {
    mkdirSync(attendanceUploadPath, { recursive: true });
  }

  app.useStaticAssets(uploadRoot, {
    prefix: '/uploads/',
  });

  await app.listen(Number(process.env.ATTENDANCE_PORT ?? 3003));
}
bootstrap();
