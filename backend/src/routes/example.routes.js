import express from "express";
import { addExample } from "../controllers/example.controller.js";

const router = express.Router();

router.post("/questions/:questionId/examples", addExample);

export default router;