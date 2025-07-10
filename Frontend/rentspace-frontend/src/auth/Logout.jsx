import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}
