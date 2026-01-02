import { api } from './client';

export const createRestaurant = (payload) => api.post('/api/restaurants', payload);
export const fetchRestaurants = () => api.get('/api/restaurants');
