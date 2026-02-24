// import prisma from "../lib/prisma.js";
// import { runCodeWithInput } from "../services/dockerExecutor.js";

// export const judgeSubmission = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { code, language } = req.body;

//     const testCases = await prisma.testCase.findMany({
//       where: { questionId: parseInt(id) },
//       orderBy: { id: "asc" }
//     });

//     if (!testCases.length) {
//       return res.status(400).json({
//         error: "No test cases found for this question",
//       });
//     }

//     const normalize = (str) =>
//       (str || "")
//         .replace(/\r/g, "")
//         .split("\n")
//         .map((line) => line.trim())
//         .join("\n")
//         .trim();

//     let passed = 0;
//     const total = testCases.length;
//     const results = [];

//     for (const test of testCases) {
//       const output = await runCodeWithInput(
//         code,
//         language,
//         test.input
//       );

//       const cleanOutput = normalize(output);
//       const expectedOutput = normalize(test.expected);

//       const isPass = cleanOutput === expectedOutput;

//       if (isPass) passed++;

//       results.push({
//         input: test.isHidden ? null : test.input,
//         expected: test.isHidden ? null : test.expected,
//         output: test.isHidden ? null : cleanOutput,
//         passed: isPass,
//         hidden: test.isHidden
//       });
//     }

//     res.json({
//       passed,
//       total,
//       results
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Judge execution failed",
//     });
//   }
// };