import Book from "../models/Book.js";
import Club from "../models/Club.js";

export const getDashboardStats = async (req, res) => {
  try {
    // TOTAL COUNTS
    const totalBooks = await Book.countDocuments();
    const totalClubs = await Club.countDocuments();

    // ACTIVE CLUBS
    const activeClubs = await Club.countDocuments({ status: "active" });

    // RECENT BOOKS (latest 3)
    const recentBooks = await Book.find()
      .sort({ createdAt: -1 })
      .limit(3);

    // RECENT CLUBS (latest 3)
    const recentClubs = await Club.find()
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      totalBooks,
      totalClubs,
      activeClubs,
      recentBooks,
      recentClubs,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};