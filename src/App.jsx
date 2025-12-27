import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MenuProvider } from './contexts/MenuContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PublicMenu from './pages/PublicMenu';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DesignSystemDemo from './pages/DesignSystemDemo';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <ThemeProvider>
          <BrowserRouter>
          <Routes>
            {/* Ruta pública - Carta del restaurante */}
            <Route path="/menu/:restaurantId" element={<PublicMenu />} />
            
            {/* Ruta de autenticación */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Ruta privada - Dashboard */}
            <Route 
              path="/dashboard/*" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            
            {/* Ruta de demo del Design System */}
            <Route path="/design-system" element={<DesignSystemDemo />} />
            
            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
          </Routes>
        </BrowserRouter>
        </ThemeProvider>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
