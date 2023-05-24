import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'admin.root@email.com' },
    update: {},
    create: {
      name: 'admin',
      email: 'admin.root@email.com',
      password: 'admin',
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'daniel.trindade@email.com' },
    update: {},
    create: {
      name: 'Daniel de Oliveira Trindade',
      email: 'daniel.trindade@email.com',
      password: 'daniel123',
    },
  });
  const user3 = await prisma.user.upsert({
    where: { email: 'joao.silva@email.com' },
    update: {},
    create: {
      name: 'João da Silva',
      email: 'joao.silva@email.com',
      password: 'joao13',
    },
  });

  const product1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'feijão B',
      price: 5.0,
      description: 'Feijão carioca',
      quantity: 10,
      userId: user1.id,
    },
  });
  const product2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'arroz B',
      price: 10.0,
      description: 'Arroz branco',
      quantity: 10,
      userId: user2.id,
    },
  });
  const product3 = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'macarrão',
      price: 5.0,
      description: 'Macarrão espaguete',
      quantity: 10,
      userId: user3.id,
    },
  });
  console.log({ user1, user2, user3, product1, product2, product3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
