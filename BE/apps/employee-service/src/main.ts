import { NestFactory } from '@nestjs/core';
import { EmployeeServiceModule } from './employee-service.module';

async function bootstrap() {
  const app = await NestFactory.create(EmployeeServiceModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((value) => value.trim()) ?? true,
    credentials: true,
  });

  await app.listen(Number(process.env.EMPLOYEE_PORT ?? 3002));
}
bootstrap();
