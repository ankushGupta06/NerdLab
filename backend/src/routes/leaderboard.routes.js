import express from "express";
import { getLeaderboard ,getMyRank} from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/", getLeaderboard);

router.get("/me", getMyRank);

export default router;