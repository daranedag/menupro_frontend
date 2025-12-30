import { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '../api/client';

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
        setUser({ ...parsed, role: restoredRole });
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
      const activeRestaurant = restaurants?.[0];

      const normalizedRole = normalizeRole(
        backendUser?.app_role || backendUser?.role || backendUser?.userRole || backendUser?.roleName
      );

      const userData = {
        id: backendUser?.id || backendUser?.userId || backendUser?._id,
        email: backendUser?.email || email,
        name: backendUser?.name || backendUser?.fullName || backendUser?.username || email?.split('@')?.[0],
        role: normalizedRole,
        restaurants,
        activeRestaurantId: backendUser?.restaurantId || activeRestaurant?.id || activeRestaurant?._id,
        activeRestaurantName: backendUser?.restaurantName || activeRestaurant?.name,
        activeRestaurantSlug: backendUser?.restaurantSlug || activeRestaurant?.slug,
      };

      persistSession(userData, authToken);
      return userData;
    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data?.error || error.message || 'Error al iniciar sesión';
      throw new Error(message);
    }
  };

  const register = async () => {
    throw new Error('El registro aún no está disponible desde la aplicación. Solicita acceso al administrador.');
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
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
