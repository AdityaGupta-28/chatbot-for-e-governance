
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const loginAdmin = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/admin/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (error) {
            throw error.response?.data?.message || 'Admin Login failed';
        }
    };

    const register = async (name, email, password, aadhaar) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, aadhaar });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, login, loginAdmin, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
