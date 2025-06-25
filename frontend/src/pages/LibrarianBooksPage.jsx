import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LibrarianBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState("");
  const searchRef = useRef();
  const navigate = useNavigate();

  // Debounced fetch
  useEffect(() => {
    if (search) {
      const handler = setTimeout(() => {
        fetchBooks(page, search);
      }, 400);
      return () => clearTimeout(handler);
    } else {
      fetchBooks(page, search);
    }
    // eslint-disable-next-line
  }, [page, search]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const fetchBooks = async (pageNum = 1, searchTerm = "") => {
    const token = localStorage.getItem("jwt");
    try {
      const res = await axios.get("http://localhost:3000/books", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNum, per_page: perPage, search: searchTerm },
      });
      setBooks(res.data.books || []);
      setTotal(res.data.total || 0);
    } catch {
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
      fetchBooks(page, search);
      toast.success("Book deleted");
    } catch {
      toast.error("Book is already borrowed ");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-book/${id}`);
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="book-page">
      <h2>Manage Books</h2>
      <button className="view-users-btn" onClick={() => navigate("/add")}>
        Add New Book
      </button>
      <input
        type="text"
        className="user-search-input"
        placeholder="Search books by title, author, or genre..."
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
      <div className="book-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            {book.image_url && (
              <img
                src={book.image_url}
                alt={`${book.title} cover`}
                className="book-image"
              />
            )}
            <div className="book-info">
              <p>
                <strong>Title:</strong> {book.title}
              </p>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre || "N/A"}
              </p>
              <p>
                <strong>Publication Date:</strong>{" "}
                {book.publication_date || "N/A"}
              </p>
              <p>
                <strong>Quantity:</strong> {book.quantity}
              </p>
              <button className="edit-btn" onClick={() => handleEdit(book.id)}>
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
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>

        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LibrarianBooksPage;
