import React, { useState } from "react";
import axios from "axios";
import "../styles/AuthForm.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [role, setRole] = useState("member"); // default role
  const [name, setName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/signup",
        {
          user: {
            name,
            email,
            password,
            password_confirmation: confirmation,
            role,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (role === "librarian") {
        toast.info("Signup successful! Please wait for admin approval.");
        navigate("/home");
      } else {
        toast.success("Signup successful! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Signup failed.");
      navigate("/signup");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="member">Member</option>
          <option value="librarian">Librarian</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
      <button
        className="toggle-auth-btn"
        type="button"
        onClick={() => navigate("/login")}
      >
        Already have an account?
      </button>
    </div>
  );
};

export default Signup;
