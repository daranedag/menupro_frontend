import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useMenu } from '../contexts/MenuContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/ui';
import { BookOpen, FolderOpen, UtensilsCrossed, Plus, List, Eye } from 'lucide-react';
import MenuManagement from './dashboard/MenuManagement';
import MenuForm from './dashboard/MenuForm';
import MenuEditor from './dashboard/MenuEditor';
import SectionForm from './dashboard/SectionForm';
import DishForm from './dashboard/DishForm';
import Settings from './dashboard/Settings';

function DashboardHome() {
  const { menus } = useMenu();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const totalDishes = menus.reduce((acc, menu) => 
    acc + (menu.sections?.reduce((sum, section) => 
      sum + (section.items?.length || 0), 0) || 0), 0
  );

  const totalSections = menus.reduce((acc, menu) => 
    acc + (menu.sections?.length || 0), 0
  );

  return (
    <DashboardLayout>
      <div>
        <div className="mb-6">
          <h2 className={`text-3xl font-bold ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Bienvenido, {user?.name || 'Usuario'}
          </h2>
          <p className={isDark ? 'text-gray-400 mt-1' : 'text-gray-600 mt-1'}>{user?.restaurantName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hoverable>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Total Cartas
              </h3>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-600">{menus.length}</p>
            <p className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>Cartas creadas</p>
          </Card>

          <Card hoverable>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Secciones
              </h3>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FolderOpen className="text-emerald-600" size={24} />
              </div>
            </div>
            <p className="text-4xl font-bold text-emerald-600">{totalSections}</p>
            <p className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>Categorías activas</p>
          </Card>

          <Card hoverable>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Total Platos
              </h3>
              <div className="p-3 bg-violet-100 rounded-lg">
                <UtensilsCrossed className="text-violet-600" size={24} />
              </div>
            </div>
            <p className="text-4xl font-bold text-violet-600">{totalDishes}</p>
            <p className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>En tu menú</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Acciones Rápidas">
            <div className="space-y-3">
              <a
                href="/dashboard/menus/new"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Plus size={20} />
                <span>Crear Nueva Carta</span>
              </a>
              <a
                href="/dashboard/menus"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <List size={20} />
                <span>Gestionar Cartas</span>
              </a>
              <a
                href={`/menu/${user?.restaurantId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Eye size={20} />
                <span>Ver Menú Público</span>
              </a>
            </div>
          </Card>

          <Card title="Últimas Cartas">
            {menus.length > 0 ? (
              <div className="space-y-3">
                {menus.slice(0, 5).map((menu) => (
                  <a
                    key={menu.id}
                    href={`/dashboard/menus/${menu.id}`}
                    className={`flex items-center justify-between py-3 border-b transition-colors rounded px-2 ${
                      isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{menu.icon}</span>
                      <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{menu.name}</span>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {menu.sections?.length || 0} secciones
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className={`text-center py-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No hay cartas creadas aún
              </p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Dashboard() {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="menus" element={<MenuManagement />} />
      <Route path="menus/new" element={<MenuForm />} />
      <Route path="menus/:menuId" element={<MenuEditor />} />
      <Route path="menus/:menuId/edit" element={<MenuForm />} />
      <Route path="menus/:menuId/sections/new" element={<SectionForm />} />
      <Route path="menus/:menuId/sections/:sectionId/edit" element={<SectionForm />} />
      <Route path="menus/:menuId/sections/:sectionId/dishes/new" element={<DishForm />} />
      <Route path="menus/:menuId/sections/:sectionId/dishes/:dishId" element={<DishForm />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default Dashboard;
