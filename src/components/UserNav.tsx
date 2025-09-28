import React from 'react';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || 'Usuario'}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm font-medium text-gray-700">
          {user.displayName || user.email}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default UserNav; 