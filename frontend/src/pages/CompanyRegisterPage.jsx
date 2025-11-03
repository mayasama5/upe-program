import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, EyeOff, Building, Briefcase } from 'lucide-react';
import techHubLogo from '../images/LOGO_TECH_HUB(1).png';

export default function CompanyRegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'empresa'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.companyName,
      email: formData.email,
      password: formData.password,
      role: 'empresa',
      contact_name: formData.contactName
    });

    if (result.success) {
      // Redirect to company onboarding
      navigate('/onboarding-empresa');
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
          <p className="text-sm sm:text-base text-gray-400">Registra tu empresa</p>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              Registro de Empresa
            </CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Completa los datos para registrar tu empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="companyName" className="text-sm text-gray-200">
                  Nombre de la Empresa
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Mi Empresa S.A."
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 text-sm sm:text-base h-10 sm:h-11"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="contactName" className="text-sm text-gray-200">
                  Nombre del Contacto
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 text-sm sm:text-base h-10 sm:h-11"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-200">
                  Correo Electrónico Corporativo
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={formData.email}
                  onChange={handleChange}
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
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
                <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm text-gray-200">
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 pr-10 text-sm sm:text-base h-10 sm:h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 touch-manipulation"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-300">
                    <p className="font-semibold mb-1 text-xs sm:text-sm">Beneficios para empresas:</p>
                    <ul className="text-xs text-gray-400 space-y-0.5 sm:space-y-1">
                      <li>• Publicar ofertas laborales</li>
                      <li>• Acceso a base de talento calificado</li>
                      <li>• Organizar eventos y capacitaciones</li>
                      <li>• Visibilidad en la plataforma</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-10 sm:h-11 text-sm sm:text-base touch-manipulation"
              >
                <Building className="w-4 h-4 mr-2" />
                {loading ? 'Creando cuenta...' : 'Registrar Empresa'}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700 text-center">
              <p className="text-gray-400 text-xs sm:text-sm mb-2">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
                  Iniciar sesión
                </Link>
              </p>
              <Link to="/" className="text-gray-500 hover:text-gray-400 text-xs">
                Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
