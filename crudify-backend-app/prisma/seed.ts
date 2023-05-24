import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

const roundsOfHashing = 10;
async function main() {
  const password1 = await bcrypt.hash('admin123', roundsOfHashing);
  const password2 = await bcrypt.hash('daniel123', roundsOfHashing);
  const password3 = await bcrypt.hash('joao123', roundsOfHashing);
  const user1 = await prisma.user.upsert({
    where: { email: 'admin.root@email.com' },
    update: {
      password: password1,
    },
    create: {
      name: 'admin',
      email: 'admin.root@email.com',
      password: password1,
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'daniel.trindade@email.com' },
    update: { password: password2 },
    create: {
      name: 'Daniel de Oliveira Trindade',
      email: 'daniel.trindade@email.com',
      password: password2,
    },
  });
  const user3 = await prisma.user.upsert({
    where: { email: 'joao.silva@email.com' },
    update: { password: password3 },
    create: {
      name: 'João da Silva',
      email: 'joao.silva@email.com',
      password: password3,
    },
  });

  const product1 = await prisma.product.upsert({
    where: { name: 'feijão B' },
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
    where: { name: 'arroz B' },
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
    where: { name: 'macarrão' },
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
