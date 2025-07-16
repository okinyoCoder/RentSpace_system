import './logoutbutton.scss';
import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ isMobile = false }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button
      className={`logout-button ${isMobile ? 'mobile' : ''}`}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
