import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export const runCode = async (code, language) => {
  const jobId = uuid();
  const jobsDir = path.join(process.cwd(), "jobs");
  const jobDir = path.join(jobsDir, jobId);

  // Create temp job directory
  fs.mkdirSync(jobDir, { recursive: true });

  let fileName;
  let runCommand;
  let image;

  if (language === "python") {
    fileName = "main.py";
    runCommand = "python main.py";
    image = "python:3.11-slim";
  } else if (language === "cpp") {
    fileName = "main.cpp";
    runCommand = "g++ main.cpp -o main && chmod +x main && ./main";
    image = "gcc:12";
  } else if (language === "java") {
    fileName = "Main.java";
    runCommand = "javac Main.java && java Main";
    image = "eclipse-temurin:17-jdk";
  } else {
    return "Unsupported language";
  }

  const filePath = path.join(jobDir, fileName);

  // Write user code to file
  fs.writeFileSync(filePath, code);

  // Windows-safe path normalization
  const normalizedJobDir = jobDir.replace(/\\/g, "/");

  // 🔥 CRITICAL FIX: -w /app sets working directory inside container
  const dockerCommand = `docker run --rm --memory=128m --cpus=0.5 --network=none -w /app -v ${normalizedJobDir}:/app ${image} sh -c "${runCommand}"`;

  // Debug logs (very useful)
  console.log("Job Dir:", normalizedJobDir);
  console.log("Files in jobDir:", fs.readdirSync(jobDir));
  console.log("Docker Command:", dockerCommand);

  return new Promise((resolve) => {
    exec(dockerCommand, { timeout: 5000 }, (error, stdout, stderr) => {
      // Cleanup
      fs.rmSync(jobDir, { recursive: true, force: true });

      // Show REAL errors instead of hiding them
      if (error) {
        console.error("Docker Exec Error:", error.message);
        console.error("STDERR:", stderr);
        resolve(stderr || error.message || "Execution Error");
        return;
      }

      if (stderr) {
        // Compilation errors (g++, javac) come here
        resolve(stderr);
        return;
      }

      resolve(stdout || "No Output");
    });
  });
};
