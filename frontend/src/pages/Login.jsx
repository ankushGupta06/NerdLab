import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const res = await API.post(endpoint, { email, password });

      if (!isSignup) {
        localStorage.setItem("token", res.data.token);
        navigate("/questions");
      } else {
        alert("Signup successful! Now login.");
        setIsSignup(false);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert(err?.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>{isSignup ? "Signup" : "Login"}</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />

      <button onClick={handleAuth}>{isSignup ? "Signup" : "Login"}</button>

      <br />
      <br />

      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account? Login" : "Create new account"}
      </button>
    </div>
  );
}
