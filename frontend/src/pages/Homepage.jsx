import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Homepage.css"; // Create this CSS file for styling

const Homepage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <div className="homepage">
      <main className="main-content">
        <img
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
          alt="Library"
          className="library-img"
        />
        <h1>Welcome to VELibrary</h1>
        <p>Discover, borrow, and manage your favorite books online.</p>
        <button className="view-books-btn" onClick={() => navigate("/books")}>
          View Books
        </button>
      </main>
    </div>
  );
};

export default Homepage;
