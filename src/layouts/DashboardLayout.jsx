import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import LanguageSelector from '../components/dashboard/LanguageSelector';

function DashboardLayout({ children }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isPublic={false} />
      
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r hidden lg:block">
          <nav className="p-4 space-y-2">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/dashboard/menus" 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            >
              <span>📋</span>
              <span>{t('dashboard.menus')}</span>
            </Link>
            
            <Link 
              to="/dashboard/settings" 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            >
              <span>🎨</span>
              <span>{t('settings.theme')}</span>
            </Link>
          </nav>

          {/* Language Selector */}
          <div className="p-4 border-t mt-4">
            <p className="text-xs text-gray-500 mb-2">{t('settings.language')}</p>
            <LanguageSelector />
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-grow p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
