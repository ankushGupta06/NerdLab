import prisma from "../lib/prisma.js";

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch questions",
    });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

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

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch question",
    });
  }
};
