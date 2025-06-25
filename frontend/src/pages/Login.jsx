import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AuthForm.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const carouselMessages = [
  "📚 Welcome to VE Library!",
  "🔒 Securely manage your books and borrowings.",
  "👩‍💼 Librarians can approve or reject returns.",
  "📝 Sign up to start borrowing books today!",
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (showDialog) {
      interval = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % carouselMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [showDialog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? "http://localhost:3000/login"
        : "http://localhost:3000/signup";
      const data = isLogin
        ? { email, password }
        : { user: { email, password, password_confirmation: confirmation } };

      const res = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      setWelcomeMsg(`Welcome, ${res.data.user.name || res.data.user.email}!`);
      setShowDialog(true);

      localStorage.setItem("jwt", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setTimeout(() => {
        setShowDialog(false);
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else if (res.data.user.role === "librarian") {
          navigate("/librarian");
        } else {
          navigate("/books");
        }
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Login failed.");
      }
    }
  };

  return (
    <div className="auth-container">
      {showDialog && (
        <div
          style={{
            position: "fixed",
            top: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            color: " #3182ce;",
            border: "2px solid #fff",
            borderRadius: "2rem",
            padding: "1rem 2.5rem",
            fontWeight: "bold",
            fontSize: "1.2rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.13)",
            zIndex: 2000,
            animation: "burst 0.5s",
          }}
        >
          🎉 {welcomeMsg}
        </div>
      )}
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            required
          />
        )}
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <button className="toggle-auth-btn" onClick={() => navigate("/signup")}>
        {isLogin ? "Need to sign up?" : "Already have an account?"}
      </button>
    </div>
  );
};

export default Login;
