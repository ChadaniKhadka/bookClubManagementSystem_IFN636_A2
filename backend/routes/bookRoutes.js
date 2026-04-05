import express from "express";
import multer from "multer";

import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();

// ✅ FIX: proper storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// routes
router.post("/", upload.single("coverImage"), createBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/:id", upload.single("coverImage"), updateBook);
router.delete("/:id", deleteBook);

export default router;