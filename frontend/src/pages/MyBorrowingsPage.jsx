import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa"; // At the top with other imports

import "../styles/MyBorrowings.css";
import { toast } from "react-toastify";

const MyBorrowingsPage = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10); // or any number you want per page
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("return");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const token = localStorage.getItem("jwt");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchBorrowings = async (
    query = "",
    pageNum = page,
    tab = activeTab
  ) => {
    try {
      const response = await axios.get("http://localhost:3000/my_borrowings", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: query,
          page: pageNum,
          per_page: perPage,
          tab: tab, // <-- send tab to backend
        },
      });
      setBorrowings(response.data.borrowings || response.data);
      setTotal(response.data.total || response.data.borrowings?.length || 0);
    } catch (err) {
      console.error("Error fetching borrowings:", err);
      toast.error("Could not fetch your borrowings.");
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await axios.post(
        "http://localhost:3000/return",
        { id: bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.error("Return request sent!");
      fetchBorrowings();
    } catch (err) {
      console.error("Return failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Return failed.");
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [borrowings]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (
      location.state?.tab &&
      ["return", "pending", "history"].includes(location.state.tab)
    ) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    fetchBorrowings(searchTerm, page, activeTab);
    // eslint-disable-next-line
  }, [page, searchTerm, activeTab]);
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchBorrowings(searchTerm);
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line
  }, [searchTerm]);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBorrowings(searchTerm, page, activeTab);
    }, 10000);
    return () => clearInterval(interval);
  }, [page, activeTab, searchTerm]);

  // Search filter logic
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };
  const filterList = (list) =>
    list.filter(
      (borrow) =>
        borrow.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="borrowings-page">
      <h2>📚 My Borrowings</h2>
      <div className="borrowings-tabs">
        <button
          className={activeTab === "return" ? "active" : ""}
          onClick={() => handleTabClick("return")}
        >
          Return
        </button>
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => handleTabClick("pending")}
        >
          Pending
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => handleTabClick("history")}
        >
          History
        </button>
      </div>

      <form
        className="borrowings-search-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="borrowings-search-input"
          type="text"
          placeholder="Search by title, author, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="borrowings-search-clear"
            onClick={() => setSearchTerm("")}
            title="Clear"
          >
            &#10006;
          </button>
        )}
      </form>

      <div className="borrowings-tab-content">
        {borrowings.length === 0 ? (
          <p>No records.</p>
        ) : (
          <ul>
            {borrowings.map((borrow) => (
              <li key={borrow.id}>
                <strong>Title:</strong> {borrow.book.title}
                <br />
                <strong>Author:</strong> {borrow.book.author}
                <br />
                <strong>Genre:</strong> {borrow.book.genre}
                <br />
                <strong>Publication Date:</strong>{" "}
                {borrow.book.publication_date}
                <br />
                {activeTab === "return" && (
                  <>
                    <span>
                      📅 Borrowed On:{" "}
                      {borrow.created_at
                        ? new Date(borrow.created_at).toLocaleString()
                        : "N/A"}
                    </span>
                    <br />
                    <br />
                    <button onClick={() => handleReturn(borrow.book.id)}>
                      Return
                    </button>
                  </>
                )}
                {activeTab === "pending" && (
                  <span>⏳ Awaiting librarian approval</span>
                )}
                {activeTab === "history" && (
                  <span>
                    ✅ Returned On:{" "}
                    {borrow.returned_at
                      ? new Date(borrow.returned_at).toLocaleString()
                      : "N/A"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`pagination${total === 0 ? " pagination-disabled" : ""}`}>
        <button
          onClick={() => {
            setPage(page - 1);
          }}
          disabled={page <= 1 || total === 0}
        >
          Previous
        </button>
        <span>
          {" "}
          Page {page} of {Math.max(1, Math.ceil(total / perPage))}{" "}
        </span>
        <button
          onClick={() => {
            setPage(page + 1);
          }}
          disabled={page >= Math.ceil(total / perPage) || total === 0}
        >
          Next
        </button>
      </div>

      {showScrollTop && (
        <button
          className="scroll-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default MyBorrowingsPage;
