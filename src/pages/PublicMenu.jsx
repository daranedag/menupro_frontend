import { useState, useEffect } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import MenuSelector from '../components/menu/MenuSelector';
import MenuSection from '../components/menu/MenuSection';
import { fetchPublicMenu } from '../api/menus';

function PublicMenu() {
  const { restaurantSlug, menuSlug } = useParams();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const [menus, setMenus] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Detectar si estamos en modo preview y qué modo usar
  const isPreview = searchParams.get('preview') === 'true';
  const previewMode = searchParams.get('mode') || 'light';
  
  // Usar modo preview si está activo, sino usar el tema del contexto
  const currentMode = isPreview ? previewMode : theme.mode;
  
  useEffect(() => {
    const loadMenu = async () => {
      if (!restaurantSlug || !menuSlug) {
        setError('Faltan parámetros de menú');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchPublicMenu(restaurantSlug, menuSlug);
        const fetchedMenus = Array.isArray(data?.menus) ? data.menus : data?.menu ? [data.menu] : [data];
        setMenus(fetchedMenus);
        setActiveMenu(fetchedMenus[0]);
        setRestaurantInfo(data?.restaurant || data?.restaurants?.[0] || null);
      } catch (err) {
        setError(err?.message || 'No se pudo cargar el menú');
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, [restaurantSlug, menuSlug]);

  const bgColor = currentMode === 'dark' ? '#1f2937' : '#f9fafb';
  const textColor = currentMode === 'dark' ? '#ffffff' : '#1f2937';

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="py-16 flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" aria-label="Cargando" />
          <p className="text-sm text-gray-600">Cargando menú...</p>
        </div>
      </PublicLayout>
    );
  }

  if (error || !activeMenu) {
    return (
      <PublicLayout>
        <div className="py-16 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600">{error || 'No se encontró el menú'}</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div 
        className="relative h-48 sm:h-64 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${restaurantInfo?.coverImage || restaurantInfo?.cover_image || ''})`,
          fontFamily: theme.font.fontFamily 
        }}
      >
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl sm:text-5xl">{restaurantInfo?.logo || '🍽️'}</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {restaurantInfo?.name || 'Menú'}
            </h1>
          </div>
          <p className="text-sm sm:text-base opacity-90 max-w-2xl">
            {restaurantInfo?.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              📍 {restaurantInfo?.address}
            </span>
            <span className="flex items-center gap-1">
              📞 {restaurantInfo?.phone}
            </span>
            <span className="flex items-center gap-1">
              🕐 {restaurantInfo?.hours}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Selector */}
      <MenuSelector 
        menus={menus}
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
          {activeMenu.showCallToAction && (activeMenu.phoneNumber || activeMenu.deliveryUrl) && (
            <div 
              className="mt-12 rounded-lg p-6 sm:p-8 text-white text-center"
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` 
              }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                {activeMenu.ctaTitle || '¿Te gustó nuestro menú?'}
              </h3>
              <p className="mb-4 text-sm sm:text-base opacity-90">
                {activeMenu.ctaDescription || 'Reserva tu mesa o haz tu pedido ahora'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {activeMenu.phoneNumber && (
                  <a
                    href={`tel:${activeMenu.phoneNumber}`}
                    className="px-6 py-3 rounded-lg font-semibold transition-colors"
                    style={{ 
                      backgroundColor: 'white',
                      color: theme.colors.primary 
                    }}
                  >
                    📞 Llamar Ahora
                  </a>
                )}
                {activeMenu.deliveryUrl && (
                  <a
                    href={activeMenu.deliveryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white transition-colors"
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
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

export default PublicMenu;
