const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllConversations = async (req, res) => {
    try {

        const conversations = await Conversation.find({})
            .populate('userId', 'name email')
            .sort({ priority: 1, updatedAt: -1 });
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


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
