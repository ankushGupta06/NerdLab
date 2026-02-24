import { runMultipleTests } from "../services/dockerExecutor.js";

export const executeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        error: "Code and language are required",
      });
    }

    // Single test with no predefined input
    const result = await runMultipleTests({
      code,
      language,
      testCases: [{ input: "" }],
    });

    if (result.type === "ERROR") {
      return res.status(400).json({
        error: result.output,
      });
    }

    if (result.type === "TLE") {
      return res.status(400).json({
        error: "Time Limit Exceeded",
      });
    }

    // Parse first case output
    const rawOutputs = result.output
      .split(/===CASE_\d+===/)
      .filter(Boolean)
      .map((chunk) => chunk.trim());

    const output = rawOutputs[0] || "";

    res.status(200).json({
      success: true,
      output,
    });
  } catch (error) {
    console.error("Execution Error:", error);
    res.status(500).json({
      error: "Code execution failed",
    });
  }
};
