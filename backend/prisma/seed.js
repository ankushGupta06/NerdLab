import prisma from "../src/lib/prisma.js";

async function main() {
  console.log("🌱 Seeding NerdLab database...");

  // First clear old data (safe order because of relations)
  await prisma.testCase.deleteMany();
  await prisma.question.deleteMany();

  // Create Questions with Test Cases
  const questions = [
    {
      title: "Sum of Two Numbers",
      description: "Read two integers and print their sum.",
      difficulty: "Easy",
      topic: "Basics",
      starterCode: {
        python: "a, b = map(int, input().split())\nprint(a + b)",
        cpp: "#include <iostream>\nusing namespace std;\nint main(){\n    int a,b;\n    cin>>a>>b;\n    cout<<a+b;\n    return 0;\n}",
        java: "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}",
      },
      testCases: [
        { input: "2 3", expected: "5", isHidden: true },
        { input: "10 5", expected: "15", isHidden: true },
        { input: "7 8", expected: "15", isHidden: true },
      ],
    },
    {
      title: "Print Hello NerdLab",
      description: "Print the text 'Hello NerdLab'.",
      difficulty: "Easy",
      topic: "Strings",
      starterCode: {
        python: "print(\"Hello NerdLab\")",
        cpp: "#include <iostream>\nusing namespace std;\nint main(){\n    cout<<\"Hello NerdLab\";\n    return 0;\n}",
        java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello NerdLab\");\n    }\n}",
      },
      testCases: [
        { input: "", expected: "Hello NerdLab", isHidden: true },
      ],
    },
    {
      title: "Maximum of Three Numbers",
      description: "Read three integers and print the maximum.",
      difficulty: "Medium",
      topic: "Math",
      starterCode: {
        python: "a, b, c = map(int, input().split())\nprint(max(a, b, c))",
        cpp: "#include <iostream>\nusing namespace std;\nint main(){\n    int a,b,c;\n    cin>>a>>b>>c;\n    cout<<max(a,max(b,c));\n    return 0;\n}",
        java: "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n        System.out.println(Math.max(a, Math.max(b, c)));\n    }\n}",
      },
      testCases: [
        { input: "1 2 3", expected: "3", isHidden: true },
        { input: "9 5 2", expected: "9", isHidden: true },
        { input: "7 7 7", expected: "7", isHidden: true },
      ],
    },
  ];

  for (const q of questions) {
    const createdQuestion = await prisma.question.create({
      data: {
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        topic: q.topic,
        starterCode: JSON.stringify(q.starterCode), // multi-language starter
      },
    });

    // Insert test cases linked to question
    await prisma.testCase.createMany({
      data: q.testCases.map((tc) => ({
        input: tc.input,
        expected: tc.expected,
        isHidden: tc.isHidden,
        questionId: createdQuestion.id,
      })),
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
