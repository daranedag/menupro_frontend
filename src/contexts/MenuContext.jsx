import { createContext, useContext, useState, useEffect } from 'react';
import { mockMenus } from '../data/mockMenuData';

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

  // Cargar menús desde localStorage o usar mock data
  useEffect(() => {
    const storedMenus = localStorage.getItem('menus');
    if (storedMenus) {
      try {
        setMenus(JSON.parse(storedMenus));
      } catch (error) {
        console.error('Error parsing menus:', error);
        setMenus(mockMenus);
      }
    } else {
      setMenus(mockMenus);
    }
    setIsLoading(false);
  }, []);

  // Guardar menús en localStorage cuando cambien
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('menus', JSON.stringify(menus));
    }
  }, [menus, isLoading]);

  // CRUD Menús/Cartas
  const createMenu = (menuData) => {
    const newMenu = {
      ...menuData,
      id: Date.now().toString(),
      sections: [],
      isActive: true,
      isVisible: true,
      createdAt: new Date().toISOString(),
    };
    setMenus([...menus, newMenu]);
    return newMenu;
  };

  const updateMenu = (menuId, updates) => {
    setMenus(menus.map(menu => 
      menu.id === menuId ? { ...menu, ...updates } : menu
    ));
  };

  const deleteMenu = (menuId) => {
    setMenus(menus.filter(menu => menu.id !== menuId));
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
  const createSection = (menuId, sectionData) => {
    const newSection = {
      ...sectionData,
      id: Date.now().toString(),
      items: [],
      isActive: true,
      isVisible: true,
    };
    
    setMenus(menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          sections: [...(menu.sections || []), newSection]
        };
      }
      return menu;
    }));
    return newSection;
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
  const reorderSections = (menuId, reorderedSections) => {
    setMenus(menus.map(menu => 
      menu.id === menuId ? { ...menu, sections: reorderedSections } : menu
    ));
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
    // Menús
    createMenu,
    updateMenu,
    deleteMenu,
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
