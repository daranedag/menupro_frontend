import { Link } from 'react-router-dom';
import { useMenu } from '../../contexts/MenuContext';
import { Button, Badge, Card } from '../../components/ui';
import DashboardLayout from '../../layouts/DashboardLayout';

function MenuManagement() {
  const { menus, toggleMenuStatus, toggleMenuVisibility, deleteMenu } = useMenu();

  const handleDelete = (menuId, menuName) => {
    if (window.confirm(`¿Estás seguro de eliminar el menú "${menuName}"?`)) {
      deleteMenu(menuId);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Mis Cartas</h2>
            <p className="text-gray-600 mt-1">Gestiona tus menús y cartas</p>
          </div>
          <Link to="/dashboard/menus/new">
            <Button variant="primary">
              ➕ Nueva Carta
            </Button>
          </Link>
        </div>

        {menus.length === 0 ? (
          <Card padding="lg">
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📋</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No tienes cartas creadas
              </h3>
              <p className="text-gray-600 mb-6">
                Crea tu primera carta para comenzar
              </p>
              <Link to="/dashboard/menus/new">
                <Button variant="primary">Crear Primera Carta</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <Card key={menu.id} hoverable padding="none">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {menu.icon && <span className="text-3xl">{menu.icon}</span>}
                      <h3 className="text-xl font-semibold text-gray-800">
                        {menu.name}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={menu.isActive ? 'success' : 'default'} size="sm">
                        {menu.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Badge variant={menu.isVisible ? 'primary' : 'default'} size="sm">
                        {menu.isVisible ? 'Visible' : 'Oculto'}
                      </Badge>
                    </div>
                  </div>

                  {menu.description && (
                    <p className="text-sm text-gray-600 mb-4">{menu.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>📁 {menu.sections?.length || 0} secciones</span>
                    <span>
                      🍽️ {menu.sections?.reduce((acc, s) => acc + (s.items?.length || 0), 0) || 0} platos
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/dashboard/menus/${menu.id}`} className="flex-1">
                      <Button variant="primary" size="sm" fullWidth>
                        ✏️ Editar
                      </Button>
                    </Link>
                    <Button
                      variant={menu.isActive ? 'warning' : 'success'}
                      size="sm"
                      onClick={() => toggleMenuStatus(menu.id)}
                    >
                      {menu.isActive ? '⏸️' : '▶️'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMenuVisibility(menu.id)}
                    >
                      {menu.isVisible ? '👁️' : '🚫'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(menu.id, menu.name)}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MenuManagement;
