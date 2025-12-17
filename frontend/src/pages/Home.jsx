
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                India's Official
                            </span> <br />
                            E-Governance Assistant
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Get instant help with Aadhaar, PAN, Passport, Voting, and more.
                            Our AI-powered chatbot is here to assist you 24/7.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/chat" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg transform hover:scale-105 transition-all">
                                Start Chatting
                            </Link>
                            <Link to="/register" className="px-8 py-4 bg-white dark:bg-slate-800 text-blue-600 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                                Register Now
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                            alt="Chatbot Illustration"
                            className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16 dark:text-white">Why Use E-GovBot?</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: '24/7 Availability', desc: 'Get answers anytime, anywhere without waiting in queues.', icon: '🕒' },
                            { title: 'Multilingual Support', desc: 'Chat in English, Hindi, and regional languages.', icon: '🗣️' },
                            { title: 'Secure & Private', desc: 'Your data is encrypted and handled with utmost security.', icon: '🔒' }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-8 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
