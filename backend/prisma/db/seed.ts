import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  const name = "Leila";
  const email = 'admin@salao.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name,
      email,
      pwd: hashedPassword,
      role: 'admin',
    },
  });

  const services = await prisma.service.createMany({
    data:[
      {name: "Corte Simples", price: 50.00},
      {name: "Corte especial", price: 70.00},
      {name: "Tintura", price: 90.00},
      {name: "Progressiva", price: 130.00},
      {name: "Hidratação", price: 50.00},
    ]
  })

  console.log('Admin criado:', admin);
  console.log('Serviços criados:', services);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });