import prisma from "../lib/prisma.js";
import { runMultipleTests } from "../services/dockerExecutor.js";

/* ---------------- NORMALIZER ---------------- */
const normalize = (str) =>
  (str || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();

/* ---------------- CORE EVALUATION ---------------- */
const evaluateSubmission = async (
  questionId,
  code,
  language,
  mode, // "run" | "submit"
) => {
  const testCases = await prisma.testCase.findMany({
    where: { questionId: parseInt(questionId) },
    orderBy: { id: "asc" },
  });

  if (!testCases.length) {
    throw new Error("No test cases found");
  }

  // 🟢 RUN → only visible (max 3)
  const casesToRun =
    mode === "run"
      ? testCases.filter((t) => !t.isHidden).slice(0, 3)
      : testCases;

  if (mode === "run" && casesToRun.length === 0) {
    throw new Error("No visible test cases to run");
  }

  const result = await runMultipleTests({
    code,
    language,
    testCases: casesToRun,
  });

  if (result.type === "ERROR") {
    throw new Error(result.output);
  }

  if (result.type === "TLE") {
    throw new Error("Time Limit Exceeded");
  }

  /* ---------------- PARSE OUTPUT ---------------- */

  const rawOutputs = result.output
    .split(/===CASE_\d+===/)
    .filter(Boolean)
    .map((chunk) => chunk.trim());

  let passed = 0;
  const total = casesToRun.length;

  const results = casesToRun.map((test, index) => {
    const cleanOutput = normalize(rawOutputs[index] || "");
    const expectedOutput = normalize(test.expected);

    const isPass = cleanOutput === expectedOutput;
    if (isPass) passed++;

    return {
      input: test.input,
      expected: test.expected,
      output: cleanOutput,
      passed: isPass,
      hidden: test.isHidden,
    };
  });

  return { passed, total, results };
};

/* ---------------- RUN CONTROLLER ---------------- */
export const runSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    const { passed, total, results } = await evaluateSubmission(
      id,
      code,
      language,
      "run",
    );

    // Hide hidden test details
    const filteredResults = results.map((test) =>
      test.hidden ? { hidden: true, passed: test.passed } : test,
    );

    res.json({
      passed,
      total,
      results: filteredResults,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Run failed",
    });
  }
};

/* ---------------- SUBMIT CONTROLLER ---------------- */
export const submitSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    const { passed, total } = await evaluateSubmission(
      id,
      code,
      language,
      "submit",
    );

    res.json({
      verdict: passed === total ? "Accepted" : "Wrong Answer",
      passed,
      total,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Submission failed",
    });
  }
};
