
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ChatInterface from './pages/ChatInterface';
import UserDashboard from './pages/UserDashboard';

import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
                <Navbar />
                <div className="pt-16">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/chat" element={<ChatInterface />} />
                        <Route path="/chat/:id" element={<ChatInterface />} />
                        <Route path="/dashboard" element={<UserDashboard />} />

                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
            </div>
        </AuthProvider>
    );
}

export default App;
