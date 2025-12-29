import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchMenusByRestaurant, createMenu as createMenuApi, updateMenu as updateMenuApi, publishMenu as publishMenuApi, createSection as createSectionApi, fetchSections, reorderSectionsApi } from '../api/menus';
import { useAuth } from './AuthContext';

const MenuContext = createContext(null);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const hasFetchedRef = useRef(false);

  const normalizeDish = (dish) => ({
    id: dish?.id || dish?._id || dish?.dishId || Date.now().toString(),
    name: dish?.name || 'Sin nombre',
    description: dish?.description || '',
    longDescription: dish?.longDescription || dish?.long_description,
    price: dish?.price ?? 0,
    discount: dish?.discount ?? 0,
    image: dish?.image,
    tags: dish?.tags || [],
    calories: dish?.calories,
    prepTime: dish?.prepTime || dish?.prep_time,
    isVegetarian: dish?.isVegetarian,
    isSpicy: dish?.isSpicy,
    isActive: dish?.isActive ?? dish?.active ?? true,
    isVisible: dish?.isVisible ?? dish?.visible ?? true,
  });

  const normalizeSection = (section) => ({
    id: section?.id || section?._id || section?.sectionId || Date.now().toString(),
    name: section?.name || 'Sin nombre',
    description: section?.description || '',
    icon: section?.icon,
    orderIndex: section?.order_index ?? section?.orderIndex ?? 0,
    isActive: section?.isActive ?? section?.active ?? true,
    isVisible: section?.isVisible ?? section?.visible ?? true,
    items: (section?.items || section?.dishes || []).map(normalizeDish),
  });

  const normalizeMenu = (menu) => ({
    id: menu?.id || menu?._id || menu?.menuId || Date.now().toString(),
    name: menu?.name || 'Menú sin nombre',
    slug: menu?.slug,
    restaurantId: menu?.restaurantId || menu?.restaurant_id,
    description: menu?.description || '',
    icon: menu?.icon || '🍽️',
    isActive: menu?.isActive ?? menu?.active ?? true,
    isVisible: menu?.isVisible ?? menu?.visible ?? true,
    isPublished: menu?.isPublished ?? menu?.published ?? menu?.is_published ?? false,
    showCallToAction: menu?.showCallToAction ?? menu?.ctaEnabled ?? true,
    ctaTitle: menu?.ctaTitle || menu?.cta_title,
    ctaDescription: menu?.ctaDescription || menu?.cta_description,
    phoneNumber: menu?.phoneNumber || menu?.phone_number,
    deliveryUrl: menu?.deliveryUrl || menu?.delivery_url,
    sections: (menu?.sections || []).map(normalizeSection),
  });

  const fetchMenus = useCallback(async (force = false) => {
    if (authLoading || !isAuthenticated || !user) {
      return;
    }

    const restaurantId = user?.activeRestaurantId || user?.restaurantId || user?.restaurant?.id || user?.restaurant?._id;

    if (!restaurantId) {
      setMenus([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (hasFetchedRef.current && !force) {
      return;
    }
    hasFetchedRef.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchMenusByRestaurant(restaurantId);
      const payload = data?.data ?? data;
      const backendMenus = Array.isArray(payload) ? payload : payload?.menus || [];
      const normalized = backendMenus.map(normalizeMenu);

      const menusWithSections = await Promise.all(normalized.map(async (menuItem) => {
        try {
          const { data: sectionsData } = await fetchSections(menuItem.id);
          const sectionsPayload = sectionsData?.data ?? sectionsData;
          const sectionsArray = Array.isArray(sectionsPayload) ? sectionsPayload : sectionsPayload?.sections || [];
          const normalizedSections = sectionsArray.map(normalizeSection).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
          return { ...menuItem, sections: normalizedSections };
        } catch (sectionErr) {
          return menuItem; // keep menu without sections if fetch fails
        }
      }));

      setMenus(menusWithSections);
    } catch (err) {
      console.error('Error fetching menus', err);
      setMenus([]);
      setError(err?.message || 'No se pudieron cargar las cartas');
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, user?.activeRestaurantId, user?.restaurantId, user?.restaurant]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  useEffect(() => {
    hasFetchedRef.current = false;
  }, [user?.activeRestaurantId, user?.restaurantId, user?.restaurant]);

  // CRUD Menús/Cartas
  const createMenu = async (menuData) => {
    const payload = {
      ...menuData,
      restaurantId: user?.activeRestaurantId || user?.restaurantId,
      restaurant_id: user?.activeRestaurantId || user?.restaurantId,
    };

    const { data } = await createMenuApi(payload);
    const created = normalizeMenu(data?.menu || data);
    setMenus([...menus, created]);
    return created;
  };

  const updateMenu = async (menuId, updates) => {
    const payload = {
      ...updates,
      restaurant_id: updates?.restaurant_id || user?.activeRestaurantId || user?.restaurantId,
    };

    const { data } = await updateMenuApi(menuId, payload);
    const updated = normalizeMenu(data?.menu || data);
    setMenus(menus.map(menu => 
      menu.id === menuId ? updated : menu
    ));
    return updated;
  };

  const deleteMenu = (menuId) => {
    setMenus(menus.filter(menu => menu.id !== menuId));
  };

  const publishMenu = async (menuId, publishState = true) => {
    const { data } = await publishMenuApi(menuId, { publish: publishState });
    const updated = normalizeMenu(data?.menu || data);
    setMenus(menus.map(menu => 
      menu.id === menuId ? updated : menu
    ));
    return updated;
  };

  const toggleMenuStatus = (menuId) => {
    setMenus(menus.map(menu =>
      menu.id === menuId ? { ...menu, isActive: !menu.isActive } : menu
    ));
  };

  const toggleMenuVisibility = (menuId) => {
    setMenus(menus.map(menu =>
      menu.id === menuId ? { ...menu, isVisible: !menu.isVisible } : menu
    ));
  };

  // CRUD Secciones
  const createSection = async (menuId, sectionData) => {
    const menu = menus.find((m) => m.id === menuId);
    const orderIndex = menu?.sections?.length ?? 0;
    const payload = {
      ...sectionData,
      order_index: orderIndex,
    };

    const { data } = await createSectionApi(menuId, payload);
    const created = normalizeSection(data?.section || data);

    setMenus(menus.map(menuItem => {
      if (menuItem.id === menuId) {
        return {
          ...menuItem,
          sections: [...(menuItem.sections || []), created]
        };
      }
      return menuItem;
    }));

    return created;
  };

  const updateSection = (menuId, sectionId, updates) => {
    setMenus(menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          sections: menu.sections.map(section =>
            section.id === sectionId ? { ...section, ...updates } : section
          )
        };
      }
      return menu;
    }));
  };

  const deleteSection = (menuId, sectionId) => {
    setMenus(menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          sections: menu.sections.filter(section => section.id !== sectionId)
        };
      }
      return menu;
    }));
  };

  const toggleSectionStatus = (menuId, sectionId) => {
    setMenus(menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          sections: menu.sections.map(section =>
            section.id === sectionId ? { ...section, isActive: !section.isActive } : section
          )
        };
      }
      return menu;
    }));
  };

  // Reordenar secciones
  const reorderSections = async (menuId, reorderedSections) => {
    const withOrder = reorderedSections.map((section, idx) => ({
      ...section,
      orderIndex: idx,
      order_index: idx,
    }));

    setMenus(menus.map(menu => 
      menu.id === menuId ? { ...menu, sections: withOrder } : menu
    ));

    try {
      const { data } = await reorderSectionsApi(menuId, withOrder);
      const payload = data?.data ?? data;
      const sectionsArray = Array.isArray(payload) ? payload : payload?.sections || [];
      const normalizedSections = sectionsArray.map(normalizeSection).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

      setMenus(current => current.map(menu =>
        menu.id === menuId ? { ...menu, sections: normalizedSections } : menu
      ));
    } catch (err) {
      console.error('Error reordenando secciones', err);
    }
  };

  // Reordenar platos
  const reorderDishes = (menuId, sectionId, reorderedDishes) => {
    setMenus(menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          sections: menu.sections.map(section => 
            section.id === sectionId ? { ...section, items: reorderedDishes } : section
          )
        };
      }
      return menu;
    }));
  };

  // CRUD Platos
  const createDish = (menuId, sectionId, dishData) => {
    const newDish = {
      ...dishData,
      id: Date.now().toString(),
      isActive: true,
      isVisible: true,
      createdAt: new Date().toISOString(),
    };
    
    setMenus(menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          sections: menu.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                items: [...(section.items || []), newDish]
              };
            }
            return section;
          })
        };
      }
      return menu;
    }));
    return newDish;
  };

  const updateDish = (menuId, sectionId, dishId, updates) => {
    setMenus(menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          sections: menu.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                items: section.items.map(item =>
                  item.id === dishId ? { ...item, ...updates } : item
                )
              };
            }
            return section;
          })
        };
      }
      return menu;
    }));
  };

  const deleteDish = (menuId, sectionId, dishId) => {
    setMenus(menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          sections: menu.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                items: section.items.filter(item => item.id !== dishId)
              };
            }
            return section;
          })
        };
      }
      return menu;
    }));
  };

  const toggleDishStatus = (menuId, sectionId, dishId) => {
    setMenus(menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          sections: menu.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                items: section.items.map(item =>
                  item.id === dishId ? { ...item, isActive: !item.isActive } : item
                )
              };
            }
            return section;
          })
        };
      }
      return menu;
    }));
  };

  const value = {
    menus,
    isLoading,
    error,
    refreshMenus: () => fetchMenus(true),
    // Menús
    createMenu,
    updateMenu,
    deleteMenu,
    publishMenu,
    toggleMenuStatus,
    toggleMenuVisibility,
    // Secciones
    createSection,
    updateSection,
    deleteSection,
    toggleSectionStatus,
    reorderSections,
    // Platos
    createDish,
    updateDish,
    deleteDish,
    toggleDishStatus,
    reorderDishes,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
