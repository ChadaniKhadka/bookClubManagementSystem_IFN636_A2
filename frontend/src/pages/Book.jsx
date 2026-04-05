import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Pencil, Trash2 } from "lucide-react";

const initialFormData = {
  name: "",
  author: "",
  published_date: "",
  category: "",
  description: "",
};

const Book = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState(initialFormData);

  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "History",
    "Biography",
    "Romance",
    "Fantasy",
    "Other",
  ];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/books");
      setBooks(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const openModal = (book = null) => {
    setEditingBook(book);
    setIsOpen(true);

    if (book) {
      setFormData({
        name: book.name || "",
        author: book.author || "",
        published_date: book.published_date || "",
        category: book.category || "",
        description: book.description || "",
      });

      setPreview(`http://localhost:5001${book.coverImage}`);
    } else {
      setFormData(initialFormData);
      setPreview(null);
      setCoverImage(null);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingBook(null);
    setFormData(initialFormData);
    setPreview(null);
    setCoverImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("author", formData.author);
    data.append("category", formData.category);
    data.append("published_date", formData.published_date);
    data.append("description", formData.description);

    if (coverImage instanceof File) {
      data.append("coverImage", coverImage);
    }

    try {
      if (editingBook) {
        await axiosInstance.put(`/api/books/${editingBook._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/api/books", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchBooks();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Book?")) return;
    await axiosInstance.delete(`/api/books/${id}`);
    fetchBooks();
  };

  const filteredBooks = books.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            Book Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage, track and organize your books
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition"
        >
          + Create Book
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6 w-full md:w-1/3">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-xl border bg-white shadow"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white/80 rounded-2xl shadow-xl overflow-hidden border">

        {loading ? (
          <div className="p-10 text-center">Loading...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No books found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="p-4">Cover</th>
                <th className="p-4">Name</th>
                <th className="p-4">Author</th>
                <th className="p-4">Category</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book._id} className="border-b hover:bg-blue-50">

                  <td className="p-4">
                    <img
                      src={`http://localhost:5001${book.coverImage}`}
                      className="w-12 h-12 rounded object-cover"
                      alt={book.name}
                    />
                  </td>

                  <td className="p-4 font-semibold">{book.name}</td>
                  <td className="p-4">{book.author}</td>
                  <td className="p-4">{book.category}</td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => openModal(book)}
                      className="p-2 bg-yellow-100 rounded"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(book._id)}
                      className="p-2 bg-red-100 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl">

            <h2 className="text-xl font-bold mb-4">
              {editingBook ? "Edit Book" : "Add Book"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Book Name"
                className="w-full border p-2 rounded"
              />

              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author"
                className="w-full border p-2 rounded"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <input
                type="date"
                name="published_date"
                value={formData.published_date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
              />

              <input type="file" onChange={handleFileChange} />

              {preview && (
                <img
                  src={preview}
                  className="h-32 w-full object-cover rounded"
                  alt="preview"
                />
              )}

              <div className="flex gap-2 pt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded">
                  {editingBook ? "Update" : "Create"}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 py-2 rounded"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Book;