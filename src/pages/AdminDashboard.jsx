import { useEffect, useMemo, useRef, useState } from 'react';
import { Shield, RefreshCw, Users, Store, Sparkles, DollarSign, Layers, ListChecks } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, Button, Input, Badge, Spinner } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  fetchAdminUsers,
  updateUserRole,
  fetchTiers,
  updateTier,
  fetchFeatures,
  updateFeaturePrice,
  fetchUserFeatures,
  fetchRestaurantSummary,
} from '../api/admin';

const asArray = (payload) => {
  const base = payload?.data?.data ?? payload?.data ?? payload;
  if (Array.isArray(base)) return base;
  if (!base || typeof base !== 'object') return [];
  const firstArray = Object.values(base).find((value) => Array.isArray(value));
  return firstArray || [];
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);

function AdminDashboard() {
  const { user } = useAuth();
  const role = (user?.app_role || user?.role)?.toString?.().toLowerCase?.();
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const hasLoadedRef = useRef(false);
  const [users, setUsers] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [tierDrafts, setTierDrafts] = useState({});
  const [features, setFeatures] = useState([]);
  const [featureDrafts, setFeatureDrafts] = useState({});
  const [restaurantSummary, setRestaurantSummary] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userFeatures, setUserFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUserFeaturesLoading, setIsUserFeaturesLoading] = useState(false);
  const [error, setError] = useState('');

  const normalizeUser = (user) => ({
    id: user?.id || user?._id || user?.userId,
    name: user?.name || user?.fullName || user?.username || user?.email || 'Usuario',
    email: user?.email,
    role: user?.role || user?.userRole || 'restaurant_owner',
    restaurantsCount: user?.restaurantsCount ?? user?.restaurants_count ?? user?.restaurantCount ?? 0,
  });

  const normalizeTier = (tier) => ({
    id: tier?.id || tier?._id || tier?.tierId,
    name: tier?.name || tier?.code || 'Tier',
    description: tier?.description || '',
    price: tier?.price ?? tier?.base_price ?? tier?.amount ?? 0,
    status: tier?.status || (tier?.active ? 'active' : 'inactive') || 'active',
    limits: tier?.limits || {},
    flags: tier?.flags || {},
  });

  const normalizeFeature = (feature) => ({
    id: feature?.id || feature?._id || feature?.featureId,
    name: feature?.name || feature?.code || 'Feature',
    description: feature?.description || '',
    base_price: feature?.base_price ?? feature?.price ?? 0,
  });

  const normalizeRestaurantSummary = (item) => ({
    id: item?.id || item?._id || item?.restaurantId,
    name: item?.name || item?.restaurantName || 'Restaurante',
    menus: item?.menus ?? item?.menusCount ?? item?.menus_count ?? 0,
    sections: item?.sections ?? item?.sectionsCount ?? item?.sections_count ?? 0,
    dishes: item?.dishes ?? item?.dishesCount ?? item?.dishes_count ?? 0,
  });

  const syncDrafts = (tiersData, featuresData) => {
    const tierState = {};
    tiersData.forEach((tier) => {
      tierState[tier.id] = {
        price: tier.price,
        status: tier.status,
        limits: JSON.stringify(tier.limits || {}, null, 2),
        flags: JSON.stringify(tier.flags || {}, null, 2),
      };
    });
    setTierDrafts(tierState);

    const featureState = {};
    featuresData.forEach((feature) => {
      featureState[feature.id] = feature.base_price;
    });
    setFeatureDrafts(featureState);
  };

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (role !== 'platform_admin') {
        setError('Necesitas rol platform_admin para ver este panel.');
        setUsers([]);
        setTiers([]);
        setFeatures([]);
        setRestaurantSummary([]);
        setIsLoading(false);
        return;
      }
      const [usersRes, tiersRes, featuresRes, summaryRes] = await Promise.all([
        fetchAdminUsers(),
        fetchTiers(),
        fetchFeatures(),
        fetchRestaurantSummary(),
      ]);

      const normalizedUsers = asArray(usersRes).map(normalizeUser);
      const normalizedTiers = asArray(tiersRes).map(normalizeTier);
      const normalizedFeatures = asArray(featuresRes).map(normalizeFeature);
      const normalizedSummary = asArray(summaryRes).map(normalizeRestaurantSummary);

      setUsers(normalizedUsers);
      setTiers(normalizedTiers);
      setFeatures(normalizedFeatures);
      setRestaurantSummary(normalizedSummary);
      syncDrafts(normalizedTiers, normalizedFeatures);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setError('Endpoints de administración no disponibles (404). Verifica que el backend exponga /api/admin/* y la URL base.');
      } else {
        setError(err?.message || 'No se pudo cargar la información administrativa');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role !== 'platform_admin') {
      setError('Necesitas rol platform_admin para ver este panel.');
      setUsers([]);
      setTiers([]);
      setFeatures([]);
      setRestaurantSummary([]);
      setIsLoading(false);
      return;
    }

    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadData();
  }, [role]);

  const handleRoleChange = async (userId, newRole) => {
    setIsUpdating(true);
    setError('');
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      setError(err?.message || 'No se pudo actualizar el rol');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTierSave = async (tierId) => {
    const draft = tierDrafts[tierId];
    if (!draft) return;

    setIsUpdating(true);
    setError('');
    try {
      let limits = {};
      let flags = {};
      try {
        limits = draft.limits ? JSON.parse(draft.limits) : {};
        flags = draft.flags ? JSON.parse(draft.flags) : {};
      } catch (parseErr) {
        setError('Limits y flags deben tener JSON válido');
        setIsUpdating(false);
        return;
      }
      const payload = {
        price: Number(draft.price) || 0,
        limits,
        flags,
        status: draft.status || 'active',
      };
      await updateTier(tierId, payload);
      setTiers((prev) => prev.map((tier) => (tier.id === tierId ? { ...tier, ...payload } : tier)));
    } catch (err) {
      setError(err?.message || 'No se pudo guardar el tier');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFeaturePriceSave = async (featureId) => {
    const price = Number(featureDrafts[featureId]);
    if (Number.isNaN(price)) {
      setError('El precio base debe ser un número');
      return;
    }
    setIsUpdating(true);
    setError('');
    try {
      await updateFeaturePrice(featureId, price);
      setFeatures((prev) => prev.map((feature) => (feature.id === featureId ? { ...feature, base_price: price } : feature)));
    } catch (err) {
      setError(err?.message || 'No se pudo actualizar el precio de la feature');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLoadUserFeatures = async (userId) => {
    setSelectedUserId(userId);
    if (!userId) {
      setUserFeatures([]);
      return;
    }
    setIsUserFeaturesLoading(true);
    setError('');
    try {
      const response = await fetchUserFeatures(userId);
      const normalized = asArray(response);
      setUserFeatures(normalized);
    } catch (err) {
      setError(err?.message || 'No se pudo obtener las features del usuario');
    } finally {
      setIsUserFeaturesLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const admins = users.filter((u) => u.role === 'platform_admin').length;
    const owners = users.filter((u) => u.role !== 'platform_admin').length;
    return {
      totalUsers,
      admins,
      owners,
      restaurants: restaurantSummary.length,
    };
  }, [users, restaurantSummary.length]);

  const renderError = () => (
    <div
      className={`p-4 mb-4 rounded-lg border ${
        isDark
          ? 'bg-red-900/30 border-red-800 text-red-100'
          : 'bg-red-50 border-red-200 text-red-700'
      }`}
    >
      {error}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-indigo-600 font-semibold flex items-center gap-2">
            <Shield size={18} /> Panel de plataforma
          </p>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Administración</h1>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Gestiona roles, tiers, features y el estado global de la plataforma.
          </p>
        </div>
        <Button variant="outline" onClick={loadData} className="flex items-center gap-2">
          <RefreshCw size={16} /> Refrescar
        </Button>
      </div>

      {error && renderError()}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Cargando panel admin..." />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card padding="sm" className={isDark ? 'border border-gray-700' : 'border border-slate-100'}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={isDark ? 'text-sm text-gray-300' : 'text-sm text-gray-500'}>Usuarios totales</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalUsers}</p>
                </div>
                <Users className="text-indigo-600" size={24} />
              </div>
            </Card>
            <Card padding="sm" className={isDark ? 'border border-gray-700' : 'border border-slate-100'}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={isDark ? 'text-sm text-gray-300' : 'text-sm text-gray-500'}>Platform Admin</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.admins}</p>
                </div>
                <Shield className="text-emerald-600" size={24} />
              </div>
            </Card>
            <Card padding="sm" className={isDark ? 'border border-gray-700' : 'border border-slate-100'}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={isDark ? 'text-sm text-gray-300' : 'text-sm text-gray-500'}>Restaurant Owners</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.owners}</p>
                </div>
                <Sparkles className="text-amber-600" size={24} />
              </div>
            </Card>
            <Card padding="sm" className={isDark ? 'border border-gray-700' : 'border border-slate-100'}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={isDark ? 'text-sm text-gray-300' : 'text-sm text-gray-500'}>Restaurantes</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.restaurants}</p>
                </div>
                <Store className="text-blue-600" size={24} />
              </div>
            </Card>
          </div>

          <Card
            title="Gestión de usuarios"
            subtitle="Reasigna roles y consulta los restaurantes asociados"
            className={isDark ? 'border border-gray-700' : 'border border-slate-100'}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className={`text-sm ${isDark ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-b'}`}>
                    <th className="py-2 pr-4">Usuario</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Rol</th>
                    <th className="py-2 pr-4">Restaurantes</th>
                  </tr>
                </thead>
                <tbody className={isDark ? 'divide-y divide-gray-700' : 'divide-y'}>
                  {users.map((user) => (
                    <tr key={user.id} className="text-sm">
                      <td className={`py-3 pr-4 font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{user.name}</td>
                      <td className={isDark ? 'py-3 pr-4 text-gray-300' : 'py-3 pr-4 text-gray-600'}>{user.email || '—'}</td>
                      <td className="py-3 pr-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`border rounded-lg px-3 py-2 text-sm ${
                            isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : ''
                          }`}
                          disabled={isUpdating}
                        >
                          <option value="platform_admin">Platform Admin</option>
                          <option value="restaurant_owner">Restaurant Owner</option>
                        </select>
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{user.restaurantsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card
            title="Tiers de suscripción"
            subtitle="Actualiza precio, límites, flags y estado"
            className={isDark ? 'border border-gray-700' : 'border border-slate-100'}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`p-4 border rounded-lg ${
                    isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={isDark ? 'text-sm text-gray-300' : 'text-sm text-gray-500'}>
                        {tier.description || 'Tier de la plataforma'}
                      </p>
                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{tier.name}</p>
                    </div>
                    <Badge variant={tier.status === 'active' ? 'success' : 'danger'} rounded>
                      {tier.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <Input
                      label="Precio"
                      type="number"
                      value={tierDrafts[tier.id]?.price ?? ''}
                      onChange={(e) =>
                        setTierDrafts((prev) => ({
                          ...prev,
                          [tier.id]: { ...prev[tier.id], price: e.target.value },
                        }))
                      }
                    />
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                        Estado
                      </label>
                      <select
                        value={tierDrafts[tier.id]?.status || 'active'}
                        onChange={(e) =>
                          setTierDrafts((prev) => ({
                            ...prev,
                            [tier.id]: { ...prev[tier.id], status: e.target.value },
                          }))
                        }
                        className={`w-full border rounded-lg px-3 py-2 ${
                          isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : ''
                        }`}
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                        Limits (JSON)
                      </label>
                      <textarea
                        rows={5}
                        className={`w-full border rounded-lg px-3 py-2 text-sm ${
                          isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : ''
                        }`}
                        value={tierDrafts[tier.id]?.limits || ''}
                        onChange={(e) =>
                          setTierDrafts((prev) => ({
                            ...prev,
                            [tier.id]: { ...prev[tier.id], limits: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                        Flags (JSON)
                      </label>
                      <textarea
                        rows={5}
                        className={`w-full border rounded-lg px-3 py-2 text-sm ${
                          isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : ''
                        }`}
                        value={tierDrafts[tier.id]?.flags || ''}
                        onChange={(e) =>
                          setTierDrafts((prev) => ({
                            ...prev,
                            [tier.id]: { ...prev[tier.id], flags: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => handleTierSave(tier.id)}
                      disabled={isUpdating}
                      className="flex items-center gap-2"
                    >
                      <DollarSign size={16} /> Guardar cambios
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Pricing de features"
            subtitle="Actualiza el base_price de cada feature"
            className={isDark ? 'border border-gray-700' : 'border border-slate-100'}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`p-4 border rounded-lg ${
                    isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-white'
                  }`}
                >
                  <p className={isDark ? 'text-sm text-gray-300' : 'text-sm text-gray-500'}>
                    {feature.description || 'Feature'}
                  </p>
                  <p className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.name}
                  </p>
                  <p className={isDark ? 'text-sm text-gray-200 mb-3' : 'text-sm text-gray-700 mb-3'}>
                    Precio actual: {formatCurrency(feature.base_price)}
                  </p>
                  <Input
                    label="Nuevo precio"
                    type="number"
                    value={featureDrafts[feature.id] ?? ''}
                    onChange={(e) =>
                      setFeatureDrafts((prev) => ({
                        ...prev,
                        [feature.id]: e.target.value,
                      }))
                    }
                  />
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="secondary"
                      onClick={() => handleFeaturePriceSave(feature.id)}
                      disabled={isUpdating}
                      className="flex items-center gap-2"
                    >
                      <Layers size={16} /> Guardar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Features por usuario"
            subtitle="Consulta las features activas en los restaurantes de un usuario"
            className={isDark ? 'border border-gray-700' : 'border border-slate-100'}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                  Selecciona un usuario
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => handleLoadUserFeatures(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : ''
                  }`}
                >
                  <option value="">— Seleccionar —</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="primary"
                  onClick={() => handleLoadUserFeatures(selectedUserId)}
                  disabled={!selectedUserId || isUserFeaturesLoading}
                  className="flex items-center gap-2 w-full"
                >
                  <ListChecks size={16} /> Consultar
                </Button>
              </div>
            </div>

            {isUserFeaturesLoading ? (
              <div className="py-6 flex justify-center">
                <Spinner label="Cargando features del usuario..." />
              </div>
            ) : userFeatures.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {userFeatures.map((feature) => (
                  <div
                    key={feature.id || feature.featureId}
                    className={`p-4 border rounded-lg ${
                      isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-white'
                    }`}
                  >
                    <p className={isDark ? 'text-sm text-gray-300' : 'text-sm text-gray-500'}>
                      {feature.restaurantName || 'Restaurante'}
                    </p>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {feature.name || feature.code}
                    </p>
                    <p className={isDark ? 'text-sm text-gray-200 mt-1' : 'text-sm text-gray-600 mt-1'}>
                      Estado: {feature.status === 'active' || feature.active ? 'Activa' : 'Inactiva'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={isDark ? 'text-sm text-gray-300' : 'text-sm text-gray-600'}>
                Selecciona un usuario para ver sus features.
              </p>
            )}
          </Card>

          <Card
            title="Resumen por restaurante"
            subtitle="Cantidad de cartas, secciones y platos por restaurante"
            className={isDark ? 'border border-gray-700' : 'border border-slate-100'}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className={`text-sm ${isDark ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-b'}`}>
                    <th className="py-2 pr-4">Restaurante</th>
                    <th className="py-2 pr-4">Cartas</th>
                    <th className="py-2 pr-4">Secciones</th>
                    <th className="py-2 pr-4">Platos</th>
                  </tr>
                </thead>
                <tbody className={isDark ? 'divide-y divide-gray-700' : 'divide-y'}>
                  {restaurantSummary.map((restaurant, idx) => (
                    <tr key={restaurant.id || restaurant.restaurantId || restaurant.name || idx} className="text-sm">
                      <td className={`py-3 pr-4 font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                        {restaurant.name}
                      </td>
                      <td className={isDark ? 'py-3 pr-4 text-gray-200' : 'py-3 pr-4 text-gray-700'}>{restaurant.menus}</td>
                      <td className={isDark ? 'py-3 pr-4 text-gray-200' : 'py-3 pr-4 text-gray-700'}>{restaurant.sections}</td>
                      <td className={isDark ? 'py-3 pr-4 text-gray-200' : 'py-3 pr-4 text-gray-700'}>{restaurant.dishes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;
