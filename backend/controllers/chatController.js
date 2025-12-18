const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Scheme = require('../models/Scheme');


const getConversations = async (req, res) => {
    try {
        let conversations;
        if (req.user.role === 'admin') {
            conversations = await Conversation.find({})
                .populate('userId', 'name email')
                .populate('assignedTo', 'name email')
                .sort({ priority: 1, updatedAt: -1 });
        } else {
            conversations = await Conversation.find({ userId: req.user._id })
                .populate('assignedTo', 'name email')
                .sort({ updatedAt: -1 });
        }
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get messages for conversation
// @route GET /api/chat/:id
const getMessages = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Allow if user is owner OR admin
        if (conversation.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const messages = await Message.find({ conversationId: req.params.id }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Send message
// @route POST /api/chat
const sendMessage = async (req, res) => {
    const { text, conversationId } = req.body;
    let chatId = conversationId;

    try {
        if (!chatId) {
            const newConv = await Conversation.create({
                userId: req.user._id,
                title: text.substring(0, 30) + '...',
            });
            chatId = newConv._id;
        } else {
            const conversation = await Conversation.findById(chatId);
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            if (conversation.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }
        }

        const lowerText = text.toLowerCase();
        let isSupportRequest = false;

        if (lowerText.includes('talk to human') || lowerText.includes('chat with agent') || lowerText.includes('chat with admin')) {
            isSupportRequest = true;
            await Conversation.findByIdAndUpdate(chatId, { status: 'flagged', priority: 'high' });
        }

        // Message tracking and contextual search
        const [userMessage, dbHistory, foundSchemes] = await Promise.all([
            Message.create({
                conversationId: chatId,
                sender: req.user.role === 'admin' ? 'admin' : 'user',
                text,
            }),
            req.user.role !== 'admin'
                ? Message.find({ conversationId: chatId }).sort({ createdAt: -1 }).limit(10)
                : Promise.resolve([]),
            req.user.role !== 'admin'
                ? Scheme.find({
                    $or: [
                        { name: { $regex: text, $options: 'i' } },
                        { description: { $regex: text, $options: 'i' } },
                        { ministry: { $regex: text, $options: 'i' } },
                        { name: { $regex: lowerText.includes('farmer') ? 'Kisan' : '_______', $options: 'i' } }
                    ]
                }).limit(2).select('name description benefits link')
                : Promise.resolve([])
        ]);

        // Socket emission
        const io = req.app.get('io');
        io.to(chatId).emit('receive_message', userMessage);

        let botMessage = null;
        if (req.user.role !== 'admin') {
            let currentStatus = 'active';
            try {
                const checkConv = await Conversation.findById(chatId);
                currentStatus = checkConv.status;
            } catch (e) { }

            if (isSupportRequest) {
                // If support requested, send a specific bot message and skip AI
                const supportMsg = "I have notified our support team. An admin will join this chat shortly to assist you.";
                botMessage = await Message.create({
                    conversationId: chatId,
                    sender: 'bot',
                    text: supportMsg,
                });
                io.to(chatId).emit('receive_message', botMessage);
            } else if (currentStatus === 'flagged') {
                // Agent session active
            } else {
                // AI Logic (OpenRouter)
                let botResponseText = "";
                try {
                    const apiKey = process.env.META_API_KEY;
                    if (!apiKey || apiKey.startsWith('sk-or-v1-3e8cc02b')) {
                        console.warn("Warning: Using placeholder or missing META_API_KEY");
                    }

                    if (!apiKey) {
                        throw new Error("Missing META_API_KEY");
                    }

                    const messages = dbHistory.reverse().map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'assistant',
                        content: msg.text
                    }));

                    let contextData = "";
                    if (foundSchemes.length > 0) {
                        contextData = "\n\nRELEVANT DATA:";
                        foundSchemes.forEach(s => {
                            contextData += `\n- Scheme: ${s.name}`;
                            contextData += `\n  Description: ${s.description}`;
                            contextData += `\n  Benefits: ${s.benefits.join(', ')}`;
                            contextData += `\n  Official Link: ${s.link}`;
                        });
                    }

                    // Add current message
                    messages.push({ role: "user", content: text + contextData });

                    const systemMessage = {
                        role: "system",
                        content: "You are a helpful Indian E-Governance Assistant. Use provided context if available."
                    };

                    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${apiKey}`,
                            "Content-Type": "application/json",
                            "HTTP-Referer": "http://localhost:5000", // Required by OpenRouter for free/low-tier
                            "X-Title": "E-Governance Chatbot" // Required by OpenRouter
                        },
                        body: JSON.stringify({
                            "model": "meta-llama/llama-3.1-8b-instruct",
                            "messages": [systemMessage, ...messages],
                            "top_p": 1,
                            "temperature": 0.5,
                            "repetition_penalty": 1,
                            "max_tokens": 600
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.text();
                        throw new Error(`OpenRouter API Error: ${response.status} - ${errorData}`);
                    }

                    const data = await response.json();
                    botResponseText = data.choices[0].message.content;

                } catch (aiError) {
                    console.error("AI/Network Error Details:", aiError);
                    if (aiError.message) console.error("Message:", aiError.message);
                    if (aiError.cause) console.error("Cause:", aiError.cause);

                    // Offline fallback
                    botResponseText = "";

                    const greetings = ['hello', 'hi', 'hey', 'start', 'help'];
                    if (greetings.some(g => lowerText.includes(g))) {
                        botResponseText = "👋 Hello! I am your E-Governance Assistant.\n\nI can help you with:\n- **PM Kisan Samman Nidhi**\n- **Aadhaar Card Updates**\n- **PAN Card Application**\n- **Ayushman Bharat**\n- **DigiLocker**\n\nAsk me about any scheme!";
                    } else {
                        if (foundSchemes && foundSchemes.length > 0) {
                            botResponseText = "Here is the information I found (Local DB):\n\n";
                            foundSchemes.forEach(s => {
                                botResponseText += `### ${s.name}\n${s.description}\n**Benefits:** ${s.benefits.join(', ')}\n[Official Website](${s.link})\n\n`;
                            });
                            botResponseText += "\n*(Offline Mode Active - AI Connection Failed)*";
                        } else {
                            // 3. No local data found
                            botResponseText = `I am having trouble connecting to the AI service. Please check your internet or API Key. (Error: ${aiError.message})`;
                        }
                    }
                } // End catch (AI Error)

                if (botResponseText) {
                    botMessage = await Message.create({
                        conversationId: chatId,
                        sender: 'bot',
                        text: botResponseText,
                    });
                    io.to(chatId).emit('receive_message', botMessage);
                }
            }
        } // End if (!admin)

        res.json({
            conversationId: chatId,
            userMessage,
            botMessage,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete conversation
// @route DELETE /api/chat/:id
const deleteConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Allow if user is owner OR admin
        if (conversation.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Message.deleteMany({ conversationId: req.params.id });
        await Conversation.findByIdAndDelete(req.params.id);

        res.json({ message: 'Conversation removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Assign chat to admin
// @route PUT /api/chat/:id/assign
const assignChatToAdmin = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        if (conversation.assignedTo && conversation.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Chat is already assigned to another admin' });
        }

        conversation.assignedTo = req.user._id;
        conversation.assignedAt = Date.now();
        await conversation.save();

        const io = req.app.get('io');
        io.to(req.params.id).emit('agent_joined', {
            agentName: req.user.name,
            agentId: req.user._id
        });

        const systemMsg = await Message.create({
            conversationId: conversation._id,
            sender: 'bot',
            text: `Agent ${req.user.name} has joined the chat.`
        });
        io.to(req.params.id).emit('receive_message', systemMsg);

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Release chat from admin
// @route PUT /api/chat/:id/release
const releaseChatFromAdmin = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        conversation.assignedTo = null;
        conversation.assignedAt = null;
        await conversation.save();

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get queue position
// @route GET /api/chat/:id/queue
const getQueuePosition = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        if (conversation.status !== 'flagged') {
            return res.json({ position: 0, message: 'Not in queue' });
        }

        const position = await Conversation.countDocuments({
            status: 'flagged',
            assignedTo: null,
            updatedAt: { $lt: conversation.updatedAt }
        });

        // Position is index + 1
        res.json({ position: position + 1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc End support session (User)
// @route PUT /api/chat/:id/end-support
const endSupportSession = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        if (conversation.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        conversation.status = 'active';
        conversation.priority = 'low';
        conversation.assignedTo = null;
        conversation.assignedAt = null;
        await conversation.save();

        const io = req.app.get('io');
        io.to(req.params.id).emit('support_ended', { message: 'User ended support session' });

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc End support session (Admin)
// @route PUT /api/chat/:id/admin-end-support
const adminEndSupportSession = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        // If locked by someone else
        if (conversation.assignedTo && conversation.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized. Chat is locked by another admin.' });
        }

        conversation.status = 'active';
        conversation.priority = 'low';
        conversation.assignedTo = null;
        conversation.assignedAt = null;
        await conversation.save();

        const io = req.app.get('io');

        // Notify User
        const systemMsg = await Message.create({
            conversationId: conversation._id,
            sender: 'bot',
            text: "The admin has ended this support session. You are now connected to the AI assistant."
        });
        io.to(req.params.id).emit('receive_message', systemMsg);

        io.to(req.params.id).emit('support_ended', { message: 'Admin ended support session' });

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getConversations, getMessages, sendMessage, deleteConversation, assignChatToAdmin, releaseChatFromAdmin, getQueuePosition, endSupportSession, adminEndSupportSession };
