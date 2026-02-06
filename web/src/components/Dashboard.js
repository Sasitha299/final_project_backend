import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!token) return null;

    return (
        <div className="dashboard-container">
            <h2>User Dashboard</h2>
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                <p>Welcome! You have successfully accessed the protected dashboard.</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
                    Your session is secured with a JWT token.
                </p>
            </div>
            <button onClick={handleLogout} className="logout-btn">
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
