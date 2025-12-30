import { api } from './client';

export const fetchMenusByRestaurant = (restaurantId) =>
  api.get(`/api/menus/restaurant/${restaurantId}`);

export const createMenu = (payload) =>
  api.post('/api/menus', payload);

export const updateMenu = (menuId, payload) =>
  api.patch(`/api/menus/${menuId}`, payload);

export const publishMenu = (menuId, payload = { publish: true }) =>
  api.patch(`/api/menus/${menuId}/publish`, payload);

export const fetchPublicMenu = (restaurantSlug, menuSlug) =>
  api.get(`/api/menus/public/${restaurantSlug}/${menuSlug}`);

export const createSection = (menuId, payload) =>
  api.post(`/api/menus/${menuId}/sections`, payload);

export const fetchSections = (menuId) =>
  api.get(`/api/menus/${menuId}/sections`);

export const fetchSectionItems = (sectionId) =>
  api.get(`/api/menus/sections/${sectionId}/items`);

export const reorderSectionItems = (sectionId, items) =>
  api.patch(`/api/menus/sections/${sectionId}/items/reorder`, {
    items: items.map((item, idx) => ({
      id: item.id,
      order_index: item.order_index ?? item.orderIndex ?? idx,
    })),
  });

export const createDish = (sectionId, payload) =>
  api.post(`/api/menus/sections/${sectionId}/items`, payload);

export const reorderSectionsApi = (menuId, sections) =>
  api.patch(`/api/menus/${menuId}/sections/reorder`, {
    sections: sections.map(({ id, orderIndex, order_index }) => ({
      id,
      order_index: order_index ?? orderIndex ?? 0,
    })),
  });
