import { existsSync, mkdirSync } from 'fs';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AttendanceServiceService } from './attendance-service.service';

type CreateAttendanceBody = {
  employeeName: string;
  division: string;
  checkInTime: string;
  imageUrl?: string;
  attendanceDate?: string;
};

@Controller('attendance')
export class AttendanceServiceController {
  constructor(private readonly attendanceServiceService: AttendanceServiceService) {}

  @Get()
  findAll(@Query('date') date?: string) {
    return this.attendanceServiceService.findAll(date);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          const uploadPath = join(process.cwd(), 'uploads', 'attendance');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (_request, file, callback) => {
          const fileExtension = extname(file.originalname ?? '').toLowerCase();
          const safeExtension = fileExtension || '.jpg';
          const randomSegment = Math.random().toString(36).slice(2, 10);
          callback(
            null,
            `attendance-${Date.now()}-${randomSegment}${safeExtension}`,
          );
        },
      }),
    }),
  )
  create(@Body() payload: CreateAttendanceBody, @UploadedFile() file?: any) {
    return this.attendanceServiceService.create(payload, file?.filename);
  }
}
