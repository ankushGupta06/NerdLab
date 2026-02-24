import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

/* ===========================
   Utility
=========================== */

const createJobDir = () => {
  const jobId = uuid();
  const jobsDir = path.join(process.cwd(), "jobs");
  const jobDir = path.join(jobsDir, jobId);
  fs.mkdirSync(jobDir, { recursive: true });
  return jobDir;
};

const cleanup = (dir) => {
  setTimeout(() => {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {}
  }, 1000);
};

/* ===========================
   CORE MULTI TEST EXECUTOR
=========================== */

export const runMultipleTests = async ({
  code,
  language,
  testCases,
}) => {
  language = language.toLowerCase();
  const jobDir = createJobDir();

  let image = "";
  let compileCommand = "";
  let runCommandTemplate = "";
  let fileName = "";

  /* ---------------- LANGUAGE SETUP ---------------- */

  if (language === "python") {
    image = "python:3.11-slim";
    fileName = "main.py";
    compileCommand = "";
    runCommandTemplate = "python main.py < INPUT_FILE";
  }

  else if (language === "cpp") {
    image = "gcc:12";
    fileName = "main.cpp";
    compileCommand = "g++ main.cpp -O2 -o main || exit 1";
    runCommandTemplate = "./main < INPUT_FILE";
  }

  else if (language === "java") {
    image = "eclipse-temurin:17-jdk";
    fileName = "Main.java";
    compileCommand = "javac Main.java || exit 1";
    runCommandTemplate =
      "java -Xms16m -Xmx64m -XX:+UseSerialGC Main < INPUT_FILE";
  }

  else {
    return { type: "ERROR", output: "Unsupported language" };
  }

  /* ---------------- WRITE CODE FILE ---------------- */

  fs.writeFileSync(path.join(jobDir, fileName), code);

  /* ---------------- WRITE INPUT FILES ---------------- */

  testCases.forEach((test, index) => {
    fs.writeFileSync(
      path.join(jobDir, `input${index}.txt`),
      test.input + "\n"
    );
  });

  /* ---------------- BUILD RUN SCRIPT ---------------- */

  let script = "#!/bin/sh\n\n";

  if (compileCommand) {
    script += compileCommand + "\n\n";
  }

  testCases.forEach((_, index) => {
    script += `
echo "===CASE_${index}===";
timeout 5s ${runCommandTemplate.replace(
      "INPUT_FILE",
      `input${index}.txt`
    )} || exit 124;
`;
  });

  const runScriptPath = path.join(jobDir, "run.sh");
  fs.writeFileSync(runScriptPath, script);
  fs.chmodSync(runScriptPath, 0o755);

  const normalizedPath = jobDir.replace(/\\/g, "/");

  /* ---------------- DOCKER COMMAND ---------------- */

  const dockerArgs = [
    "run",
    "--rm",
    "--memory=256m",
    "--cpus=0.5",
    "--network=none",
    "--pids-limit=64",
    "--security-opt=no-new-privileges",
    "-w",
    "/app",
    "-v",
    `${normalizedPath}:/app`,
    image,
    "sh",
    "run.sh",
  ];

  /* ---------------- EXECUTION ---------------- */

  return new Promise((resolve) => {
    const dockerProcess = spawn("docker", dockerArgs);

    let stdout = "";
    let stderr = "";

    const timeout = setTimeout(() => {
      dockerProcess.kill("SIGKILL");
      cleanup(jobDir);
      resolve({ type: "TLE", output: "Time Limit Exceeded" });
    }, 10000);

    dockerProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    dockerProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    dockerProcess.on("close", (code) => {
      clearTimeout(timeout);
      cleanup(jobDir);

      if (code === 124) {
        resolve({ type: "TLE", output: "Time Limit Exceeded" });
        return;
      }

      if (code !== 0) {
        resolve({
          type: "ERROR",
          output: stderr || stdout || "Execution failed",
        });
        return;
      }

      resolve({
        type: "SUCCESS",
        output: stdout,
      });
    });
  });
};