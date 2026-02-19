import express from "express";
import { runCodeForQuestion } from "../controllers/run.controller.js";

const router = express.Router();

// POST /api/run/1  (run code for question 1)
router.post("/:id", runCodeForQuestion);

export default router;
