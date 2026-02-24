import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import questionRoutes from "./routes/question.routes.js";
import authRoutes from "./routes/auth.routes.js";
import runRoutes from "./routes/run.routes.js";
// import judgeRoutes from "./routes/judge.routes.js";



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", runRoutes);
// app.use("/api/judge", judgeRoutes);


app.get("/", (req, res) => {
  res.send("Code Executor API Running");
});

// Routes (we will add later)
import executeRoutes from "./routes/execute.routes.js";
app.use("/api/execute", executeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
