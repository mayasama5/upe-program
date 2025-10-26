import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Building, MapPin, Users, Briefcase, Globe, Phone } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' :
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');

const CompanyOnboarding = () => {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    company_document: '', // RUC
    industry: '',
    company_size: '',
    website: '',
    phone: '',
    address: '',
    city: '',
    country: 'Paraguay',
    bio: '',
    benefits: '',
    linkedin_url: ''
  });

  useEffect(() => {
    // Verificar que sea un nuevo usuario sin rol
    checkUserStatus();
  }, [clerkUser]);

  const checkUserStatus = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true
      });

      // Si ya tiene rol, redirigir al dashboard
      if (response.data.user && response.data.user.role) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Usuario nuevo, continuar con onboarding');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.company_name || !formData.company_document) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa el nombre de la empresa y el RUC",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Crear perfil de empresa en el backend
      const response = await axios.put(
        `${BACKEND_URL}/api/users/profile`,
        {
          ...formData,
          role: 'empresa'
        },
        { withCredentials: true }
      );

      toast({
        title: "¡Bienvenido!",
        description: "Tu perfil empresarial ha sido creado exitosamente",
      });

      // Limpiar sessionStorage
      sessionStorage.removeItem('intended_role');

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating company profile:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al crear el perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!clerkUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      {/* Header */}
      <header className="bg-slate-900 border-b border-orange-500/20 px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">TH</span>
            </div>
            <h1 className="text-xl font-bold text-white">TechHub UPE</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto pt-24 pb-8">
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <Building className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl mb-2">
              ¡Bienvenido, {clerkUser.firstName || clerkUser.fullName}!
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Completa el perfil de tu empresa para empezar a publicar oportunidades
            </CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información de la Empresa */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Información de la Empresa</CardTitle>
              <CardDescription className="text-gray-400">
                Datos básicos de tu organización
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">
                    Nombre de la Empresa <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Ej: TechStart Paraguay"
                  />
                </div>

                <div>
                  <Label className="text-white">
                    RUC o Documento <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    required
                    value={formData.company_document}
                    onChange={(e) => setFormData({...formData, company_document: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Ej: 80012345-7"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Industria / Sector</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({...formData, industry: value})}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Selecciona un sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnologia">Tecnología</SelectItem>
                      <SelectItem value="educacion">Educación</SelectItem>
                      <SelectItem value="salud">Salud</SelectItem>
                      <SelectItem value="finanzas">Finanzas</SelectItem>
                      <SelectItem value="comercio">Comercio</SelectItem>
                      <SelectItem value="manufactura">Manufactura</SelectItem>
                      <SelectItem value="servicios">Servicios</SelectItem>
                      <SelectItem value="construccion">Construcción</SelectItem>
                      <SelectItem value="agricultura">Agricultura</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Tamaño de la Empresa</Label>
                  <Select
                    value={formData.company_size}
                    onValueChange={(value) => setFormData({...formData, company_size: value})}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Selecciona el tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 empleados</SelectItem>
                      <SelectItem value="11-50">11-50 empleados</SelectItem>
                      <SelectItem value="51-200">51-200 empleados</SelectItem>
                      <SelectItem value="201-500">201-500 empleados</SelectItem>
                      <SelectItem value="500+">Más de 500 empleados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Descripción de la Empresa</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Describe tu empresa, su misión, valores y qué la hace única..."
                  rows={4}
                />
              </div>

              <div>
                <Label className="text-white">Beneficios para Empleados (Opcional)</Label>
                <Textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Ej: Seguro médico, trabajo remoto, capacitaciones, bonos por desempeño..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Información de Contacto</CardTitle>
              <CardDescription className="text-gray-400">
                Cómo pueden contactarte los candidatos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="+595 21 123456"
                  />
                </div>

                <div>
                  <Label className="text-white flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Sitio Web
                  </Label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://www.tuempresa.com"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">LinkedIn de la Empresa (Opcional)</Label>
                <Input
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://linkedin.com/company/tu-empresa"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ubicación */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Ubicación
              </CardTitle>
              <CardDescription className="text-gray-400">
                Dirección física de la empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Dirección</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Ej: Av. Principal 123, Centro"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Ciudad</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Ej: Asunción, Ciudad del Este"
                  />
                </div>

                <div>
                  <Label className="text-white">País</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Paraguay"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-lg"
            >
              {loading ? 'Creando perfil...' : 'Completar Registro'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyOnboarding;
