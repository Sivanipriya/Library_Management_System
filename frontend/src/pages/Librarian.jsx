import React from "react";
import "../styles/LibrarianPage.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LibrarianPage = () => {
  const navigate = useNavigate();
    const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalBorrowings: 0,
    pendingReturns: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/admin/dashboard_stats",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load dashboard stats");
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="librarian-home">
      <h2>Welcome, Librarian!</h2>
      <div className="librarian-stats-cards">
  <div className="stat-card"><h3>Total Books</h3><p>{stats.totalBooks}</p></div>
  <div className="stat-card"><h3>Total Members</h3><p>{stats.totalUsers}</p></div>
  <div className="stat-card"><h3>Total Borrowings</h3><p>{stats.totalBorrowings}</p></div>
  <div className="stat-card"><h3>Pending Returns</h3><p>{stats.pendingReturns}</p></div>
</div>

      <div className="dashboard-boxes">
        <div
          className="dashboard-box"
          onClick={() => navigate("/librarian-books")}
        >
          Manage Books
        </div>
        <div
          className="dashboard-box"
          onClick={() => navigate("/librarian-borrowings")}
        >
          All Borrowings
        </div>
        <div
          className="dashboard-box"
          onClick={() => navigate("/librarian-return-approvals")}
        >
          Return Approvals
        </div>
      </div>
  
    </div>
  );
};

export default LibrarianPage;
