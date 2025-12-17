
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all conversations
// @route   GET /api/admin/conversations
// @access  Private/Admin
const getAllConversations = async (req, res) => {
    try {
        // Sort by priority (asc: 'high' < 'low', so 'high' comes first in alphabetic? Wait. h < l. So asc puts high first.)
        // Actually let's test logic: 'high' vs 'low'. 'h' is before 'l'. 
        // So Ascending (1) -> high, low.
        // Also sort by updatedAt descending (newest first).
        const conversations = await Conversation.find({})
            .populate('userId', 'name email')
            .sort({ priority: 1, updatedAt: -1 });
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const chatCount = await Conversation.countDocuments();
        const messageCount = await Message.countDocuments();

        res.json({
            users: userCount,
            conversations: chatCount,
            messages: messageCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, getAllConversations, getStats };
