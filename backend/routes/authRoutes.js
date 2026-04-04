
const express = require('express');
const { registerUser, registerAdmin, loginUser, updateUserProfile, getProfile, getUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/admin-register', registerAdmin);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, getUsers);
module.exports = router;
