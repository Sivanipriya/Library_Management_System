import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BooksPage.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BooksAdminPage = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [books]);

  useEffect(() => {
    fetchBooks(page, searchTerm);
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchBooks(1, searchTerm); // Reset to page 1 on search
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchBooks = async (pageNum = 1, query = "") => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await axios.get("http://localhost:3000/books", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNum, per_page: perPage, search: query },
      });
      setBooks(response.data.books || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      toast.error("Failed to fetch books");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    const token = localStorage.getItem("jwt");
    try {
      await axios.delete(`http://localhost:3000/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks(page, searchTerm);
      toast.success("Book deleted");
    } catch (err) {
      toast.error(err.response?.data?.error || "Deletion failed");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-book/${id}`);
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="book-page">
      <h2>📚 All Books (Admin)</h2>

      <input
        type="text"
        className="book-search-input"
        placeholder="Search by title, author, or genre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "50%",
          padding: "0.6rem 1rem",
          margin: "1rem 0",
          borderRadius: "7px",
          border: "1px solid #cbd5e1",
          fontSize: "1rem",
        }}
      />

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.image_url && <img src={book.image_url} alt={book.title} />}
            <div className="book-details">
              <strong>Title:</strong> {book.title}
              <br />
              <strong>Author:</strong> {book.author}
              <br />
              <strong>Genre:</strong> {book.genre}
              <br />
              <strong>Publication Date:</strong> {book.publication_date}
              <br />
              <strong>Quantity:</strong> {book.quantity}
              <br />
              <div className="book-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(book.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </button>
              </div>
            </div>
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

      <button className="view-users-btn" onClick={() => navigate("/admin")}>
        Back to Admin Dashboard
      </button>
    </div>
  );
};

export default BooksAdminPage;
