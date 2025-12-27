import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

function Header({ isPublic = true }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={isPublic ? '/' : '/dashboard'} className="flex items-center space-x-2">
            <span className="text-2xl">🍽️</span>
            <h1 className="text-2xl font-bold text-gray-800">MenuPro</h1>
          </Link>
          
          {!isPublic && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 font-medium">
                {t('nav.dashboard')}
              </Link>
              <Link to="/dashboard/menus" className="text-gray-600 hover:text-gray-800 font-medium">
                {t('dashboard.menus')}
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {t('nav.logout')}
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
