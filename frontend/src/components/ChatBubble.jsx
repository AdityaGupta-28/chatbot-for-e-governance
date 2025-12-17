import { motion } from 'framer-motion';
import { FaUser, FaRobot, FaHeadset } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const ChatBubble = ({ message, currentUser }) => {
    // Determine if the message is from the current user (Right aligned) or others (Left aligned)
    let isMe = false;
    if (currentUser?.role === 'admin') {
        isMe = message.sender === 'admin';
    } else {
        isMe = message.sender === 'user';
    }

    const isBot = message.sender === 'bot';
    const isAdmin = message.sender === 'admin';

    // Avatar Logic
    let AvatarIcon = FaUser;
    let avatarClass = "bg-gradient-to-br from-purple-500 to-indigo-600 text-white";

    if (isBot) {
        AvatarIcon = FaRobot;
        avatarClass = "bg-gradient-to-br from-white to-blue-50 text-blue-600 border border-blue-100";
    } else if (isAdmin) {
        AvatarIcon = FaHeadset;
        avatarClass = "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-orange-200";
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-6 group`}
        >
            <div className={`flex items-end max-w-[85%] lg:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-md ${avatarClass} mx-3 mb-1`}>
                    <AvatarIcon className="text-lg" />
                </div>

                {/* Message Bubble */}
                <div className={`relative px-5 py-4 shadow-md transition-all duration-200 hover:shadow-lg ${!isMe
                    ? 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm text-slate-800 dark:text-slate-200'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-br-sm'
                    }`}>

                    {/* Admin Label if applicable */}
                    {!isMe && isAdmin && (
                        <div className="text-[10px] font-bold text-orange-500 mb-1 uppercase tracking-wide">
                            Support Agent
                        </div>
                    )}

                    <div className={`text-[15px] leading-relaxed ${!isMe
                        ? 'prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 prose-blue dark:prose-invert'
                        : ''
                        }`}>
                        {(!isMe && isBot) ? (
                            <ReactMarkdown
                                components={{
                                    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium" />
                                }}
                            >
                                {message.text}
                            </ReactMarkdown>
                        ) : (
                            message.text
                        )}
                    </div>

                    {/* Time & Info */}
                    <div className={`flex items-center gap-2 mt-2 text-[10px] uppercase tracking-wider font-medium opacity-70 ${!isMe ? 'text-slate-400' : 'text-blue-100'
                        }`}>
                        <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatBubble;
