import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  runSubmission,
  submitSubmission,
} from "../controllers/run.controller.js";

const router = express.Router();

/*
  🟢 RUN ROUTE
  - Used for debugging
  - Shows visible test case outputs
*/
router.post("/run/:id", authMiddleware, runSubmission);

/*
  🔵 SUBMIT ROUTE
  - Final evaluation
  - No test case leakage
*/
router.post("/submit/:id", authMiddleware, submitSubmission);

export default router;