import React, { useState } from "react";
import axios from "axios";
import "../styles/AddBook.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const AddBook = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    publication_date: "",
    quantity: 1,
  });
  const [quantity, setQuantity] = useState(1);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");

    const formData = new FormData();
    formData.append("book[title]", book.title);
    formData.append("book[author]", book.author);
    formData.append("book[genre]", book.genre);
    formData.append("book[publication_date]", book.publication_date);
    formData.append("book[quantity]", book.quantity);

    if (imageFile) {
      formData.append("book[image]", imageFile);
    }

    try {
      await axios.post("http://localhost:3000/books", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Book added!");
      navigate("/admin");
    } catch (err) {
      toast.error("Failed to add book");
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

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
          Quantity
          <input
            type="number"
            value={book.quantity}
            onChange={(e) => setBook({ ...book, quantity: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
