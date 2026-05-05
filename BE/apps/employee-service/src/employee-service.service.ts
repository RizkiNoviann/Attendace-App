import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EmployeePrismaService } from './prisma/employee-prisma.service';
import { Role } from './generated/prisma';

type CreateEmployeePayload = {
  name: string;
  email: string;
  password: string;
  division: string;
  position: string;
  role?: string;
};

type UpdateEmployeePayload = {
  name: string;
  email: string;
  password: string;
  division: string;
  position: string;
  role?: string;
};

@Injectable()
export class EmployeeServiceService {
  constructor(private readonly prisma: EmployeePrismaService) {}

  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001';

  async findAll(token: string) {
    await this.assertAdminToken(token);

    const employees = await this.prisma.employee.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: employees };
  }

  async create(payload: CreateEmployeePayload, token: string) {
    await this.assertAdminToken(token);
    this.assertCreatePayload(payload);

    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email: payload.email },
    });

    if (existingEmployee) {
      throw new ConflictException('Email sudah terdaftar.');
    }

    const role = payload.role?.toUpperCase() === Role.ADMIN ? Role.ADMIN : Role.USER;

    const employee = await this.prisma.employee.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        division: payload.division,
        position: payload.position,
        role,
      },
    });

    try {
      await this.syncAuthAccount({
        employeeId: employee.id,
        ...payload,
        role,
      });
    } catch (error) {
      await this.prisma.employee.delete({
        where: { id: employee.id },
      });
      throw error;
    }

    return { data: employee };
  }

  async update(idValue: string, payload: UpdateEmployeePayload, token: string) {
    await this.assertAdminToken(token);
    const id = this.toEmployeeId(idValue);
    this.assertCreatePayload(payload);

    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Akun tidak ditemukan.');
    }

    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email: payload.email },
    });

    if (existingEmployee && existingEmployee.id !== id) {
      throw new ConflictException('Email sudah terdaftar.');
    }

    const role = payload.role?.toUpperCase() === Role.ADMIN ? Role.ADMIN : Role.USER;

    const updatedEmployee = await this.prisma.employee.update({
      where: { id },
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        division: payload.division,
        position: payload.position,
        role,
      },
    });

    try {
      await this.syncAuthAccountUpdate(id, {
        ...payload,
        role,
      });
    } catch (error) {
      await this.prisma.employee.update({
        where: { id },
        data: {
          name: employee.name,
          email: employee.email,
          password: employee.password,
          division: employee.division,
          position: employee.position,
          role: employee.role,
        },
      });
      throw error;
    }

    return { data: updatedEmployee };
  }

  async remove(idValue: string, token: string) {
    await this.assertAdminToken(token);
    const id = this.toEmployeeId(idValue);

    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Akun tidak ditemukan.');
    }

    await this.syncAuthAccountDelete(id);

    await this.prisma.employee.delete({
      where: { id },
    });

    return { message: 'Akun berhasil dihapus.' };
  }

  private async syncAuthAccount(payload: {
    employeeId: number;
    name: string;
    email: string;
    password: string;
    division: string;
    position: string;
    role: Role;
  }) {
    const response = await fetch(`${this.authServiceUrl}/auth/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-token': process.env.AUTH_INTERNAL_TOKEN ?? '',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await this.readErrorMessage(response);
      throw new BadGatewayException(
        message ?? 'Sinkronisasi akun auth gagal dilakukan.',
      );
    }
  }

  private async syncAuthAccountUpdate(
    employeeId: number,
    payload: {
      name: string;
      email: string;
      password: string;
      division: string;
      position: string;
      role: Role;
    },
  ) {
    const response = await fetch(`${this.authServiceUrl}/auth/accounts/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-token': process.env.AUTH_INTERNAL_TOKEN ?? '',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await this.readErrorMessage(response);
      throw new BadGatewayException(
        message ?? 'Sinkronisasi update akun auth gagal dilakukan.',
      );
    }
  }

  private async syncAuthAccountDelete(employeeId: number) {
    const response = await fetch(`${this.authServiceUrl}/auth/accounts/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'x-internal-token': process.env.AUTH_INTERNAL_TOKEN ?? '',
      },
    });

    if (!response.ok) {
      const message = await this.readErrorMessage(response);
      throw new BadGatewayException(
        message ?? 'Sinkronisasi hapus akun auth gagal dilakukan.',
      );
    }
  }

  private async assertAdminToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan.');
    }

    const response = await fetch(`${this.authServiceUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException('Token tidak valid.');
    }

    const result = (await response.json()) as {
      user?: {
        role?: string;
      };
    };

    if (result.user?.role !== Role.ADMIN) {
      throw new ForbiddenException('Hanya admin yang dapat mengelola akun.');
    }
  }

  private assertCreatePayload(payload: CreateEmployeePayload) {
    const requiredFields: Array<keyof CreateEmployeePayload> = [
      'name',
      'email',
      'password',
      'division',
      'position',
    ];

    for (const field of requiredFields) {
      const value = payload[field];
      if (typeof value !== 'string' || value.trim() === '') {
        throw new BadRequestException(`Field ${field} wajib diisi.`);
      }
    }
  }

  private async readErrorMessage(response: Response): Promise<string | null> {
    try {
      const data = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(data.message)) {
        return data.message.join(', ');
      }
      if (typeof data.message === 'string') {
        return data.message;
      }
      return null;
    } catch {
      return null;
    }
  }

  private toEmployeeId(idValue: string): number {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID akun tidak valid.');
    }
    return id;
  }
}
