import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // IMPORTANT: This should be /questions (NOT /questions/:id)
      const res = await API.get("/questions");
      setQuestions(res.data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Questions</h2>

      {questions.length === 0 && <p>No questions found.</p>}

      {questions.map((q) => (
        <div
          key={q.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            margin: 10,
            cursor: "pointer",
          }}
          onClick={() => navigate(`/questions/${q.id}`)}
        >
          <h3>{q.title}</h3>
          <p>{q.description}</p>
        </div>
      ))}
    </div>
  );
}
