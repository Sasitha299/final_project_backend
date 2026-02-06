import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!formData.email || !formData.password) {
            setMessage({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        try {
            const res = await API.post('/auth/login', formData);
            localStorage.setItem('token', res.data.data.token);
            setMessage({ type: 'success', text: 'Login successful!' });
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Invalid credentials'
            });
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <p className="subtitle">Welcome back!</p>
            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="primary-btn">Sign In</button>
            </form>
            <div className="auth-footer">
                New user? <Link to="/register">Create an account</Link>
            </div>
        </div>
    );
};

export default Login;
