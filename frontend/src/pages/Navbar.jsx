import React from "react";
import logo from "../assests/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("jwt");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdminOrLibrarian =
    user && (user.role === "admin" || user.role === "librarian");

  return (
    <nav className="navbar">
      <div
        className="navbar-left"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ height: "40px", marginTop: "4px", border: "50px" }}
        />
        <span className="logo">VELibrary</span>
      </div>
      <div className="navbar-right">
        {location.pathname === "/borrowings" ? (
          <button
            className="navbar-books-btn"
            onClick={() => navigate("/books")}
          >
            Books
          </button>
        ) : (
          token &&
          !isAdminOrLibrarian && (
            <button
              className="navbar-borrowings-btn"
              onClick={() => navigate("/borrowings")}
            >
              Borrowings
            </button>
          )
        )}
        {token ? (
          <button
            className="navbar-logout-btn"
            onClick={() => {
              localStorage.removeItem("jwt");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              className="navbar-borrowings-btn"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
            <button
              className="navbar-borrowings-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
