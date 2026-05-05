import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { AttendancePrismaService } from './prisma/attendance-prisma.service';

type CreateAttendancePayload = {
  employeeName: string;
  division: string;
  checkInTime: string;
  imageUrl?: string;
  attendanceDate?: string;
};

@Injectable()
export class AttendanceServiceService {
  constructor(private readonly prisma: AttendancePrismaService) {}

  async findAll(date?: string) {
    if (!date) {
      const attendances = await this.prisma.attendance.findMany({
        orderBy: [{ attendanceDate: 'desc' }, { checkInTime: 'asc' }],
      });
      return { data: attendances };
    }

    const dateValue = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(dateValue.getTime())) {
      throw new BadRequestException('Format tanggal tidak valid. Gunakan YYYY-MM-DD.');
    }

    const endDate = new Date(dateValue);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    const attendances = await this.prisma.attendance.findMany({
      where: {
        attendanceDate: {
          gte: dateValue,
          lt: endDate,
        },
      },
      orderBy: {
        checkInTime: 'asc',
      },
    });

    return { data: attendances };
  }

  async create(payload: CreateAttendancePayload, imageFileName?: string) {
    this.assertPayload(payload);

    const attendanceDateValue = payload.attendanceDate
      ? new Date(`${payload.attendanceDate}T00:00:00.000Z`)
      : new Date();

    if (Number.isNaN(attendanceDateValue.getTime())) {
      throw new BadRequestException('Format attendanceDate tidak valid.');
    }

    const attendanceDate = new Date(
      Date.UTC(
        attendanceDateValue.getUTCFullYear(),
        attendanceDateValue.getUTCMonth(),
        attendanceDateValue.getUTCDate(),
      ),
    );
    const nextDate = new Date(attendanceDate);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);

    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        employeeName: payload.employeeName.trim(),
        attendanceDate: {
          gte: attendanceDate,
          lt: nextDate,
        },
      },
    });

    if (existingAttendance) {
      throw new ConflictException('User sudah absen pada tanggal ini.');
    }

    const imageUrl = imageFileName
      ? `/uploads/attendance/${imageFileName}`
      : payload.imageUrl;

    const attendance = await this.prisma.attendance.create({
      data: {
        employeeName: payload.employeeName.trim(),
        division: payload.division.trim(),
        checkInTime: payload.checkInTime.trim(),
        imageUrl,
        attendanceDate,
      },
    });

    return { data: attendance };
  }

  private assertPayload(payload: CreateAttendancePayload) {
    const requiredFields: Array<keyof CreateAttendancePayload> = [
      'employeeName',
      'division',
      'checkInTime',
    ];

    for (const field of requiredFields) {
      const value = payload[field];
      if (typeof value !== 'string' || value.trim() === '') {
        throw new BadRequestException(`Field ${field} wajib diisi.`);
      }
    }
  }
}
