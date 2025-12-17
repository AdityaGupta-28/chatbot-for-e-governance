
const express = require('express');
const router = express.Router();
const {
    getConversations,
    getMessages,
    sendMessage,
    deleteConversation,
    assignChatToAdmin,
    releaseChatFromAdmin,
    getQueuePosition,   // NEW
    endSupportSession,   // NEW
    adminEndSupportSession // NEW
} = require('../controllers/chatController');
const { updateConversationStatus } = require('../controllers/chatUtilsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(protect, getConversations).post(protect, sendMessage);
router.route('/:id').get(protect, getMessages).delete(protect, deleteConversation).put(protect, updateConversationStatus);
router.route('/:id/assign').put(protect, adminOnly, assignChatToAdmin);
router.route('/:id/release').put(protect, adminOnly, releaseChatFromAdmin);
router.route('/:id/queue').get(protect, getQueuePosition); // NEW
router.route('/:id/end-support').put(protect, endSupportSession); // User ends
router.route('/:id/admin-end-support').put(protect, adminOnly, adminEndSupportSession); // Admin ends

module.exports = router;
