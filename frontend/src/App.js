import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import BooksPage from "./pages/BooksPage";
import "react-toastify/dist/ReactToastify.css";
import EditBook from "./pages/EditBook";
import Footer from "./pages/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import AddBook from "./pages/AddBook";
import AdminPage from "./pages/AdminPage";
import Navbar from "./pages/Navbar";
import LibrarianReturnapproval from "./pages/LibrarianReturnapproval";
import BooksAdminPage from "./pages/BooksAdminPage";
import AdminBorrowingsPage from "./pages/AdminBorrowingsPage";
import Librarian from "./pages/Librarian";
import LibrarianBorrowingsPage from "./pages/LibrariaBorrowingPage";
import LibrarianBooksPage from "./pages/LibrarianBooksPage";
// ...
import ProtectedRoute from "./ProtectedRoute";
// ...other imports...
import MyBorrowingsPage from "./pages/MyBorrowingsPage";
function App() {
  return (
    <>
      {" "}
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/books" element={<BooksPage />} />
          <Route>
            <Route
              path="/edit-book/:id"
              element={
                <ProtectedRoute>
                  <EditBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Homepage />} />
            <Route
              path="/librarian"
              element={
                <ProtectedRoute>
                  <Librarian />
                </ProtectedRoute>
              }
            />
            <Route
              path="/librarian-books"
              element={
                <ProtectedRoute>
                  <LibrarianBooksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/librarian-borrowings"
              element={
                <ProtectedRoute>
                  <LibrarianBorrowingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/borrowings"
              element={
                <ProtectedRoute>
                  <MyBorrowingsPage />
                </ProtectedRoute>
              }
            />
            import LibrarianReturnApprovalsPage from
            './pages/LibrarianReturnApprovalsPage'; // ...existing code...
            <Route
              path="/librarian-return-approvals"
              element={
                <ProtectedRoute>
                  <LibrarianReturnapproval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-borrowings"
              element={
                <ProtectedRoute>
                  <AdminBorrowingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-books"
              element={
                <ProtectedRoute>
                  <BooksAdminPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
