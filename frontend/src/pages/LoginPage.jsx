import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, EyeOff, LogIn, UserCheck, Building } from 'lucide-react';
import techHubLogo from '../images/LOGO_TECH_HUB(1).png';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on user role
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else if (result.user.role === 'estudiante' || result.user.role === 'empresa') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <img src={techHubLogo} alt="TechHub UPE" className="logo-img logo-auth mx-auto mb-3 sm:mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">TechHub UPE</h1>
          <p className="text-sm sm:text-base text-gray-400">Inicia sesión en tu cuenta</p>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-200">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 text-sm sm:text-base h-10 sm:h-11"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-sm text-gray-200">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 pr-10 text-sm sm:text-base h-10 sm:h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 touch-manipulation"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold h-10 sm:h-11 text-sm sm:text-base touch-manipulation"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-gray-400">O continuar con</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={googleLoading}
                className="w-full mt-4 h-10 sm:h-11 bg-white hover:bg-gray-100 text-gray-900 border-gray-300 font-semibold flex items-center justify-center gap-2 transition-colors"
                onClick={async () => {
                  setGoogleLoading(true);
                  await loginWithGoogle();
                  // Google will redirect, so no need to setGoogleLoading(false)
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {googleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
              </Button>
            </div>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700">
              <p className="text-center text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                ¿No tienes una cuenta?
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/registro-estudiante">
                  <Button
                    variant="outline"
                    className="w-full h-10 sm:h-11 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 px-4 sm:px-8 py-3 flex items-center justify-center gap-2 shadow-sm transition-colors font-semibold"
                  >
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Registrarme como Estudiante</span>
                  </Button>
                </Link>
                <Link to="/registro-empresa">
                  <Button
                    variant="outline"
                    className="w-full h-10 sm:h-11 border-orange-500 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 px-4 sm:px-8 py-3 flex items-center justify-center gap-2 shadow-sm transition-colors font-semibold"
                  >
                    <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Registrar mi Empresa</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 text-center">
              <Link to="/" className="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm">
                Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
