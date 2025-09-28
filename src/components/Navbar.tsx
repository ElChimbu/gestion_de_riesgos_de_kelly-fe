import React from 'react';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar border-b border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-primary">Kelly Risk</span>
                <div className="text-xs text-tertiary">Gestión de Riesgos</div>
              </div>
            </Link>
            
            {/* Navegación */}
            <div className="hidden md:flex space-x-1">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-secondary hover:text-primary hover:bg-card'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/fixed-operations" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/fixed-operations') 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-secondary hover:text-primary hover:bg-card'
                }`}
              >
                Riesgo Fijo
              </Link>
              <Link 
                to="/kelly-calculator" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/kelly-calculator') 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-secondary hover:text-primary hover:bg-card'
                }`}
              >
                Cálculo Kelly
              </Link>
              <Link 
                to="/style-test" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/style-test') 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-secondary hover:text-primary hover:bg-card'
                }`}
              >
                Prueba Estilos
              </Link>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <button className="p-2 text-secondary hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4H20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4.19C3.65 20.73 3 19.46 3 18V6c0-1.46.65-2.73 1.19-2z" />
              </svg>
            </button>

            {/* Perfil del usuario */}
            <div className="flex items-center space-x-3">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuario'}
                  className="h-8 w-8 rounded-full border-2 border-primary"
                />
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-primary">
                  {user?.displayName || user?.email}
                </p>
                <p className="text-xs text-tertiary">
                  {user?.email}
                </p>
              </div>
              
              {/* Menú desplegable */}
              <div className="relative">
                <button className="p-2 text-secondary hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-card border border-primary rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-card-hover transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 