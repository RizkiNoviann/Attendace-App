import { randomBytes, scryptSync } from 'crypto';
import { PrismaClient, Role } from '../src/generated/prisma';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  await prisma.authUser.upsert({
    where: { email: 'user@gmail.com' },
    update: {
      name: 'User Test',
      division: 'IT',
      position: 'Frontend Dev',
      role: Role.USER,
      passwordHash: hashPassword('user123'),
      employeeId: 1,
    },
    create: {
      name: 'User Test',
      email: 'user@gmail.com',
      division: 'IT',
      position: 'Frontend Dev',
      role: Role.USER,
      passwordHash: hashPassword('user123'),
      employeeId: 1,
    },
  });

  await prisma.authUser.upsert({
    where: { email: 'admindexa@gmail.com' },
    update: {
      name: 'Admin',
      division: 'admin',
      position: 'admin',
      role: Role.ADMIN,
      passwordHash: hashPassword('admindexa123'),
      employeeId: 2,
    },
    create: {
      name: 'Admin',
      email: 'admindexa@gmail.com',
      division: 'admin',
      position: 'admin',
      role: Role.ADMIN,
      passwordHash: hashPassword('admindexa123'),
      employeeId: 2,
    },
  });

  console.log('Auth seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
