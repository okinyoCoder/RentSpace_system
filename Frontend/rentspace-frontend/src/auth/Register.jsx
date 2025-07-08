import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from './AuthContext';
import './Register.scss';

export default function Register() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'tenant'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/register/', formData);
            setUser(res.data.user);
            if (res.data.user.role === 'landlord') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input name="first_name" placeholder="First Name" onChange={handleChange} required />
                <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
                <input name="email" placeholder="Email" onChange={handleChange} required type="email" />
                <input name="password" placeholder="Password" onChange={handleChange} required type="password" />
                <select name="role" onChange={handleChange}>
                    <option value="tenant">Tenant</option>
                    <option value="landlord">Landlord</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}