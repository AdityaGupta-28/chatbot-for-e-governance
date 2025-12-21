
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('citizen'); // citizen | admin
    const { login, loginAdmin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (role === 'admin') {
                await loginAdmin(email, password);
                navigate('/admin');
            } else {
                await login(email, password);
                navigate('/chat');
            }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-white/20 backdrop-blur-sm"
            >
                <div className="p-8">
                    <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                        Welcome Back
                    </h2>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded-r-lg text-sm" role="alert">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="flex bg-gray-100 dark:bg-slate-700 rounded-xl p-1 mb-8">
                        <button
                            type="button"
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'citizen' ? 'bg-white dark:bg-slate-600 shadow-md text-violet-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            onClick={() => setRole('citizen')}
                        >
                            Citizen
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'admin' ? 'bg-white dark:bg-slate-600 shadow-md text-violet-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            onClick={() => setRole('admin')}
                        >
                            Official
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 outline-none transition-all dark:bg-slate-700 dark:text-white bg-gray-50 dark:bg-opacity-50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 outline-none transition-all dark:bg-slate-700 dark:text-white bg-gray-50 dark:bg-opacity-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-violet-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        <div className="flex justify-end mb-4">
                            <Link to="/forgot-password" className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-violet-600 hover:text-violet-700 font-bold hover:underline transition-all">
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
