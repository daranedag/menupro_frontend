import { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '../api/client';
import { createRestaurant as createRestaurantApi } from '../api/restaurants';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeRole = (role) =>
    (role || 'restaurant_owner')
      .toString()
      .trim()
      .toLowerCase();

  const normalizeRestaurant = (restaurant) => ({
    id: restaurant?.id || restaurant?._id || restaurant?.restaurantId || Date.now().toString(),
    name: restaurant?.name || restaurant?.restaurantName || 'Restaurante',
    slug: restaurant?.slug,
  });

  const extractTierData = (payload) => {
    if (!payload || typeof payload !== 'object') return {};

    const tier = payload.tier || payload.subscription?.tier || payload.plan || payload.subscriptionPlan;
    const limits =
      payload.limits ||
      payload.subscription?.limits ||
      payload.tier?.limits ||
      payload.plan?.limits ||
      payload.subscriptionLimits ||
      payload.tierLimits;

    const maxRestaurants =
      limits?.maxRestaurants ??
      limits?.restaurants ??
      limits?.restaurantsCount ??
      limits?.restaurants_limit ??
      limits?.max_restaurants ??
      null;

    return {
      tierName: tier?.name || tier?.code || tier || null,
      tierCode: tier?.code || tier?.name || null,
      limits: limits || null,
      maxRestaurants,
    };
  };

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken);
    }

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const restoredRole = normalizeRole(parsed?.role);
        const normalizedRestaurants = (parsed?.restaurants || []).map(normalizeRestaurant);
        setUser({ ...parsed, role: restoredRole, restaurants: normalizedRestaurants });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const persistSession = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setAuthToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', authToken);
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });

      const authToken = data?.token || data?.accessToken || data?.access_token || data?.data?.access_token;
      if (!authToken) {
        throw new Error('No se recibió el token de autenticación');
      }

      const backendUser = data?.user || data?.data?.user || data;
      const restaurants = data?.restaurants || data?.data?.restaurants || backendUser?.restaurants || (backendUser?.restaurant ? [backendUser.restaurant] : []);
      const normalizedRestaurants = (restaurants || []).map(normalizeRestaurant);
      const activeRestaurant = normalizedRestaurants?.[0];

      const normalizedRole = normalizeRole(
        backendUser?.app_role || backendUser?.role || backendUser?.userRole || backendUser?.roleName
      );

      const tierDataPrimary = extractTierData(data);
      const tierDataSecondary = extractTierData(backendUser);
      const tierInfo = {
        tierName: tierDataPrimary.tierName || tierDataSecondary.tierName || null,
        tierCode: tierDataPrimary.tierCode || tierDataSecondary.tierCode || null,
        limits: tierDataPrimary.limits || tierDataSecondary.limits || null,
        maxRestaurants: tierDataPrimary.maxRestaurants ?? tierDataSecondary.maxRestaurants ?? null,
      };

      const userData = {
        id: backendUser?.id || backendUser?.userId || backendUser?._id,
        email: backendUser?.email || email,
        name: backendUser?.name || backendUser?.fullName || backendUser?.username || email?.split('@')?.[0],
        role: normalizedRole,
        restaurants: normalizedRestaurants,
        activeRestaurantId: backendUser?.restaurantId || activeRestaurant?.id || activeRestaurant?._id,
        activeRestaurantName: backendUser?.restaurantName || activeRestaurant?.name,
        activeRestaurantSlug: backendUser?.restaurantSlug || activeRestaurant?.slug,
        subscriptionTier: tierInfo.tierName || tierInfo.tierCode,
        tierLimits: tierInfo.limits,
        maxRestaurants: tierInfo.maxRestaurants,
      };

      persistSession(userData, authToken);
      return userData;
    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data?.error || error.message || 'Error al iniciar sesión';
      throw new Error(message);
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const safeName = name || email?.split('@')?.[0] || 'Usuario';
      const payload = { name: safeName, email, password };

      const { data } = await api.post('/api/auth/register', payload);

      const authToken = data?.token || data?.accessToken || data?.access_token || data?.data?.access_token;
      if (!authToken) {
        throw new Error('No se recibió el token de autenticación');
      }

      const backendUser = data?.user || data?.data?.user || data;
      const restaurants = data?.restaurants || data?.data?.restaurants || backendUser?.restaurants || (backendUser?.restaurant ? [backendUser.restaurant] : []);
      const normalizedRestaurants = (restaurants || []).map(normalizeRestaurant);
      const activeRestaurant = normalizedRestaurants?.[0];

      const normalizedRole = normalizeRole(
        backendUser?.app_role || backendUser?.role || backendUser?.userRole || backendUser?.roleName
      );

      const tierDataPrimary = extractTierData(data);
      const tierDataSecondary = extractTierData(backendUser);
      const tierInfo = {
        tierName: tierDataPrimary.tierName || tierDataSecondary.tierName || null,
        tierCode: tierDataPrimary.tierCode || tierDataSecondary.tierCode || null,
        limits: tierDataPrimary.limits || tierDataSecondary.limits || null,
        maxRestaurants: tierDataPrimary.maxRestaurants ?? tierDataSecondary.maxRestaurants ?? null,
      };

      const userData = {
        id: backendUser?.id || backendUser?.userId || backendUser?._id,
        email: backendUser?.email || email,
        name: backendUser?.name || backendUser?.fullName || backendUser?.username || email?.split('@')?.[0],
        role: normalizedRole,
        restaurants: normalizedRestaurants,
        activeRestaurantId: backendUser?.restaurantId || activeRestaurant?.id || activeRestaurant?._id,
        activeRestaurantName: backendUser?.restaurantName || activeRestaurant?.name,
        activeRestaurantSlug: backendUser?.restaurantSlug || activeRestaurant?.slug,
        subscriptionTier: tierInfo.tierName || tierInfo.tierCode,
        tierLimits: tierInfo.limits,
        maxRestaurants: tierInfo.maxRestaurants,
      };

      persistSession(userData, authToken);
      return userData;
    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data?.error || error.message || 'Error al registrarse';
      throw new Error(message);
    }
  };

  const getMaxRestaurants = () =>
    user?.maxRestaurants ??
    user?.tierLimits?.maxRestaurants ??
    user?.tierLimits?.restaurants ??
    user?.tierLimits?.restaurants_count ??
    user?.tierLimits?.restaurantsCount ??
    null;

  const createRestaurant = async ({ name, slug }) => {
    if (!user || !token) {
      throw new Error('Debes iniciar sesión para crear un restaurante');
    }

    const safeName = name?.trim();
    if (!safeName) {
      throw new Error('Ingresa el nombre del restaurante');
    }

    const limit = getMaxRestaurants();
    const currentCount = user?.restaurants?.length ?? 0;
    if (limit !== null && limit !== undefined && Number(limit) <= currentCount) {
      throw new Error(`Tu plan permite hasta ${limit} restaurantes.`);
    }

    const normalizedSlug = (slug || safeName)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const payload = { name: safeName, slug: normalizedSlug };
    const { data } = await createRestaurantApi(payload);
    const restaurant = normalizeRestaurant(data?.restaurant || data);

    const updatedRestaurants = [...(user?.restaurants || []), restaurant];
    const updatedUser = {
      ...user,
      restaurants: updatedRestaurants,
      activeRestaurantId: restaurant.id,
      activeRestaurantName: restaurant.name,
      activeRestaurantSlug: restaurant.slug,
    };

    persistSession(updatedUser, token);
    return restaurant;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('menus'); // Limpiar menús al cerrar sesión
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    createRestaurant,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
