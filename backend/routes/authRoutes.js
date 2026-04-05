
import express from "express";
import { registerUser, registerAdmin, loginUser, updateUserProfile, getProfile, getUsers } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/register', registerUser);
router.post('/admin-register', registerAdmin);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, getUsers);
export default router;
