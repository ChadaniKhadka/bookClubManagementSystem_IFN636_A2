import Book from "../models/Book.js";


// CREATE
export const createBook = async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      coverImage: req.file
  ? `/uploads/${req.file.filename}`
  : "" });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// READ ALL
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// READ ONE
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(Book);
  } catch (err) {
    res.status(404).json({ message: "Book not found" });
  }
};


// UPDATE
export const updateBook = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
    };

    // ONLY update image if new file exists
    if (req.file) {
      updatedData.coverImage = `/uploads/${req.file.filename}`;
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE
export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};