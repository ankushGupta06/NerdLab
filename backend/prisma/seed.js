import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  await prisma.user.createMany({
    data: [
      {
        email: "ankush@example.com",
        password: "password123",
        username: "ankush",
      },
      {
        email: "rohit@example.com",
        password: "password123",
        username: "rohit",
      },
      {
        email: "admin@example.com",
        password: "admin123",
        username: "admin",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed users created 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });