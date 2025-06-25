import axios from "axios";
import { toast } from "react-toastify";
import React, { useState, useEffect, useRef } from "react";
import "../styles/LibrarianBorrowingsPage.css";
const LibrarianBorrowingsPage = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("approved"); // new state for tab
  const searchRef = useRef();

  useEffect(() => {
    if (search) {
      // Debounce only if searching
      const handler = setTimeout(() => {
        fetchBorrowings(page, search, activeTab);
      }, 400);
      return () => clearTimeout(handler);
    } else {
      // Immediate fetch for tab or page changes without search
      fetchBorrowings(page, search, activeTab);
    }
  }, [page, search, activeTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const fetchBorrowings = async (
    pageNum = 1,
    searchTerm = "",
    tab = "approved"
  ) => {
    const token = localStorage.getItem("jwt");
    try {
      const params = {
        page: pageNum,
        per_page: perPage,
        search: searchTerm,
      };

      if (tab === "approved") {
        params.returned = true;
        params.return_approved = true;
      } else if (tab === "rejected") {
        params.return_rejected = true;
      } else if (tab === "borrowed") {
        params.returned = false;
      }

      const res = await axios.get("http://localhost:3000/borrowings", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setBorrowings(res.data.borrowings || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error("Failed to fetch borrowings");
    }
  };

  const approveReturn = async (borrowingId) => {
    const token = localStorage.getItem("jwt");
    try {
      await axios.post(
        `http://localhost:3000/borrowings/${borrowingId}/approve_return`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.error("Return approved!");
      fetchBorrowings(page, search, activeTab);
    } catch {
      toast.error("Approval failed");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="lib-container">
      <h2>All Borrowing Records</h2>

      <div className="tabs">
        <button
          onClick={() => {
            setActiveTab("approved");
            setPage(1);
          }}
          className={activeTab === "approved" ? "active" : ""}
        >
          Approved
        </button>
        <button
          onClick={() => {
            setActiveTab("rejected");
            setPage(1);
          }}
          className={activeTab === "rejected" ? "active" : ""}
        >
          Rejected
        </button>
        <button
          onClick={() => {
            setActiveTab("borrowed");
            setPage(1);
          }}
          className={activeTab === "borrowed" ? "active" : ""}
        >
          Borrowed
        </button>
      </div>

      <input
        type="text"
        className="user-search-input"
        placeholder="Search by book title, author, or genre..."
        value={search}
        ref={searchRef}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        style={{
          width: "50%",
          padding: "0.6rem 1rem",
          margin: "1.2rem 0",
          borderRadius: "7px",
          border: "1px solid #cbd5e1",
          fontSize: "1rem",
        }}
      />

      <ul>
        {borrowings.map((b) => (
          <li key={b.id}>
            <strong>User:</strong> {b.user?.email || "N/A"}
            <br />
            <strong>Book:</strong> {b.book?.title || "N/A"}
            <br />
            <strong>Borrowed At:</strong> {b.created_at}
            <br />
            {activeTab == "rejected" && (
              <>
                <strong>Returned:</strong> {b.returned ? "Yes" : "No"}
                <br />
              </>
            )}
            {activeTab === "borrowed" && <span>📘 Not yet returned</span>}
            {activeTab === "approved" && (
              <>
                <span>
                  ✅ Returned On:{" "}
                  {b.returned_at
                    ? new Date(b.returned_at).toLocaleString()
                    : "N/A"}
                </span>
                <br />

                {b.returned && b.return_approved && (
                  <span style={{ color: "green" }}>
                    Approved
                    {b.approved_by && ` by ${b.approved_by.name}`}
                  </span>
                )}
                {b.returned && !b.return_approved && (
                  <button onClick={() => approveReturn(b.id)}>
                    Approve Return
                  </button>
                )}
              </>
            )}
            {activeTab === "rejected" && (
              <span style={{ color: "red" }}>
                ❌ Rejected
                {b.rejected_by && ` by ${b.rejected_by.name}`}
              </span>
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
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default LibrarianBorrowingsPage;
