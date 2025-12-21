import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
            setMessage(`OTP sent to ${email}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', { email, otp, password });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
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
                    <div className="mb-6">
                        <Link to="/login" className="flex items-center text-gray-500 hover:text-violet-600 transition-colors text-sm font-medium">
                            <FaArrowLeft className="mr-2" /> Back to Login
                        </Link>
                    </div>

                    <h2 className="text-3xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                        {step === 1 ? 'Forgot Password?' : step === 2 ? 'Enter OTP' : 'Reset Password'}
                    </h2>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
                        {step === 1
                            ? "Enter your email address and we'll send you a One-Time Password."
                            : step === 2
                                ? "Please enter the OTP sent to your email address."
                                : "Create a new strong password for your account."}
                    </p>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded-r-lg text-sm" role="alert">
                            <p>{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 mb-6 rounded-r-lg text-sm" role="alert">
                            <p>{message}</p>
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
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
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaKey className="text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 outline-none transition-all dark:bg-slate-700 dark:text-white bg-gray-50 dark:bg-opacity-50 tracking-widest text-center text-lg"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                onClick={() => setStep(3)}
                            >
                                Verify OTP
                            </button>
                            <div className="text-center mt-4">
                                <button onClick={() => setStep(1)} className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                                    Resend OTP
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <input type="hidden" value={otp} /> {/* OTP needed for reset */}

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
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

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 outline-none transition-all dark:bg-slate-700 dark:text-white bg-gray-50 dark:bg-opacity-50"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
