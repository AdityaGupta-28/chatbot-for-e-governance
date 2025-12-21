
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, updateUserProfile, verifyOTP, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);
router.put('/profile', protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
