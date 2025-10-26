import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { UserCheck, Github, Linkedin, Globe, Plus, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' :
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    skills: [],
    bio: '',
    education: '',
    career: '',
    phone: ''
  });

  const [skillInput, setSkillInput] = useState('');

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

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear perfil de estudiante en el backend
      const response = await axios.put(
        `${BACKEND_URL}/api/users/profile`,
        {
          ...formData,
          role: 'estudiante'
        },
        { withCredentials: true }
      );

      toast({
        title: "¡Bienvenido!",
        description: "Tu perfil de estudiante ha sido creado exitosamente",
      });

      // Limpiar sessionStorage
      sessionStorage.removeItem('intended_role');

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating student profile:', error);
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
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3 fixed top-0 left-0 right-0 z-50">
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
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-black" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl mb-2">
              ¡Bienvenido, {clerkUser.firstName || clerkUser.fullName}!
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Completa tu perfil de estudiante para acceder a todas las oportunidades
            </CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Información Personal</CardTitle>
              <CardDescription className="text-gray-400">
                Cuéntanos un poco sobre ti
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Teléfono (opcional)</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="+595 981 123456"
                />
              </div>

              <div>
                <Label className="text-white">Carrera o área de estudio</Label>
                <Input
                  value={formData.career}
                  onChange={(e) => setFormData({...formData, career: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Ej: Ingeniería Informática, Diseño Gráfico, Marketing"
                />
              </div>

              <div>
                <Label className="text-white">Institución educativa (opcional)</Label>
                <Input
                  value={formData.education}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Ej: Universidad Politécnica y Empresarial"
                />
              </div>

              <div>
                <Label className="text-white">Biografía</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Cuéntanos sobre tus intereses, metas profesionales y qué te apasiona..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Habilidades */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Habilidades</CardTitle>
              <CardDescription className="text-gray-400">
                Agrega tus conocimientos y competencias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Agregar habilidad</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Ej: JavaScript, Python, Diseño UI/UX, Marketing Digital"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    className="bg-cyan-500 hover:bg-cyan-600 text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {formData.skills.length > 0 && (
                <div>
                  <Label className="text-white mb-2 block">Tus habilidades:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-cyan-500/20 text-cyan-400 px-3 py-1 flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-cyan-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Redes Sociales y Portfolio */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Presencia Digital (Opcional)</CardTitle>
              <CardDescription className="text-gray-400">
                Comparte tus perfiles profesionales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Label>
                <Input
                  value={formData.github_url}
                  onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://github.com/tu-usuario"
                />
              </div>

              <div>
                <Label className="text-white flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Label>
                <Input
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://linkedin.com/in/tu-usuario"
                />
              </div>

              <div>
                <Label className="text-white flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Portfolio / Sitio Web
                </Label>
                <Input
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://tu-portfolio.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-6 text-lg"
            >
              {loading ? 'Creando perfil...' : 'Completar Registro'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentOnboarding;
