import prisma from "../lib/prisma.js";
import { runCodeWithInput } from "../services/dockerExecutor.js";

export const judgeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    const testCases = await prisma.testCase.findMany({
      where: { questionId: parseInt(id) },
    });

    if (!testCases.length) {
      return res.status(400).json({
        error: "No test cases found for this question",
      });
    }

    let passed = 0;
    const total = testCases.length;
    const results = [];

    for (const test of testCases) {
      const output = await runCodeWithInput(
        code,
        language,
        test.input
      );

      const cleanOutput = output.trim();
      const expectedOutput = test.expected.trim();

      const isPass = cleanOutput === expectedOutput;

      if (isPass) passed++;

      results.push({
        input: test.isHidden ? "Hidden" : test.input,
        passed: isPass,
      });
    }

    const verdict = passed === total ? "Accepted" : "Wrong Answer";

    res.json({
      verdict,
      passed,
      total,
      results,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Judge execution failed",
    });
  }
};
