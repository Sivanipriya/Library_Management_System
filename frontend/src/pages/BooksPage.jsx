import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BooksPage.css";
import { useNavigate } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { toast } from "react-toastify";
import Select from "react-select";

const BooksPage = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  // if not already there
  const [searchTerm, setSearchTerm] = useState("");
  const genreOptions = genres.map((g) => ({ value: g, label: g }));

  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    fetchGenres();
    fetchBooks("", "", 1); // initially fetch all books
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchBooks(selectedGenre, searchTerm, 1);
    }, 400); // debounce so it doesn't call on every keystroke

    return () => clearTimeout(handler);
  }, [searchTerm, selectedGenre]);

  const fetchBooks = async (genre = "", titleSearch = "", pageNum = 1) => {
    try {
      const config = {
        params: { page: pageNum, per_page: 10 },
      };
      if (genre) config.params.genre = genre;
      if (titleSearch) config.params.search = titleSearch;
      if (token) config.headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get("http://localhost:3000/books", config);
      setBooks(res.data.books);
      setTotal(res.data.total);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load books");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(total / 10)) return;
    fetchBooks(selectedGenre, searchTerm, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 This ensures smooth scroll to top
  };

  const fetchGenres = async () => {
    try {
      const res = await axios.get("http://localhost:3000/books/genres");
      setGenres(res.data.genres);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load genres");
    }
  };

  const fetchBooksByGenre = async (genre, pageNum = 1) => {
    try {
      const config = {
        params: { genre, page: pageNum, per_page: 10 },
      };
      if (token) config.headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get("http://localhost:3000/books", config);
      setBooks(res.data.books);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load books for genre");
    }
  };

  const handleBorrow = async (bookId) => {
    if (!token) {
      toast.info("Please login or sign up to borrow books.");
      navigate("/signup");
      return;
    }
    try {
      await axios.post(
        "http://localhost:3000/borrowings",
        { id: bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      toast.success("Book borrowed successfully!");
      fetchBooksByGenre(selectedGenre); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to borrow book.");
    }
  };

  return (
    <div className="book-page">
      <h2>
        📚 Browse Books by Genre
        {total > 0 && (
          <span style={{ fontSize: "1rem", color: "#64748b" }}>
            {" "}
            (Total: {total} books)
          </span>
        )}
      </h2>

      <div className="filters">
        <Select
          options={genreOptions}
          value={
            genreOptions.find((opt) => opt.value === selectedGenre) || null
          }
          onChange={(opt) => setSelectedGenre(opt ? opt.value : "")}
          placeholder="Select Genre"
          isClearable
          styles={{
            container: (base) => ({ ...base, width: "40%", maxWidth: "250px" }),
          }}
        />

        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "40%",
            maxWidth: "250px",
            padding: "0.6rem 1rem",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            marginLeft: "1rem",
          }}
        />
      </div>

      {books.length === 0 ? (
        <p>No books found for selected genre</p>
      ) : (
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
                  <strong>Genre:</strong> {book.genre}
                </p>
                <p>
                  <strong>Publication Date:</strong> {book.publication_date}
                </p>
                <p>
                  <strong>Quantity:</strong> {book.quantity}
                </p>
                {book.quantity > 0 ? (
                  <button onClick={() => handleBorrow(book.id)}>Borrow</button>
                ) : (
                  <span style={{ color: "gray" }}>Not available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>
          Page {page} of {Math.max(1, Math.ceil(total / 10))}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= Math.ceil(total / 10)}
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

export default BooksPage;
