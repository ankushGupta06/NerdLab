# 🧪 NerdLab

### A Collaborative Coding Platform with Multi-Language Execution (Python, C++, Java) and Dockerized judging system

NerdLab is a collaborative coding platform where users can write, run, and experiment with code in a secure sandbox environment.
Think of it as a cozy lab for developers to test ideas, solve problems, and execute code across multiple languages — safely and instantly.

---

## 🚀 Features

* 🔐 User Authentication (Login / Signup)
* 📚 Question-based Coding System
* 🐍 Multi-language Code Execution (Python, C++, Java)
* 🐳 Secure Docker Sandbox Execution
* ⚡ Real-time Code Running with Output
* 🧠 Starter Templates for Each Language
* 🗂️ Isolated Job-based Execution Environment
* 🌐 Full-Stack Architecture (MERN + Prisma + Docker)

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL

### Execution Engine

* Docker Containers
* Python: `python:3.11-slim`
* C++: `gcc:12`
* Java: `eclipse-temurin:17-jdk`

---

## 📁 Project Structure

```
NerdLab/
│
├── frontend/        # React App (UI)
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Questions.jsx
│   │   └── QuestionDetail.jsx
│   └── api/
│
├── backend/         # Node + Express API
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   │   └── dockerExecutor.js
│   └── jobs/        # Temporary execution folders
│
└── prisma/          # Database schema & migrations
```

---

## ⚙️ How Code Execution Works (Core Concept)

1. User writes code in the editor
2. Code is sent to backend API
3. Backend creates a unique job directory (UUID)
4. Code file is generated (main.py / main.cpp / Main.java)
5. Docker container runs the code inside a sandbox
6. Output is captured and returned to the UI
7. Temporary job folder is deleted (cleanup)

Example Docker command:

```bash
docker run --rm --memory=128m --cpus=0.5 --network=none -w /app -v <jobDir>:/app <image> sh -c "<runCommand>"
```

---

## 🧪 Supported Languages

| Language | Image Used             | Command                        |
| -------- | ---------------------- | ------------------------------ |
| Python   | python:3.11-slim       | python main.py                 |
| C++      | gcc:12                 | g++ main.cpp -o main && ./main |
| Java     | eclipse-temurin:17-jdk | javac Main.java && java Main   |

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/nerdlab.git
cd nerdlab
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
DATABASE_URL="postgresql://username:password@localhost:5432/nerdlab"
JWT_SECRET="your_secret_key"
```

Run Prisma:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Start backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:5000
```

---

## 🐳 Docker Requirement (IMPORTANT)

Make sure Docker Desktop is installed and running.

Also ensure file sharing is enabled for your project drive:

* Docker Desktop → Settings → Resources → File Sharing
* Enable the drive where NerdLab is located

---

## 🔒 Security Measures

* Containerized execution (no host access)
* Disabled network inside containers
* CPU & memory limits
* Temporary execution directories
* Automatic cleanup after execution

---

## 🎯 Future Improvements

* 🤝 Real-time collaborative editor (like Google Docs for code)
* 🧪 Test case evaluation system
* 📝 Submission history tracking
* 🎨 Monaco Editor (VS Code-like UI)
* 🌍 Multi-user collaborative rooms
* 🧠 AI code suggestions (future upgrade)

---

## 👨‍💻 Author

Built with curiosity, caffeine, and a nerdy obsession for sandboxed code execution.

**Project Name:** NerdLab 🧪
*A place where code experiments live safely.*

---

## ⭐ If you like this project

Give it a star on GitHub and join the NerdLab 🧠✨
