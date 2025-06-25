import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/AdminPage.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminPage = () => {
  const navigate = useNavigate();
  const [showUsers, setShowUsers] = useState(false);
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
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <div className="admin-stats-cards">
        <div className="stat-card">
          <h3>Total Books</h3>
          <p>{stats.totalBooks}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Borrowings</h3>
          <p>{stats.totalBorrowings}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Returns</h3>
          <p>{stats.pendingReturns}</p>
        </div>
      </div>

      <div className="admin-btn-grid">
        <button className="view-users-btn" onClick={() => setShowUsers(true)}>
          View Users
        </button>
        <button
          className="view-users-btn"
          onClick={() => navigate("/admin-books")}
        >
          View Books
        </button>
        <button className="view-users-btn" onClick={() => navigate("/add")}>
          Add New Book
        </button>
        <button
          className="view-users-btn"
          onClick={() => navigate("/admin-borrowings")}
        >
          View All Borrowings
        </button>
      </div>
      {showUsers && <UsersTabPage onClose={() => setShowUsers(false)} />}
    </div>
  );
};

const UsersTabPage = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("librarians");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const searchRef = useRef();

  const deactivateUser = async (id) => {
    try {
      await axios.post(
        `http://localhost:3000/users/${id}/deactivate`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      fetchUsers(page, search);
      toast.success("User deactivated!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Deactivation failed");
    }
  };

  const reactivateUser = async (id) => {
    try {
      await axios.post(
        `http://localhost:3000/users/${id}/reactivate`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      fetchUsers(page, search);
      toast.success("User reactivated!");
    } catch {
      toast.error("Reactivation failed");
    }
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(page, search);
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line
  }, [activeTab, page, search]);

  const fetchUsers = async (pageNum = 1, searchTerm = "") => {
    let role = activeTab === "librarians" ? "librarian" : "member";
    try {
      const res = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        params: { role, page: pageNum, per_page: perPage, search: searchTerm },
      });
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch {
      setUsers([]);
      setTotal(0);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      fetchUsers(page, search);
      toast.success("Request delted!");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Delete failed";
      toast.error(errorMsg);
    }
  };

  const approveLibrarian = async (id) => {
    try {
      await axios.post(
        "http://localhost:3000/approve_librarian",
        { id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      fetchUsers(page, search);
      toast.success("Librarian approved!");
    } catch {
      toast.error("Approval failed");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="users-tab-page">
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
      <div className="tabs">
        <button
          className={activeTab === "librarians" ? "active" : ""}
          onClick={() => {
            setActiveTab("librarians");
            setPage(1);
            setSearch("");
          }}
        >
          Librarians
        </button>
        <button
          className={activeTab === "members" ? "active" : ""}
          onClick={() => {
            setActiveTab("members");
            setPage(1);
            setSearch("");
          }}
        >
          Members
        </button>
      </div>
      <input
        className="user-search-input"
        type="text"
        placeholder={`Search ${
          activeTab === "librarians" ? "Librarians" : "Members"
        } by email...`}
        value={search}
        ref={searchRef}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        style={{
          width: "50%",
          padding: "0.6rem 1rem",
          marginBottom: "1.2rem",
          borderRadius: "7px",
          border: "1px solid #cbd5e1",
          fontSize: "1rem",
        }}
      />
      <div className="tab-content">
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.email}
              {activeTab === "librarians" && user.pending_approval ? (
                <>
                  <button
                    className="approve-btn"
                    onClick={() => approveLibrarian(user.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  {activeTab === "librarians" && !user.pending_approval && (
                    <>
                      {user.active ? (
                        <button
                          className="deactivate-btn"
                          onClick={() => deactivateUser(user.id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="activate-btn"
                          onClick={() => reactivateUser(user.id)}
                        >
                          Reactivate
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
            Previous
          </button>
          <span>
            {" "}
            Page {page} of {totalPages}{" "}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
