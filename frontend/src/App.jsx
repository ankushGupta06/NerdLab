import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page 1: Login */}
        <Route path="/" element={<Login />} />

        {/* Page 2: Questions List */}
        <Route path="/questions" element={<Questions />} />

        {/* Page 3: Individual Question + Code Runner */}
        <Route path="/questions/:id" element={<QuestionDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
