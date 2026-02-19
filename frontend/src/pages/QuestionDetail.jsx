import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

const starterTemplates = {
  python: `# Write your Python code here
print("Hello World")`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`
};

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  // Update starter code when language changes
  useEffect(() => {
    if (question) {
      setCode(starterTemplates[language]);
    }
  }, [language, question]);

  const fetchQuestion = async () => {
    try {
      const res = await API.get(`/questions/${id}`);
      setQuestion(res.data.question);
      setCode(starterTemplates["python"]);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const runCode = async () => {
    try {
      const res = await API.post(`/run/${id}`, {
        code,
        language,
      });
      setOutput(res.data.output);
    } catch (error) {
      console.error("Execution error:", error);
      setOutput("Execution Failed");
    }
  };

  if (!question) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>{question.title}</h2>
      <p>{question.description}</p>

      <label>Language: </label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <br /><br />

      <textarea
        rows="15"
        cols="90"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <br /><br />
      <button onClick={runCode}>Run Code</button>

      <h3>Output:</h3>
      <pre>{output}</pre>
    </div>
  );
}
