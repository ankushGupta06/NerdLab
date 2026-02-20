import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

/**
 * BASIC RUN (used by /api/run)
 * Executes code without test case input
 */
export const runCode = async (code, language) => {
  return runCodeWithInput(code, language, "");
};

/**
 * JUDGE RUN (used by /api/judge)
 * Executes code with hidden test case input inside Docker sandbox
 */
export const runCodeWithInput = async (code, language, input = "") => {
  language = language.toLowerCase();

  const jobId = uuid();

  // Ensure jobs directory is inside backend (safe for Windows Docker mounts)
  const jobsDir = path.join(process.cwd(), "jobs");
  const jobDir = path.join(jobsDir, jobId);

  // Create isolated job directory
  fs.mkdirSync(jobDir, { recursive: true });

  let fileName;
  let runCommand;
  let image;

  // Language configurations
  if (language === "python") {
    fileName = "main.py";
    runCommand = input
      ? "python main.py < input.txt"
      : "python main.py";
    image = "python:3.11-slim";
  } else if (language === "cpp") {
    fileName = "main.cpp";
    runCommand = input
      ? "g++ main.cpp -O2 -o main && ./main < input.txt"
      : "g++ main.cpp -O2 -o main && ./main";
    image = "gcc:12";
  } else if (language === "java") {
    fileName = "Main.java";
    runCommand = input
      ? "javac Main.java && java Main < input.txt"
      : "javac Main.java && java Main";
    image = "eclipse-temurin:17-jdk";
  } else {
    return "Unsupported language";
  }

  try {
    // Write user code file
    const codePath = path.join(jobDir, fileName);
    fs.writeFileSync(codePath, code);

    // Write input file only if needed (for judge mode)
    if (input) {
      const inputPath = path.join(jobDir, "input.txt");
      fs.writeFileSync(inputPath, input);
    }

    // Normalize Windows path for Docker
    const normalizedJobDir = jobDir.replace(/\\/g, "/");

    // Windows-safe Docker command (NO multiline slashes, properly quoted volume)
    const dockerCommand = [
      "docker run --rm",
      "--memory=128m",
      "--cpus=0.5",
      "--network=none",
      "--pids-limit=64",
      "--ulimit cpu=2",
      "--security-opt=no-new-privileges",
      `-w /app`,
      `-v "${normalizedJobDir}:/app"`,
      image,
      `sh -c "${runCommand}"`
    ].join(" ");

    console.log("Job Dir:", normalizedJobDir);
    console.log("Docker Command:", dockerCommand);

    // Windows-safe cleanup (fixes ENOTEMPTY due to Docker file locks)
    const safeCleanup = (dir) => {
      setTimeout(() => {
        try {
          fs.rmSync(dir, { recursive: true, force: true });
          console.log("🧹 Cleaned job dir:", dir);
        } catch (err) {
          console.warn("⚠️ Cleanup retry (Docker lock):", err.message);

          // Final retry (Java/C++ containers release files slower on Windows)
          setTimeout(() => {
            try {
              fs.rmSync(dir, { recursive: true, force: true });
              console.log("🧹 Cleaned job dir (retry):", dir);
            } catch (finalErr) {
              console.error(
                "❌ Failed to cleanup job dir (ignored):",
                finalErr.message
              );
            }
          }, 1200);
        }
      }, 700); // Delay to allow Docker to fully unmount volume
    };

    // Execute inside Docker sandbox
    return await new Promise((resolve) => {
      exec(dockerCommand, { timeout: 7000 }, (error, stdout, stderr) => {
        // Always cleanup temp job folder safely
        safeCleanup(jobDir);

        if (error) {
          // Timeout or execution failure
          if (error.killed) {
            resolve("Time Limit Exceeded");
            return;
          }

          resolve(stderr || error.message || "Execution Error");
          return;
        }

        if (stderr && stderr.trim().length > 0) {
          resolve(stderr);
          return;
        }

        resolve(stdout || "No Output");
      });
    });
  } catch (err) {
    console.error("Executor Internal Error:", err);
    return "Internal Executor Error";
  }
};
