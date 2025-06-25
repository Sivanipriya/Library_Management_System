import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LibrarianReturnApprovalsPage = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchPendingReturns = async (pageNum = 1) => {
    const token = localStorage.getItem("jwt");
    try {
      const res = await axios.get("http://localhost:3000/borrowings", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          returned: true,
          return_approved: false,
          page: pageNum,
          per_page: perPage,
        },
      });
      setBorrowings(res.data.borrowings || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error("Failed to fetch pending returns");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingReturns(page);
  }, [page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

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
      toast.success("Return approved!");
      fetchPendingReturns(page);
    } catch {
      toast.error("Approval failed");
    }
  };

  const rejectReturn = async (borrowingId) => {
    const token = localStorage.getItem("jwt");
    try {
      await axios.post(
        `http://localhost:3000/borrowings/${borrowingId}/reject_return`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Return rejected and user notified.");
      fetchPendingReturns(page);
    } catch {
      toast.error("Rejection failed");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="lib-container">
      <h2>Pending Return Approvals</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {borrowings.length === 0 ? (
              <li>No pending returns.</li>
            ) : (
              borrowings.map((b) => (
                <li key={b.id}>
                  <strong>User:</strong> {b.user?.email || "N/A"}
                  <br />
                  <strong>Book:</strong> {b.book?.title || "N/A"}
                  <br />
                  <strong>Borrowed At:</strong> {b.created_at}
                  <br />
                  {b.returned && !b.return_approved && (
                    <>
                      <button
                        className="approve-btn"
                        style={{ marginTop: "1rem", marginLeft: "0" }}
                        onClick={() => approveReturn(b.id)}
                      >
                        Approve Return
                      </button>
                      <button
                        className="reject-btn"
                        style={{
                          marginLeft: "1rem",
                          padding: "0.3rem 0.8rem",
                          fontsize: "0.95rem",
                        }}
                        onClick={() => rejectReturn(b.id)}
                      >
                        Reject Return
                      </button>
                    </>
                  )}
                </li>
              ))
            )}
          </ul>

          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LibrarianReturnApprovalsPage;
