import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../api/Api';
import { AuthContext } from '../auth/AuthContext';
import './Register.scss';

export default function Register() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        user_type: 'tenant',
        password: '',
        password1: '',
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Register user and receive tokens directly
            const res = await authApi.post('register/', formData);
            const { access, refresh, user: userData } = res.data;

            if (!access) {
                throw new Error('No access token received');
            }

            const decoded = jwtDecode(access);
            const user = {
                access,
                refresh,
                id: userData.id,
                email: userData.email,
                role: userData.user_type || decoded.role || formData.user_type,
            };

            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            navigate(user.role === 'landlord' ? '/landlord' : '/');
        } catch (err) {
            console.error("Registration Error:", err?.response?.data || err);

            if (err?.response?.data) {
                const data = err.response.data;
                const messages = [];

                for (const [key, value] of Object.entries(data)) {
                    if (Array.isArray(value)) {
                        messages.push(`${key}: ${value.join(', ')}`);
                    } else {
                        messages.push(`${key}: ${value}`);
                    }
                }

                setError(messages.join(' | '));
            } else {
                setError(err.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            {error && <p className="error-msg">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    name="password1"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.password1}
                    onChange={handleChange}
                    required
                />
                <select name="user_type" value={formData.user_type} onChange={handleChange}>
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
