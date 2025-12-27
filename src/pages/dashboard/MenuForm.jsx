import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMenu } from '../../contexts/MenuContext';
import { Button, Input, Card } from '../../components/ui';
import DashboardLayout from '../../layouts/DashboardLayout';

function MenuForm() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const { menus, createMenu, updateMenu } = useMenu();
  
  const isEditing = !!menuId;
  const existingMenu = isEditing ? menus.find(m => m.id === menuId) : null;

  const [formData, setFormData] = useState({
    name: existingMenu?.name || '',
    icon: existingMenu?.icon || '🍽️',
    description: existingMenu?.description || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      updateMenu(menuId, formData);
    } else {
      createMenu(formData);
    }
    
    navigate('/dashboard/menus');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {isEditing ? 'Editar Carta' : 'Nueva Carta'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Actualiza la información de tu carta' : 'Crea una nueva carta para tu menú'}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nombre de la Carta"
              name="name"
              placeholder="Ej: Desayuno, Almuerzo, Bebidas"
              value={formData.name}
              onChange={handleChange}
              required
              helperText="Nombre descriptivo de la carta"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icono / Emoji
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-20 px-4 py-2 text-center text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength="2"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {['🍽️', '🌅', '🍹', '☕', '🍕', '🍔', '🥗', '🍰', '🍷', '🍜'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: emoji })}
                        className="text-2xl hover:bg-gray-100 p-2 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Selecciona un emoji o escribe uno</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Ej: 6:00 AM - 11:00 AM, Disponible todo el día"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Información adicional como horarios o disponibilidad
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" size="lg">
                {isEditing ? 'Guardar Cambios' : 'Crear Carta'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate('/dashboard/menus')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default MenuForm;
