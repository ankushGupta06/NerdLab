import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionDetail";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. ROUTES WITHOUT NAVBAR (Login/Landing) */}
        <Route path="/" element={<Login />} />

        {/* 2. ROUTES WITH NAVBAR (Grouped via Layout) */}
        <Route element={<Layout />}>
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>

        {/* Optional: Catch-all 404 page (no navbar) */}
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;