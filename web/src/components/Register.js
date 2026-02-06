import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Frontend Validation
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        try {
            const res = await API.post('/auth/register', formData);
            setMessage({ type: 'success', text: res.data.message });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Registration failed'
            });
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <p className="subtitle">Create your account</p>
            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <button type="submit" className="primary-btn">Register</button>
            </form>
            <div className="auth-footer">
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
};

export default Register;
