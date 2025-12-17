
const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: String, enum: ['user', 'bot', 'admin'], required: true },
    text: { type: String, required: true },
    metadata: { type: Object }, // For storing intent, confidence, etc.
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
