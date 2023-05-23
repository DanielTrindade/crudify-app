import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const product1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'feijão',
      price: 5.0,
      description: 'Feijão carioca',
      quantity: 10,
    },
  });
  const product2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'arroz',
      price: 10.0,
      description: 'Arroz branco',
      quantity: 10,
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
    },
  });

  console.log({ product1, product2, product3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
