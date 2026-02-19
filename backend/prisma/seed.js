import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.question.createMany({
    data: [
      {
        title: "Print Hello World",
        description: "Write a program to print Hello World.",
        starterCode: "print('Hello World')"
      },
      {
        title: "Sum of Two Numbers",
        description: "Take two numbers as input and print their sum.",
        starterCode: "a = int(input())\nb = int(input())\nprint(a + b)"
      },
      {
        title: "Reverse a String",
        description: "Write a program to reverse a given string.",
        starterCode: "s = input()\nprint(s[::-1])"
      }
    ],
  });

  console.log("Questions seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
