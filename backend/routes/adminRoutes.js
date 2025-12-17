
const express = require('express');
const router = express.Router();
const { getAllUsers, getAllConversations, getStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/conversations', protect, adminOnly, getAllConversations);
router.get('/stats', protect, adminOnly, getStats);

module.exports = router;
