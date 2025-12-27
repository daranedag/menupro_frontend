import { useState } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import MenuSelector from '../components/menu/MenuSelector';
import MenuSection from '../components/menu/MenuSection';
import { mockMenus, mockRestaurant } from '../data/mockMenuData';

function PublicMenu() {
  const { restaurantId } = useParams();
  const { theme } = useTheme();
  
  // Buscar menú por restaurantId, o usar el primero como fallback
  const restaurantMenus = mockMenus.filter(m => m.restaurantId === restaurantId);
  const [activeMenu, setActiveMenu] = useState(restaurantMenus[0] || mockMenus[0]);

  const bgColor = theme.mode === 'dark' ? '#1f2937' : '#f9fafb';
  const textColor = theme.mode === 'dark' ? '#ffffff' : '#1f2937';

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div 
        className="relative h-48 sm:h-64 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${mockRestaurant.coverImage})`,
          fontFamily: theme.font.fontFamily 
        }}
      >
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl sm:text-5xl">{mockRestaurant.logo}</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {mockRestaurant.name}
            </h1>
          </div>
          <p className="text-sm sm:text-base opacity-90 max-w-2xl">
            {mockRestaurant.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              📍 {mockRestaurant.address}
            </span>
            <span className="flex items-center gap-1">
              📞 {mockRestaurant.phone}
            </span>
            <span className="flex items-center gap-1">
              🕐 {mockRestaurant.hours}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Selector */}
      <MenuSelector 
        menus={mockMenus}
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
      />

      {/* Menu Content */}
      <div 
        className="py-8"
        style={{ 
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: theme.font.fontFamily 
        }}
      >
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Menu Info */}
          <div className="text-center mb-8">
            <h2 
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ color: theme.colors.primary }}
            >
              {activeMenu.name}
            </h2>
            {activeMenu.description && (
              <p style={{ opacity: 0.8 }}>{activeMenu.description}</p>
            )}
          </div>

          {/* Sections */}
          {activeMenu.sections && activeMenu.sections.length > 0 ? (
            activeMenu.sections.map((section) => (
              <MenuSection key={section.id} section={section} />
            ))
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">🍽️</span>
              <p className="text-lg" style={{ opacity: 0.7 }}>
                No hay elementos disponibles en este menú
              </p>
            </div>
          )}

          {/* Footer Call to Action */}
          <div 
            className="mt-12 rounded-lg p-6 sm:p-8 text-white text-center"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` 
            }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              ¿Te gustó nuestro menú?
            </h3>
            <p className="mb-4 text-sm sm:text-base opacity-90">
              Reserva tu mesa o haz tu pedido ahora
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                className="px-6 py-3 rounded-lg font-semibold transition-colors"
                style={{ 
                  backgroundColor: 'white',
                  color: theme.colors.primary 
                }}
              >
                📞 Llamar Ahora
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white transition-colors"
                style={{ 
                  borderColor: 'white',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'white';
                }}
              >
                🚗 Pedir Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default PublicMenu;
