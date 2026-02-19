import { runCode } from "../services/dockerExecutor.js";

export const executeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        error: "Code and language are required"
      });
    }

    const output = await runCode(code, language);

    res.status(200).json({
      success: true,
      output
    });
  } catch (error) {
    console.error("Execution Error:", error);
    res.status(500).json({
      error: "Code execution failed"
    });
  }
};
