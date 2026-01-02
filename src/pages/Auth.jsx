import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input, Button } from '../components/ui';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setIsLoading(true);

    try {
      const loggedUser = isLogin
        ? await login(formData.email, formData.password)
        : await register({
            email: formData.email,
            password: formData.password,
          });
      const destination = loggedUser?.role === 'platform_admin' ? '/admin' : '/dashboard';
      navigate(destination);
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-emerald-950 opacity-95" />
      <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.15),transparent_30%)]" />

      <div className="relative w-full max-w-6xl grid lg:grid-cols-[1.15fr_1fr] gap-8 items-stretch">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl backdrop-blur-xl flex flex-col gap-10">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <img src="/favicon.png" alt="Logo de MenuPro" className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-indigo-200">MenuPro</p>
              <h1 className="text-2xl font-semibold text-white leading-tight">Tu carta digital, siempre actualizada</h1>
              <p className="text-sm text-slate-200/80">Crea, edita y comparte el menú de tu restaurante en minutos. Sin reimprimir, sin depender de terceros.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[{
              title: 'QR siempre actualizado',
              desc: 'Actualiza platos y precios en tiempo real con códigos QR listos para compartir.',
            }, {
              title: 'Clientes felices',
              desc: 'Ofrece a tus clientes una experiencia moderna y sin contacto.',
            }, {
              title: 'Seguridad reforzada',
              desc: 'Sesiones protegidas y controles de acceso para tu equipo.',
            }, {
              title: 'Personaliza con tu marca',
              desc: 'Adapta el diseño del menú digital a la identidad de tu restaurante.',
            }].map((item) => (
              <div key={item.title} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold text-base">{item.title}</h3>
                <p className="text-sm text-slate-200/70 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-emerald-50" />
          <div className="relative p-10">
            <div className="text-left mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-[0.2em]">
                <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500" /> Acceso MenuPro
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {isLogin ? 'Bienvenido de nuevo' : 'Crea tu acceso'}
              </h2>
              <p className="text-slate-600 mt-2">
                {isLogin ? 'Ingresa con tus credenciales' : 'Completa los datos para comenzar'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
                icon="📧"
                forceLight
              />

              <Input
                label="Contraseña"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                icon="🔒"
                helperText={!isLogin ? "Mínimo 6 caracteres" : ""}
                forceLight
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Crear cuenta')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-slate-600 hover:text-slate-800">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
