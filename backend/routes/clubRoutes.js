import express from "express";
import multer from "multer";

import {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
  getUserClubList,
  joinClub,
  getPendingRequests,
  leaveOrRejectClub,
  acceptRequesT
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
router.get("/member/:userId", getUserClubList);
router.post("/join/:clubId/:userId", joinClub);
router.get("/membership/pending-request", getPendingRequests);
router.post("/accept-request/:id", acceptRequesT);
router.post("/leaveOrRejectClub/:clubId/:userId", leaveOrRejectClub);

export default router;