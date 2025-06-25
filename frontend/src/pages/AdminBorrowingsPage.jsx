import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminBorrowingsPage.css";
import { toast } from "react-toastify";

const AdminBorrowingsPage = () => {
  const [returned, setReturned] = useState([]);
  const [notReturned, setNotReturned] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("notReturned");

  const [returnedPage, setReturnedPage] = useState(1);
  const [notReturnedPage, setNotReturnedPage] = useState(1);
  const perPage = 5;

  const [returnedTotal, setReturnedTotal] = useState(0);
  const [notReturnedTotal, setNotReturnedTotal] = useState(0);

  useEffect(() => {
    fetchReturned();
    fetchNotReturned();
  }, [returnedPage, notReturnedPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setReturnedPage(1);
      setNotReturnedPage(1);
      fetchReturned(1, search);
      fetchNotReturned(1, search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchReturned = async (page = returnedPage, query = search) => {
    const token = localStorage.getItem("jwt");
    try {
      const res = await axios.get("http://localhost:3000/borrowings", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          per_page: perPage,
          returned: true,
          search: query,
        },
      });
      setReturned(res.data.borrowings || []);
      setReturnedTotal(res.data.total || 0);
    } catch {
      toast.error("Failed to fetch returned books");
    }
  };

  const fetchNotReturned = async (page = notReturnedPage, query = search) => {
    const token = localStorage.getItem("jwt");
    try {
      const res = await axios.get("http://localhost:3000/borrowings", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          per_page: perPage,
          returned: false,
          search: query,
        },
      });
      setNotReturned(res.data.borrowings || []);
      setNotReturnedTotal(res.data.total || 0);
    } catch {
      toast.error("Failed to fetch not yet returned books");
    }
  };

  const totalReturnedPages = Math.max(1, Math.ceil(returnedTotal / perPage));
  const totalNotReturnedPages = Math.max(
    1,
    Math.ceil(notReturnedTotal / perPage)
  );

  return (
    <div className="admin-container">
      <h2>Admin Borrowings Overview</h2>
      <h3 style={{ color: "#a80000" }}>
        📘 Total Not Yet Returned: {notReturnedTotal}
      </h3>

      <input
        type="text"
        placeholder="Search by book title, author, or genre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "50%",
          padding: "0.6rem 1rem",
          margin: "1rem 0",
          borderRadius: "7px",
          border: "1px solid #cbd5e1",
          fontSize: "1rem",
        }}
      />

      <div className="tab-buttons">
        <button
          className={selectedSection === "notReturned" ? "active" : ""}
          onClick={() => setSelectedSection("notReturned")}
        >
          📘 Not Yet Returned
        </button>
        <button
          className={selectedSection === "returned" ? "active" : ""}
          onClick={() => setSelectedSection("returned")}
        >
          ✅ Returned Borrowings
        </button>
      </div>

      {selectedSection === "notReturned" && (
        <div className="borrow-grid">
          {notReturned.map((b) => (
            <div className="borrow-card" key={b.id}>
              <p>
                <strong>User:</strong> {b.user?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {b.user?.email || "N/A"}
              </p>
              <p>
                <strong>Book:</strong> {b.book?.title || "N/A"}
              </p>
              <p>
                <strong>Borrowed At:</strong>{" "}
                {new Date(b.created_at).toLocaleString()}
              </p>
            </div>
          ))}
          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() =>
                setNotReturnedPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={notReturnedPage <= 1}
            >
              Previous
            </button>
            <span>
              {" "}
              Page {notReturnedPage} of {totalNotReturnedPages}{" "}
            </span>
            <button
              onClick={() =>
                setNotReturnedPage((prev) =>
                  Math.min(prev + 1, totalNotReturnedPages)
                )
              }
              disabled={notReturnedPage >= totalNotReturnedPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedSection === "returned" && (
        <div className="borrow-grid">
          {returned.map((b) => (
            <div className="borrow-card" key={b.id}>
              <p>
                <strong>User:</strong> {b.user?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {b.user?.email || "N/A"}
              </p>
              <p>
                <strong>Book:</strong> {b.book?.title || "N/A"}
              </p>
              <p>
                <strong>Borrowed At:</strong>{" "}
                {new Date(b.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Returned At:</strong>{" "}
                {b.returned_at
                  ? new Date(b.returned_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          ))}
          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setReturnedPage((prev) => Math.max(prev - 1, 1))}
              disabled={returnedPage <= 1}
            >
              Previous
            </button>
            <span>
              {" "}
              Page {returnedPage} of {totalReturnedPages}{" "}
            </span>
            <button
              onClick={() =>
                setReturnedPage((prev) =>
                  Math.min(prev + 1, totalReturnedPages)
                )
              }
              disabled={returnedPage >= totalReturnedPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBorrowingsPage;
