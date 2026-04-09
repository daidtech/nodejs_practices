// scripts/seed.js
// Seed data using Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  // Clean up existing data (order matters due to FKs)
  await prisma.tag.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Users
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: 'hashedpassword1',
      role: 'admin',
      active: true,
      loginCount: 50,
      age: 28,
    },
  });
  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      passwordHash: 'hashedpassword2',
      role: 'user',
      active: true,
      loginCount: 12,
      age: 17,
    },
  });
  const carol = await prisma.user.create({
    data: {
      name: 'Carol',
      email: 'carol@example.com',
      passwordHash: 'hashedpassword3',
      role: 'user',
      active: false,
      loginCount: 0,
      age: 35,
    },
  });
  const dave = await prisma.user.create({
    data: {
      name: 'Dave',
      email: 'dave@example.com',
      passwordHash: 'hashedpassword4',
      role: 'user',
      active: true,
      loginCount: 3,
      age: 42,
    },
  });

  // Profiles
  await prisma.profile.create({
    data: {
      bio: 'Admin and coffee lover',
      user: { connect: { id: alice.id } },
    },
  });
  await prisma.profile.create({
    data: {
      bio: 'Student, loves games',
      user: { connect: { id: bob.id } },
    },
  });
  await prisma.profile.create({
    data: {
      bio: 'Dad of two',
      user: { connect: { id: dave.id } },
    },
  });
  // Carol has no profile

  // Categories
  const tech = await prisma.category.create({ data: { description: 'Tech' } });
  const life = await prisma.category.create({ data: { description: 'Life' } });
  const food = await prisma.category.create({ data: { description: 'Food' } });

  // Tags
  const js = await prisma.tag.create({ data: { name: 'js' } });
  const career = await prisma.tag.create({ data: { name: 'career' } });
  const health = await prisma.tag.create({ data: { name: 'health' } });
  const recipe = await prisma.tag.create({ data: { name: 'recipe' } });
  const travel = await prisma.tag.create({ data: { name: 'travel' } });

  // Posts
  await prisma.post.create({
    data: {
      title: 'Intro to Prisma',
      content: 'Getting started with Prisma.',
      published: true,
      author: { connect: { id: alice.id } },
      category: { connect: { id: tech.id } },
      tags: { connect: [{ id: js.id }, { id: career.id }] },
    },
  });
  await prisma.post.create({
    data: {
      title: 'Why I love TS',
      content: 'TypeScript is awesome!',
      published: true,
      author: { connect: { id: alice.id } },
      category: { connect: { id: tech.id } },
      tags: { connect: [{ id: js.id }] },
    },
  });
  await prisma.post.create({
    data: {
      title: 'My gap year',
      content: 'Traveling the world.',
      published: false,
      author: { connect: { id: bob.id } },
      category: { connect: { id: life.id } },
      tags: { connect: [{ id: travel.id }] },
    },
  });
  await prisma.post.create({
    data: {
      title: 'Best pho in Saigon',
      content: 'Pho review.',
      published: true,
      author: { connect: { id: dave.id } },
      category: { connect: { id: food.id } },
      tags: { connect: [{ id: recipe.id }] },
    },
  });
  await prisma.post.create({
    data: {
      title: 'Morning routine',
      content: 'Healthy habits.',
      published: true,
      author: { connect: { id: dave.id } },
      category: { connect: { id: life.id } },
      tags: { connect: [{ id: health.id }] },
    },
  });
  await prisma.post.create({
    data: {
      title: 'Uncategorized rant',
      content: 'Just some thoughts.',
      published: false,
      author: { connect: { id: alice.id } },
      // No category
      // No tags
    },
  });

  console.log('Seed data created.');
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
