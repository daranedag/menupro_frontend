import { api } from './client';

export const fetchAdminUsers = () => api.get('/api/admin/users');

export const updateUserRole = (userId, role) =>
  api.patch(`/api/admin/users/${userId}/role`, { role });

export const fetchTiers = () => api.get('/api/admin/tiers');

export const updateTier = (tierId, payload) =>
  api.patch(`/api/admin/tiers/${tierId}`, payload);

export const fetchFeatures = () => api.get('/api/admin/features');

export const updateFeaturePrice = (featureId, basePrice) =>
  api.patch(`/api/admin/features/${featureId}/price`, { base_price: basePrice });

export const fetchUserFeatures = (userId) =>
  api.get(`/api/admin/users/${userId}/features`);

export const fetchRestaurantSummary = () => api.get('/api/admin/restaurants/summary');
