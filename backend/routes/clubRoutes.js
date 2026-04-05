import express from "express";
import multer from "multer";

import {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
} from "../controllers/clubController.js";

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
router.post("/", upload.single("coverImage"), createClub);
router.get("/", getClubs);
router.get("/:id", getClubById);
router.put("/:id", upload.single("coverImage"), updateClub);
router.delete("/:id", deleteClub);

export default router;