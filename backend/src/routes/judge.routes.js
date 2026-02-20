import express from "express";
import { judgeSubmission } from "../controllers/judge.controller.js";

const router = express.Router();

router.post("/:id", judgeSubmission);

export default router;
