
const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, default: 'New Conversation' },
    status: { type: String, enum: ['active', 'closed', 'flagged'], default: 'active' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'emergency'], default: 'low' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Admin handling the chat
    assignedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
