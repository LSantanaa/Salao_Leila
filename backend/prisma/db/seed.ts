import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  // Admin
  const adminName = "Leila";
  const adminEmail = 'admin@salao.com';
  const adminPassword = 'admin123';
  const adminHashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      pwd: adminHashedPassword,
      role: 'admin',
    },
  });

  // Cliente
  const clientName = "Karen";
  const clientEmail = "karen@cliente.com";
  const clientPassword = "cliente123";
  const clientHashedPassword = await bcrypt.hash(clientPassword, 10);

  const client = await prisma.user.upsert({
    where: { email: clientEmail },
    update: {},
    create: {
      name: clientName,
      email: clientEmail,
      pwd: clientHashedPassword,
      role: 'client',
    },
  });

  // Serviços
  const services = await prisma.service.createMany({
    data: [
      { name: "Corte Simples", price: 50.00, },
      { name: "Corte Especial", price: 70.00, },
      { name: "Tintura", price: 90.00, },
      { name: "Progressiva", price: 130.00, },
      { name: "Hidratação", price: 50.00},
    ],
    
  });

  console.log('Admin criado:', admin);
  console.log('Cliente criado:', client);
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