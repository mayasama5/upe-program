import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import { Search, BookOpen, Calendar, Briefcase, MapPin, Clock, ExternalLink, User, Building, LogOut, Plus, Filter, UserCheck, Users } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Hook
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for session ID in URL fragment
    const hash = window.location.hash;
    const sessionMatch = hash.match(/session_id=([^&]+)/);
    
    if (sessionMatch) {
      const sessionId = sessionMatch[1];
      handleAuthComplete(sessionId);
      // Clean up URL
      window.location.hash = '';
    } else {
      checkCurrentUser();
    }
  }, []);

  const handleAuthComplete = async (sessionId) => {
    try {
      const response = await axios.post(`${API}/auth/complete`, {}, {
        headers: { 'X-Session-ID': sessionId },
        withCredentials: true
      });
      setUser(response.data.user);
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });
    } catch (error) {
      console.error('Auth completion failed:', error);
      toast({
        title: "Error",
        description: "Error al completar la autenticación",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const checkCurrentUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      // Not logged in
    }
    setLoading(false);
  };

  const startGoogleAuth = () => {
    const redirectUrl = encodeURIComponent(`${window.location.origin}/onboarding`);
    window.location.href = `https://auth.emergentagent.com/?redirect=${redirectUrl}`;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, startGoogleAuth, logout, setUser };
};

// Auth & Landing Page
const AuthLandingPage = ({ startGoogleAuth }) => {
  const [authMode, setAuthMode] = useState(null); // null, 'student', 'company'
  
  const handleAuthAction = (mode) => {
    setAuthMode(mode);
    startGoogleAuth();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">TH</span>
            </div>
            <h1 className="text-xl font-bold text-white">TechHub UPE</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Tu carrera profesional
            <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
              empieza aquí
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            La plataforma educativa y laboral más completa para estudiantes de Paraguay y Latinoamérica. 
            Descubre cursos gratuitos, eventos, becas y oportunidades laborales en todas las carreras profesionales.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <BookOpen className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Cursos Gratuitos</h3>
              <p className="text-gray-400 text-sm">Miles de cursos en español: tech, administración, marketing, diseño y más</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <Calendar className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Eventos</h3>
              <p className="text-gray-400 text-sm">Capacitaciones, webinars y conferencias online y en Paraguay</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <Briefcase className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Oportunidades</h3>
              <p className="text-gray-400 text-sm">Vacantes, becas y prácticas en todas las áreas profesionales</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <Users className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Networking</h3>
              <p className="text-gray-400 text-sm">Conecta con empresas y profesionales de tu área</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleAuthAction('student')}
                size="lg" 
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-3 flex items-center gap-2"
              >
                <UserCheck className="w-5 h-5" />
                Crear Cuenta Estudiante
              </Button>
              <Button 
                onClick={() => handleAuthAction('company')}
                size="lg" 
                variant="outline" 
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 flex items-center gap-2"
              >
                <Building className="w-5 h-5" />
                Registrar Empresa
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 mb-3">¿Ya tienes cuenta?</p>
              <Button 
                onClick={startGoogleAuth}
                variant="ghost" 
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Iniciar Sesión con Google
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">¿Por qué elegir TechHub UPE?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Todo en un lugar</h3>
              <p className="text-gray-400">Cursos, eventos, becas y vacantes de las mejores fuentes educativas y empresas, reunidos en una sola plataforma.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enfoque Regional</h3>
              <p className="text-gray-400">Contenido específico para Paraguay y Latinoamérica, con oportunidades locales e internacionales.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Acceso Directo</h3>
              <p className="text-gray-400">Links directos a las fuentes oficiales para una experiencia de aprendizaje auténtica y confiable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">TH</span>
                </div>
                <span className="text-white font-bold">TechHub UPE</span>
              </div>
              <p className="text-gray-400 text-sm">
                La plataforma educativa y laboral para estudiantes de Paraguay y Latinoamérica.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">Cursos</a></li>
                <li><a href="#" className="hover:text-cyan-400">Eventos</a></li>
                <li><a href="#" className="hover:text-cyan-400">Becas</a></li>
                <li><a href="#" className="hover:text-cyan-400">Certificaciones</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Empleo</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">Vacantes</a></li>
                <li><a href="#" className="hover:text-cyan-400">Empresas</a></li>
                <li><a href="#" className="hover:text-cyan-400">Consejos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">Soporte</a></li>
                <li><a href="#" className="hover:text-cyan-400">Términos</a></li>
                <li><a href="#" className="hover:text-cyan-400">Privacidad</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 TechHub UPE. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Onboarding Page
const OnboardingPage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    role: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    skills: [],
    bio: '',
    company_name: '',
    company_document: ''
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    // Check for session ID in URL fragment (from auth redirect)
    const hash = window.location.hash;
    const sessionMatch = hash.match(/session_id=([^&]+)/);
    
    if (sessionMatch && !user) {
      const sessionId = sessionMatch[1];
      handleAuthComplete(sessionId);
      window.location.hash = '';
    }
  }, [user]);

  const handleAuthComplete = async (sessionId) => {
    try {
      const response = await axios.post(`${API}/auth/complete`, {}, {
        headers: { 'X-Session-ID': sessionId },
        withCredentials: true
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth completion failed:', error);
      navigate('/');
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
    
    if (!formData.role) {
      toast({
        title: "Error",
        description: "Por favor selecciona tu tipo de cuenta",
        variant: "destructive"
      });
      return;
    }

    if (formData.role === 'empresa' && (!formData.company_name || !formData.company_document)) {
      toast({
        title: "Error", 
        description: "Por favor completa la información de la empresa",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await axios.put(`${API}/users/profile`, formData, { 
        withCredentials: true 
      });
      
      setUser(response.data);
      toast({
        title: "¡Perfil completado!",
        description: "Tu cuenta ha sido configurada exitosamente",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el perfil",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">¡Bienvenido a TechHub UPE!</CardTitle>
            <CardDescription className="text-gray-400">
              Completa tu perfil para acceder a todas las funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-white">Tipo de cuenta *</Label>
                <Select onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecciona tu tipo de cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estudiante">Estudiante</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'empresa' && (
                <>
                  <div>
                    <Label className="text-white">Nombre de la empresa *</Label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Ej: TechStart Paraguay"
                    />
                  </div>
                  <div>
                    <Label className="text-white">RUC o documento empresarial *</Label>
                    <Input
                      value={formData.company_document}
                      onChange={(e) => setFormData({...formData, company_document: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Ej: 80012345-7"
                    />
                  </div>
                </>
              )}

              {formData.role === 'estudiante' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">GitHub URL</Label>
                      <Input
                        value={formData.github_url}
                        onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="https://github.com/usuario"
                      />
                    </div>
                    <div>
                      <Label className="text-white">LinkedIn URL</Label>
                      <Input
                        value={formData.linkedin_url}
                        onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="https://linkedin.com/in/usuario"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Portfolio URL</Label>
                    <Input
                      value={formData.portfolio_url}
                      onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="https://miportfolio.com"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Habilidades</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Agregar habilidad"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill} className="bg-cyan-500 hover:bg-cyan-600 text-black">
                        Agregar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                          {skill}
                          <button 
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-cyan-400 hover:text-cyan-300"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label className="text-white">Biografía</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder={formData.role === 'empresa' ? 
                    "Describe tu empresa y qué tipo de talento buscas..." : 
                    "Cuéntanos sobre ti, tus intereses y objetivos profesionales..."
                  }
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                Completar Perfil
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Header Component for Dashboard
const DashboardHeader = ({ user, logout }) => {
  return (
    <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">TH</span>
          </div>
          <h1 className="text-xl font-bold text-white">TechHub UPE</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#cursos" className="text-gray-300 hover:text-cyan-400 transition-colors">Cursos</a>
          <a href="#eventos" className="text-gray-300 hover:text-cyan-400 transition-colors">Eventos</a>
          <a href="#vacantes" className="text-gray-300 hover:text-cyan-400 transition-colors">Vacantes</a>
          <a href="#perfil" className="text-gray-300 hover:text-cyan-400 transition-colors">Mi Perfil</a>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <span className="text-gray-300">¡Hola, {user.name}!</span>
            <Badge variant="outline" className={user.role === 'empresa' ? 'text-orange-400 border-orange-400/30' : 'text-cyan-400 border-cyan-400/30'}>
              {user.role === 'empresa' ? 'Empresa' : 'Estudiante'}
            </Badge>
            <Button variant="ghost" size="sm" onClick={logout} className="text-gray-300 hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Dashboard Page (Protected)
const Dashboard = ({ user, logout }) => {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [coursesRes, eventsRes, jobsRes] = await Promise.all([
        axios.get(`${API}/courses?limit=12`),
        axios.get(`${API}/events?limit=8`),
        axios.get(`${API}/jobs?limit=12`)
      ]);
      
      setCourses(coursesRes.data);
      setEvents(eventsRes.data);
      setJobs(jobsRes.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader user={user} logout={logout} />
      
      {/* Welcome Section */}
      <section className="py-8 px-4 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            ¡Bienvenido de vuelta, {user.name}! 👋
          </h1>
          <p className="text-gray-300">
            {user.role === 'empresa' ? 
              'Gestiona tus vacantes y encuentra el mejor talento para tu empresa.' :
              'Descubre nuevas oportunidades de aprendizaje y crecimiento profesional.'
            }
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Featured Courses */}
        <section id="cursos">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Cursos Destacados</h2>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
              Ver todos <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map(course => (
              <Card key={course.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                      {course.category}
                    </Badge>
                    <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
                      Gratis
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-base leading-tight">{course.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">{course.provider}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <Button 
                    size="sm"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black"
                    onClick={() => window.open(course.url, '_blank')}
                  >
                    Ir al Curso <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Events */}
        <section id="eventos" className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Próximos Eventos</h2>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
              Ver todos <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map(event => (
              <Card key={event.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                      {event.category}
                    </Badge>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(event.event_date).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  <CardTitle className="text-white text-base leading-tight">{event.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {event.organizer} • {event.is_online ? 'Online' : event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <Button 
                    size="sm"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    onClick={() => window.open(event.url, '_blank')}
                  >
                    Registrarse <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Jobs Section */}
        <section id="vacantes" className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {user.role === 'empresa' ? 'Gestionar Vacantes' : 'Oportunidades Laborales'}
            </h2>
            <div className="flex gap-2">
              {user.role === 'empresa' && (
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar Vacante
                </Button>
              )}
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                Ver todas <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <Card key={job.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                      {job.job_type}
                    </Badge>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 text-xs">
                      {job.modality}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-base leading-tight">{job.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {job.company_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {job.city || job.country}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skills_stack.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  {job.salary_range && (
                    <p className="text-cyan-400 text-sm font-medium mb-3">{job.salary_range}</p>
                  )}
                  <Button 
                    size="sm"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {job.apply_type === 'interno' ? 'Postularme' : 'Aplicar en Sitio'}
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const { user, loading, startGoogleAuth, logout, setUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" /> : 
              <AuthLandingPage startGoogleAuth={startGoogleAuth} />
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              user && (user.role === 'estudiante' || user.role === 'empresa') ? 
                <Navigate to="/dashboard" /> :
                <OnboardingPage user={user} setUser={setUser} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user && (user.role === 'estudiante' || user.role === 'empresa') ? 
                <Dashboard user={user} logout={logout} /> : 
                <Navigate to="/" />
            } 
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;