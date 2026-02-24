import prisma from "../lib/prisma.js";

/* ===============================
   ADD EXAMPLE
=============================== */

export const addExample = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { input, output, explanation } = req.body;

    if (!input || !output) {
      return res.status(400).json({
        error: "Input and output are required",
      });
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: parseInt(questionId) },
    });

    if (!question) {
      return res.status(404).json({
        error: "Question not found",
      });
    }

    const example = await prisma.example.create({
      data: {
        questionId: parseInt(questionId),
        input,
        output,
        explanation: explanation || null,
      },
    });

    res.status(201).json({
      message: "Example added successfully",
      example,
    });

  } catch (error) {
    console.error("Add Example Error:", error);
    res.status(500).json({
      error: "Failed to add example",
    });
  }
};