import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    publication_date: "",
    available: true,
  });

  useEffect(() => {
    const fetchBook = async () => {
      const token = localStorage.getItem("jwt");
      try {
        const res = await axios.get(`http://localhost:3000/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBook(res.data);
      } catch {
        toast.error("Failed to fetch book details");
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");
    try {
      await axios.put(
        `http://localhost:3000/books/${id}`,
        { book },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Book updated!");
      navigate("/admin-books");
    } catch {
      toast.error("Failed to update book");
    }
  };

  return (
    <div className="add-book-container">
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={book.genre}
          onChange={(e) => setBook({ ...book, genre: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Publication Date"
          value={book.publication_date}
          onChange={(e) =>
            setBook({ ...book, publication_date: e.target.value })
          }
          required
        />
        <label>
          Quantity:
          <input
            type="number"
            value={book.quantity || 1}
            onChange={(e) => setBook({ ...book, quantity: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
};

export default EditBook;
