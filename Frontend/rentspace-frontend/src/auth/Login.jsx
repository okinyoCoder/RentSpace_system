import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { authApi } from '../api/axios';     
import { AuthContext } from '../auth/AuthContext';
import './Login.scss';
import { FaUserPlus } from 'react-icons/fa6';

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.post('login/', formData); // Calls /auth/login/
      const { access, refresh } = response.data;

      if (!access) throw new Error('No access token received');

      const decoded = jwtDecode(access);

      const user = {
        access,
        refresh,
        id: decoded.user_id,
        email: decoded.email || formData.email,
        role: decoded.role || 'tenant',
      };

      // Save user in localStorage (optional, for persistence)
      localStorage.setItem('user', JSON.stringify(user));

      // Set user in context
      setUser(user);

      // Redirect based on role
      navigate(user.role === 'landlord' ? '/dashboard' : '/');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <div className="register-link">
        <FaUserPlus className="icon" />
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </div>
    </div>
  );
}
