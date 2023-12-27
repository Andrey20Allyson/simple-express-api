const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  /**@type {import('@prisma/client').User[]} */
  const users = [
    {
      name: 'José Mario',
      birthDate: new Date(1995, 4, 5),
      login: 'jose_mario',
      passwordHash: await bcrypt.hash('senha-123', 10),
      roles: 'user',
    },
    {
      name: 'Maria José',
      birthDate: new Date(2001, 7, 12),
      login: 'maria_jose',
      passwordHash: await bcrypt.hash('123456', 10),
      roles: 'user;admin',
    }
  ];

  await Promise.all(users.map(user => prisma.user.create({ data: user })));

  console.log(await prisma.user.findMany());
}

main();