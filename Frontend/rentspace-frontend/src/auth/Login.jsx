import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../auth/AuthContext';
import './Login.scss';
import { FaUserPlus } from 'react-icons/fa6';
import { authApi } from '../api/api';

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.post('login/', formData);
      const { access, refresh, user: userData } = response.data;

      if (!access) throw new Error('No access token received');

      const decoded = jwtDecode(access);

      // Construct user object with essential details
      const user = {
        access,
        refresh,
        id: userData?.id || decoded.user_id,
        email: userData?.email || decoded.email || formData.email,
        username: userData?.username || decoded.username || 'User',
        role: userData?.user_type || decoded.role || 'tenant',
      };

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      // Redirect based on role
      navigate(user.role === 'landlord' ? '/landlord' : '/');
    } catch (err) {
      console.error('Login error:', err);

      const data = err.response?.data;
      if (typeof data === 'string') {
        setError(data);
      } else if (data?.error) {
        setError(data.error);
      } else if (data) {
        const messages = Object.entries(data).map(
          ([key, value]) =>
            `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
        );
        setError(messages.join(' | '));
      } else {
        setError(err.message || 'Invalid credentials or server error.');
      }
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
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </span>
      </div>
    </div>
  );
}
