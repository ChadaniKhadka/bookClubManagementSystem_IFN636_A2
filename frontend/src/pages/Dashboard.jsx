import { useState } from "react";

const initialBooks = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", year: 1925, status: "Available" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", year: 1960, status: "Checked Out" },
  { id: 3, title: "1984", author: "George Orwell", genre: "Dystopian", year: 1949, status: "Available" },
  { id: 4, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", year: 1813, status: "Available" },
  { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", year: 1937, status: "Checked Out" },
];

const emptyForm = { title: "", author: "", genre: "", year: "", status: "Available" };
const genres = ["Classic", "Fiction", "Dystopian", "Romance", "Fantasy", "Mystery", "Sci-Fi", "Biography"];
const statusOptions = ["Available", "Checked Out", "Reserved"];

const statusColors = {
  "Available": { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  "Checked Out": { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  "Reserved": { bg: "#ede9fe", text: "#4c1d95", dot: "#8b5cf6" },
};

export default function Dashboard() {
  const [books, setBooks] = useState(initialBooks);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (!form.genre) e.genre = "Select a genre";
    if (!form.year || isNaN(form.year) || form.year < 1000 || form.year > 2100) e.year = "Enter a valid year";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editingId !== null) {
      setBooks(books.map(b => b.id === editingId ? { ...form, id: editingId, year: +form.year } : b));
      showToast("Book updated successfully!");
      setEditingId(null);
    } else {
      const newBook = { ...form, id: Date.now(), year: +form.year };
      setBooks([newBook, ...books]);
      showToast("Book added successfully!");
    }
    setForm(emptyForm);
    setErrors({});
  };

  const handleEdit = (book) => {
    setForm({ title: book.title, author: book.author, genre: book.genre, year: String(book.year), status: book.status });
    setEditingId(book.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setBooks(books.filter(b => b.id !== id));
    setDeleteConfirm(null);
    showToast("Book deleted.", "error");
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f7f4ef;
          font-family: 'DM Sans', sans-serif;
          color: #1a1714;
          min-height: 100vh;
        }

        .app { min-height: 100vh; display: flex; flex-direction: column; }

        /* HEADER */
        .header {
          background: #1a1714;
          color: #f7f4ef;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 24px rgba(0,0,0,0.18);
        }
        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-icon {
          width: 38px; height: 38px;
          background: #c9a84c;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .header-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }
        .header-sub {
          font-size: 11px;
          color: #9e9187;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 1px;
        }
        .header-stats {
          display: flex;
          gap: 32px;
        }
        .stat-item {
          text-align: center;
        }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #c9a84c;
          line-height: 1;
        }
        .stat-label {
          font-size: 10px;
          color: #9e9187;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-top: 2px;
        }

        /* MAIN */
        .main { flex: 1; padding: 40px; max-width: 1200px; margin: 0 auto; width: 100%; }

        /* FORM CARD */
        .form-card {
          background: #fff;
          border-radius: 16px;
          padding: 32px 36px;
          margin-bottom: 36px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
          border: 1px solid #ede8e1;
          animation: slideDown 0.4s ease;
        }
        @keyframes slideDown { from { opacity:0; transform: translateY(-12px); } to { opacity:1; transform: translateY(0); } }

        .form-heading {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .form-heading-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          background: #fef3c7;
          color: #92400e;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }
        .form-subheading {
          font-size: 13px;
          color: #9e9187;
          margin-bottom: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group.full { grid-column: 1 / -1; }
        label { font-size: 12px; font-weight: 600; color: #6b5e52; text-transform: uppercase; letter-spacing: 0.8px; }
        input, select {
          border: 1.5px solid #e8e2d9;
          border-radius: 8px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1714;
          background: #faf9f7;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        input:focus, select:focus {
          border-color: #c9a84c;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
          background: #fff;
        }
        .input-error { border-color: #ef4444 !important; }
        .error-msg { font-size: 11px; color: #ef4444; margin-top: 2px; }

        .form-actions { display: flex; gap: 12px; justify-content: flex-end; }

        .btn {
          padding: 10px 24px;
          border-radius: 8px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
        }
        .btn-primary {
          background: #1a1714;
          color: #fff;
        }
        .btn-primary:hover { background: #c9a84c; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(201,168,76,0.3); }
        .btn-secondary {
          background: transparent;
          color: #6b5e52;
          border: 1.5px solid #e8e2d9;
        }
        .btn-secondary:hover { background: #f7f4ef; }

        /* TABLE SECTION */
        .table-section { background: #fff; border-radius: 16px; box-shadow: 0 2px 20px rgba(0,0,0,0.07); border: 1px solid #ede8e1; overflow: hidden; }

        .table-toolbar {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f0ebe4;
        }
        .table-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
        }
        .table-count { font-size: 13px; color: #9e9187; margin-top: 2px; }

        .search-box {
          position: relative;
        }
        .search-box input {
          padding-left: 36px;
          width: 220px;
        }
        .search-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #9e9187;
          font-size: 15px;
        }

        table { width: 100%; border-collapse: collapse; }
        thead {
          background: #f7f4ef;
        }
        th {
          padding: 12px 20px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #9e9187;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        td {
          padding: 14px 20px;
          border-top: 1px solid #f0ebe4;
          font-size: 14px;
          vertical-align: middle;
        }
        tr { transition: background 0.15s; }
        tr:hover td { background: #faf9f7; }

        .book-title { font-weight: 600; color: #1a1714; }
        .book-author { font-size: 12px; color: #9e9187; margin-top: 2px; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; }

        .genre-tag {
          background: #f0ebe4;
          color: #6b5e52;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .actions { display: flex; gap: 8px; }
        .btn-edit {
          padding: 6px 14px;
          border-radius: 6px;
          border: 1.5px solid #c9a84c;
          background: transparent;
          color: #92400e;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 5px;
        }
        .btn-edit:hover { background: #c9a84c; color: #fff; }
        .btn-delete {
          padding: 6px 14px;
          border-radius: 6px;
          border: 1.5px solid #fca5a5;
          background: transparent;
          color: #b91c1c;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 5px;
        }
        .btn-delete:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9e9187;
        }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty-text { font-size: 15px; font-weight: 500; }

        /* MODAL */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 200;
          animation: fadeIn 0.2s;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal {
          background: #fff;
          border-radius: 16px;
          padding: 32px;
          max-width: 380px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: scaleIn 0.2s;
        }
        @keyframes scaleIn { from { transform: scale(0.95); } to { transform: scale(1); } }
        .modal-icon { font-size: 36px; margin-bottom: 12px; }
        .modal-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; margin-bottom: 8px; }
        .modal-body { font-size: 14px; color: #6b5e52; margin-bottom: 24px; line-height: 1.6; }
        .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }

        /* TOAST */
        .toast {
          position: fixed;
          bottom: 32px;
          right: 32px;
          padding: 14px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 300;
          animation: slideUp 0.3s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .toast-success { background: #1a1714; color: #fff; }
        .toast-error { background: #ef4444; color: #fff; }

        /* FOOTER */
        .footer {
          background: #1a1714;
          color: #9e9187;
          padding: 28px 40px;
          margin-top: 40px;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-brand {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #f7f4ef;
        }
        .footer-links {
          display: flex;
          gap: 24px;
          font-size: 13px;
        }
        .footer-links span { cursor: pointer; transition: color 0.2s; }
        .footer-links span:hover { color: #c9a84c; }
        .footer-copy { font-size: 12px; margin-top: 4px; }
      `}</style>

      <div className="app">

        {/* ── MAIN ── */}
        <main className="main">

          {/* FORM */}
          <div className="form-card">
            <div className="form-heading">
              {editingId ? "✏️ Edit Book" : "➕ Add New Book"}
              {editingId && <span className="form-heading-badge">Editing Mode</span>}
            </div>
            <div className="form-subheading">
              {editingId ? "Update the details below and save your changes." : "Fill in the details to add a new book to your library."}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Book Title</label>
                <input
                  className={errors.title ? "input-error" : ""}
                  placeholder="e.g. The Great Gatsby"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
                {errors.title && <span className="error-msg">{errors.title}</span>}
              </div>
              <div className="form-group">
                <label>Author</label>
                <input
                  className={errors.author ? "input-error" : ""}
                  placeholder="e.g. F. Scott Fitzgerald"
                  value={form.author}
                  onChange={e => setForm({ ...form, author: e.target.value })}
                />
                {errors.author && <span className="error-msg">{errors.author}</span>}
              </div>
              <div className="form-group">
                <label>Genre</label>
                <select
                  className={errors.genre ? "input-error" : ""}
                  value={form.genre}
                  onChange={e => setForm({ ...form, genre: e.target.value })}
                >
                  <option value="">Select genre…</option>
                  {genres.map(g => <option key={g}>{g}</option>)}
                </select>
                {errors.genre && <span className="error-msg">{errors.genre}</span>}
              </div>
              <div className="form-group">
                <label>Publication Year</label>
                <input
                  className={errors.year ? "input-error" : ""}
                  placeholder="e.g. 1925"
                  value={form.year}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                />
                {errors.year && <span className="error-msg">{errors.year}</span>}
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {statusOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-actions">
              {editingId && (
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              )}
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingId ? "💾 Save Changes" : "➕ Add Book"}
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-section">
            <div className="table-toolbar">
              <div>
                <div className="table-title">📖 Book Collection</div>
                <div className="table-count">{filtered.length} of {books.length} books</div>
              </div>
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  placeholder="Search books…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <div className="empty-text">No books found</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title / Author</th>
                    <th>Genre</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((book, i) => {
                    const sc = statusColors[book.status] || statusColors["Available"];
                    return (
                      <tr key={book.id}>
                        <td style={{ color: "#c9a84c", fontWeight: 700, fontFamily: "Playfair Display, serif" }}>
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td>
                          <div className="book-title">{book.title}</div>
                          <div className="book-author">{book.author}</div>
                        </td>
                        <td><span className="genre-tag">{book.genre}</span></td>
                        <td style={{ color: "#6b5e52" }}>{book.year}</td>
                        <td>
                          <span className="badge" style={{ background: sc.bg, color: sc.text }}>
                            <span className="badge-dot" style={{ background: sc.dot }} />
                            {book.status}
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <button className="btn-edit" onClick={() => handleEdit(book)}>✏️ Edit</button>
                            <button className="btn-delete" onClick={() => setDeleteConfirm(book)}>🗑️ Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-inner">
            <div>
              <div className="footer-brand">📚 Bibliotheca</div>
              <div className="footer-copy">© 2025 Library Management System. All rights reserved.</div>
            </div>
            <div className="footer-links">
              <span>Help</span>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Contact</span>
            </div>
          </div>
        </footer>
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <div className="modal-title">Delete Book?</div>
            <div className="modal-body">
              Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong> by {deleteConfirm.author}? This action cannot be undone.
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn" style={{ background: "#ef4444", color: "#fff" }} onClick={() => handleDelete(deleteConfirm.id)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✅" : "🗑️"} {toast.msg}
        </div>
      )}
    </>
  );
}
