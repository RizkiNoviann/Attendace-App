import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await prisma.attendance.deleteMany();

  const seedData = [
    {
      employeeName: 'User Test',
      division: 'IT',
      checkInTime: '08:02',
      imageUrl: null,
      attendanceDate: new Date('2026-05-01T00:00:00.000Z'),
    },
    {
      employeeName: 'Admin',
      division: 'admin',
      checkInTime: '07:58',
      imageUrl: null,
      attendanceDate: new Date('2026-05-01T00:00:00.000Z'),
    },
  ];

  await prisma.attendance.createMany({ data: seedData });

  console.log('Attendance seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
