import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useMenu } from '../contexts/MenuContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui';
import MenuManagement from './dashboard/MenuManagement';
import MenuForm from './dashboard/MenuForm';
import MenuEditor from './dashboard/MenuEditor';
import SectionForm from './dashboard/SectionForm';
import DishForm from './dashboard/DishForm';
import Settings from './dashboard/Settings';

function DashboardHome() {
  const { menus } = useMenu();
  const { user } = useAuth();

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
          <h2 className="text-3xl font-bold text-gray-800">
            Bienvenido, {user?.name || 'Usuario'} 👋
          </h2>
          <p className="text-gray-600 mt-1">{user?.restaurantName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hoverable>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Cartas
              </h3>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-4xl font-bold text-blue-600">{menus.length}</p>
            <p className="text-sm text-gray-500 mt-2">Cartas creadas</p>
          </Card>

          <Card hoverable>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Secciones
              </h3>
              <span className="text-3xl">📁</span>
            </div>
            <p className="text-4xl font-bold text-green-600">{totalSections}</p>
            <p className="text-sm text-gray-500 mt-2">Categorías activas</p>
          </Card>

          <Card hoverable>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Platos
              </h3>
              <span className="text-3xl">🍽️</span>
            </div>
            <p className="text-4xl font-bold text-purple-600">{totalDishes}</p>
            <p className="text-sm text-gray-500 mt-2">En tu menú</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Acciones Rápidas">
            <div className="space-y-3">
              <a
                href="/dashboard/menus/new"
                className="block w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center font-medium"
              >
                ➕ Crear Nueva Carta
              </a>
              <a
                href="/dashboard/menus"
                className="block w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center font-medium"
              >
                📋 Gestionar Cartas
              </a>
              <a
                href={`/menu/${user?.restaurantId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center font-medium"
              >
                👁️ Ver Menú Público
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
                    className="flex items-center justify-between py-3 border-b hover:bg-gray-50 transition-colors rounded px-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{menu.icon}</span>
                      <span className="text-gray-700 font-medium">{menu.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {menu.sections?.length || 0} secciones
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
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
