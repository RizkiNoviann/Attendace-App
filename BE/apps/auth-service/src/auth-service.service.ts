import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { Role } from './generated/prisma';
import { AuthPrismaService } from './prisma/auth-prisma.service';

type AuthAccountPayload = {
  employeeId?: number;
  name: string;
  email: string;
  password: string;
  division: string;
  position: string;
  role?: string;
};

type AuthAccountUpdatePayload = {
  name: string;
  email: string;
  password: string;
  division: string;
  position: string;
  role?: string;
};

@Injectable()
export class AuthServiceService {
  constructor(private readonly prisma: AuthPrismaService) {}

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email dan password wajib diisi.');
    }

    const user = await this.prisma.authUser.findUnique({
      where: { email },
    });

    if (!user || !this.verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const token = randomBytes(48).toString('hex');
    await this.prisma.authSession.create({
      data: {
        token,
        userId: user.id,
      },
    });

    return {
      accessToken: token,
      user: this.toPublicUser(user),
    };
  }

  async logout(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan.');
    }

    await this.prisma.authSession.deleteMany({
      where: { token },
    });

    return { message: 'Logout berhasil.' };
  }

  async getProfile(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan.');
    }

    const session = await this.prisma.authSession.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException('Token tidak valid.');
    }

    return {
      user: this.toPublicUser(session.user),
    };
  }

  async createAccount(payload: AuthAccountPayload, internalToken?: string) {
    this.assertInternalToken(internalToken);
    this.assertAccountPayload(payload);

    const existingUser = await this.prisma.authUser.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah digunakan.');
    }

    const user = await this.prisma.authUser.create({
      data: {
        employeeId: payload.employeeId,
        name: payload.name,
        email: payload.email,
        passwordHash: this.hashPassword(payload.password),
        division: payload.division,
        position: payload.position,
        role: this.toRole(payload.role),
      },
    });

    return {
      user: this.toPublicUser(user),
    };
  }

  async updateAccount(
    employeeIdValue: string,
    payload: AuthAccountUpdatePayload,
    internalToken?: string,
  ) {
    this.assertInternalToken(internalToken);
    const employeeId = this.toEmployeeId(employeeIdValue);
    this.assertAccountPayload(payload);

    const existingByEmployeeId = await this.prisma.authUser.findUnique({
      where: { employeeId },
    });

    if (!existingByEmployeeId) {
      throw new BadRequestException('Akun auth untuk employee tidak ditemukan.');
    }

    const existingByEmail = await this.prisma.authUser.findUnique({
      where: { email: payload.email },
    });

    if (existingByEmail && existingByEmail.id !== existingByEmployeeId.id) {
      throw new ConflictException('Email sudah digunakan.');
    }

    const user = await this.prisma.authUser.update({
      where: { id: existingByEmployeeId.id },
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash: this.hashPassword(payload.password),
        division: payload.division,
        position: payload.position,
        role: this.toRole(payload.role),
      },
    });

    return {
      user: this.toPublicUser(user),
    };
  }

  async deleteAccount(employeeIdValue: string, internalToken?: string) {
    this.assertInternalToken(internalToken);
    const employeeId = this.toEmployeeId(employeeIdValue);

    await this.prisma.authUser.deleteMany({
      where: { employeeId },
    });

    return {
      message: 'Akun auth berhasil dihapus.',
    };
  }

  private toPublicUser(user: {
    id: number;
    employeeId: number | null;
    name: string;
    email: string;
    division: string;
    position: string;
    role: Role;
  }) {
    return {
      id: user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      division: user.division,
      position: user.position,
      role: user.role,
    };
  }

  private toRole(role?: string): Role {
    return role?.toUpperCase() === Role.ADMIN ? Role.ADMIN : Role.USER;
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, passwordHash: string): boolean {
    const [salt, storedHash] = passwordHash.split(':');
    if (!salt || !storedHash) {
      return false;
    }

    const hashBuffer = scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (hashBuffer.length !== storedBuffer.length) {
      return false;
    }

    return timingSafeEqual(hashBuffer, storedBuffer);
  }

  private assertInternalToken(internalToken?: string) {
    const expectedToken = process.env.AUTH_INTERNAL_TOKEN ?? '';

    if (!expectedToken || internalToken !== expectedToken) {
      throw new UnauthorizedException('Token internal service tidak valid.');
    }
  }

  private assertAccountPayload(payload: AuthAccountPayload) {
    const requiredFields: Array<keyof AuthAccountPayload> = [
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

  private toEmployeeId(employeeIdValue: string): number {
    const employeeId = Number(employeeIdValue);
    if (!Number.isInteger(employeeId) || employeeId <= 0) {
      throw new BadRequestException('Employee ID tidak valid.');
    }
    return employeeId;
  }
}
