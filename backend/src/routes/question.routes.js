import express from "express";
import {
  getAllQuestions,
  getQuestionById,
} from "../controllers/question.controller.js";

const router = express.Router();

router.get("/", getAllQuestions);        // GET /api/questions
router.get("/:id", getQuestionById);     // GET /api/questions/1

export default router;
