import { Employee, PrismaClient, Role } from '../src/generated/prisma';

const prisma = new PrismaClient();

type EmployeeSeed = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;

const seedEmployees: EmployeeSeed[] = [
  {
    name: 'User Test',
    email: 'user@gmail.com',
    password: 'user123',
    division: 'IT',
    position: 'Frontend Dev',
    role: Role.USER,
  },
  {
    name: 'Admin',
    email: 'admindexa@gmail.com',
    password: 'admindexa123',
    division: 'admin',
    position: 'admin',
    role: Role.ADMIN,
  },
];

async function main() {
  for (const employee of seedEmployees) {
    await prisma.employee.upsert({
      where: { email: employee.email },
      update: employee,
      create: employee,
    });
  }

  console.log('Employee seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
