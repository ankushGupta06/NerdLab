import prisma from "../lib/prisma.js";
import { runCode } from "../services/dockerExecutor.js";

export const runCodeForQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!question) {
      return res.status(404).json({
        error: "Question not found",
      });
    }

    if (!code || !language) {
      return res.status(400).json({
        error: "Code and language are required",
      });
    }

    // Run code using your Docker executor
    const output = await runCode(code, language);

    res.status(200).json({
      success: true,
      questionId: id,
      output,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Code execution failed",
    });
  }
};
