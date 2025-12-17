const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const updateConversationStatus = async (req, res) => {
    try {
        const { status, priority } = req.body;
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (req.user.role !== 'admin' && conversation.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (status) conversation.status = status;
        if (priority) conversation.priority = priority;

        const updatedConversation = await conversation.save();

        // If status changed to active (Support Ended), Notify via Socket
        if (status === 'active') {
            const io = req.app.get('io');
            const systemMsg = await Message.create({
                conversationId: conversation._id,
                sender: 'bot',
                text: "*** Support session ended. You are now chatting with the AI Assistant. ***",
            });
            io.to(conversation._id.toString()).emit('receive_message', systemMsg);
        }

        res.json(updatedConversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateConversationStatus };
