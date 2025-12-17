
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaBars, FaTimes, FaSun, FaMoon, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                                E
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                                GovBot
                            </span>
                        </Link>

                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-baseline space-x-2">
                            {!user || user.role !== 'admin' ? (
                                <Link to="/" className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">Home</Link>
                            ) : null}

                            {user ? (
                                <>
                                    {user.role !== 'admin' && (
                                        <Link to="/chat" className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">Chat Service</Link>
                                    )}

                                    {user.role === 'admin' ? (
                                        <Link to="/admin" className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100">
                                            Admin Dashboard
                                        </Link>
                                    ) : (
                                        <Link to="/dashboard" className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100">
                                            Dashboard
                                        </Link>
                                    )}

                                    {user.role !== 'admin' && (
                                        <Link to="/settings" className="p-2 text-gray-500 hover:text-violet-600 transition-colors" title="Settings">
                                            <FaCog size={18} />
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                        title="Logout"
                                    >
                                        <FaSignOutAlt size={18} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">Login</Link>
                                    <Link to="/register" className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 transition-all">Get Started</Link>
                                </>
                            )}
                        </div>

                        {/* Enhanced Theme Toggle */}
                        <div
                            onClick={toggleTheme}
                            className={`relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-300 ease-in-out flex items-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-blue-100'}`}
                            role="button"
                            aria-label="Toggle Theme"
                        >
                            <div
                                className={`absolute w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-8 bg-slate-800' : 'translate-x-1 bg-white'}`}
                            >
                                {theme === 'dark' ? <FaMoon size={10} className="text-blue-200" /> : <FaSun size={10} className="text-yellow-500" />}
                            </div>
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden items-center gap-4">
                        <div
                            onClick={toggleTheme}
                            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out flex items-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-blue-100'}`}
                        >
                            <div
                                className={`absolute w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7 bg-slate-800' : 'translate-x-1 bg-white'}`}
                            >
                                {theme === 'dark' ? <FaMoon size={8} className="text-blue-200" /> : <FaSun size={8} className="text-yellow-500" />}
                            </div>
                        </div>

                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none">
                            {isOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800">Home</Link>
                        {user ? (
                            <>
                                <Link to="/chat" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800">Chat Service</Link>
                                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800">Dashboard</Link>

                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800">Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-bold text-violet-600 dark:text-violet-400">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
