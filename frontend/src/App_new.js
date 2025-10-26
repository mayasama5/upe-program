import React, { useState, useEffect, useCallback } from "react";
import Footer from "./components/Footer";
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
import { Search, BookOpen, Calendar, Briefcase, MapPin, Clock, ExternalLink, User, Building, LogOut, Plus, Filter, UserCheck, Users, Newspaper, TrendingUp, Target, Lightbulb, Upload } from "lucide-react";

// Backend URL configuration
// Priority: Environment variable > Development localhost > Production fallback
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');

console.log('🔗 Backend URL:', BACKEND_URL);
console.log('🌍 Environment:', process.env.NODE_ENV);
const API = BACKEND_URL; // Remove /api from here since it's added in individual calls


import { useClerkAuth } from './hooks/useClerkAuth';

const AuthLandingPage = ({ startGoogleAuth }) => {
  const handleAuthAction = (mode) => {
    console.log('Auth action clicked:', mode); // Debug log
    startGoogleAuth(mode);
  };

  return (
  <div className="min-h-screen bg-slate-950 flex flex-col">
  <Footer />
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
                onClick={() => handleAuthAction('estudiante')}
                size="lg" 
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-3 flex items-center gap-2"
              >
                <UserCheck className="w-5 h-5" />
                Crear Cuenta Estudiante
              </Button>
              <Button 
                onClick={() => handleAuthAction('empresa')}
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
                onClick={() => startGoogleAuth()}
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

    // Set the intended role if it was stored during auth initiation
    const intendedRole = sessionStorage.getItem('intended_role');
    console.log('Retrieved intended role from storage:', intendedRole); // Debug log
    if (intendedRole) {
      setFormData(prev => ({ ...prev, role: intendedRole }));
      // Don't clear immediately, keep for form submission
    }
  }, [user]);

  const handleAuthComplete = async (sessionId) => {
    try {
      const response = await axios.post(`${API}/api/auth/complete`, {}, {
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
      console.log('Submitting profile data:', formData); // Debug log
      const response = await axios.put(`${API}/api/users/profile`, formData, { 
        withCredentials: true 
      });
      
      console.log('Profile update response:', response.data); // Debug log
      setUser(response.data.user);
      
      // Clear the intended role from storage after successful submission
      sessionStorage.removeItem('intended_role');
      
      toast({
        title: "¡Perfil completado!",
        description: "Tu cuenta ha sido configurada exitosamente",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
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
    <div className="min-h-screen bg-slate-950 py-8 px-4 flex flex-col">
      <Footer />
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
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
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

// Profile Page with File Upload
const ProfilePage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    github_url: user?.github_url || '',
    linkedin_url: user?.linkedin_url || '',
    portfolio_url: user?.portfolio_url || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    company_name: user?.company_name || '',
    company_document: user?.company_document || ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [files, setFiles] = useState({
    cv: null,
    certificates: [],
    degrees: []
  });
  const { toast } = useToast();

  // Update editData when user prop changes
  useEffect(() => {
    if (user) {
      setEditData({
        github_url: user.github_url || '',
        linkedin_url: user.linkedin_url || '',
        portfolio_url: user.portfolio_url || '',
        bio: user.bio || '',
        skills: user.skills || [],
        company_name: user.company_name || '',
        company_document: user.company_document || ''
      });
    }
  }, [user]);

  if (!user) return <Navigate to="/" />;

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API}/api/users/profile`, editData, { withCredentials: true });
      setUser(response.data.user);
      setIsEditing(false);
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el perfil",
        variant: "destructive"
      });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !editData.skills.includes(skillInput.trim())) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleFileUpload = async (type, file) => {
    const formData = new FormData();
    
    // Use the correct field name based on the type
    if (type === 'cv') {
      formData.append('cv', file);
    } else if (type === 'certificate') {
      formData.append('certificate', file);
    } else if (type === 'degree') {
      formData.append('degree', file);
    } else if (type === 'company_document') {
      formData.append('company_document', file);
    }

    try {
      // Use the correct endpoint based on the type
      let endpoint;
      if (type === 'cv') {
        endpoint = `${API}/api/users/cv`;
      } else if (type === 'certificate') {
        endpoint = `${API}/api/users/certificates`;
      } else if (type === 'degree') {
        endpoint = `${API}/api/users/degrees`;
      } else if (type === 'company_document') {
        endpoint = `${API}/api/users/company-document`;
      }

      const response = await axios.post(endpoint, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast({
        title: "Archivo subido",
        description: `${type === 'cv' ? 'CV' : type === 'certificate' ? 'Certificado' : type === 'degree' ? 'Título' : 'Documento de empresa'} subido exitosamente`,
      });

      // Refresh user data to show uploaded file
      const userResponse = await axios.get(`${API}/api/auth/me`, { withCredentials: true });
      setUser(userResponse.data.user);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al subir el archivo",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = async (type, event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      // Upload file immediately
      await handleFileUpload(type, file);
      
      // Update local state for UI feedback
      if (type === 'cv') {
        setFiles(prev => ({ ...prev, cv: file }));
      } else if (type === 'certificate') {
        setFiles(prev => ({ 
          ...prev, 
          certificates: [...prev.certificates, file] 
        }));
      } else if (type === 'degree') {
        setFiles(prev => ({ 
          ...prev, 
          degrees: [...prev.degrees, file] 
        }));
      }
    } else {
      toast({
        title: "Archivo inválido",
        description: "Solo se permiten archivos PDF",
        variant: "destructive"
      });
    }
  };

  const removeFile = (type, index = null) => {
    if (type === 'cv') {
      setFiles(prev => ({ ...prev, cv: null }));
    } else if (type === 'certificate' && index !== null) {
      setFiles(prev => ({ 
        ...prev, 
        certificates: prev.certificates.filter((_, i) => i !== index)
      }));
    } else if (type === 'degree' && index !== null) {
      setFiles(prev => ({ 
        ...prev, 
        degrees: prev.degrees.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Footer />
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-cyan-400 hover:text-cyan-300">
            ← Volver al Dashboard
          </Button>
          <Badge variant="outline" className={user.role === 'empresa' ? 'text-orange-400 border-orange-400/30' : 'text-cyan-400 border-cyan-400/30'}>
            {user.role === 'empresa' ? 'Empresa' : 'Estudiante'}
          </Badge>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Basic Profile Info */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white text-2xl">Mi Perfil</CardTitle>
                <CardDescription className="text-gray-400">
                  Gestiona tu información personal y profesional
                </CardDescription>
              </div>
              <Button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={isEditing ? "bg-green-500 hover:bg-green-600 text-white" : "bg-cyan-500 hover:bg-cyan-600 text-black"}
              >
                {isEditing ? 'Guardar' : 'Editar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white">Nombre</Label>
                <Input value={user.name} className="bg-slate-700 border-slate-600 text-white" readOnly />
              </div>
              <div>
                <Label className="text-white">Email</Label>
                <Input value={user.email} className="bg-slate-700 border-slate-600 text-white" readOnly />
              </div>
            </div>

            {user.role === 'empresa' ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Nombre de la empresa</Label>
                  <Input 
                    value={isEditing ? editData.company_name : (user.company_name || '')}
                    onChange={(e) => setEditData(prev => ({...prev, company_name: e.target.value}))}
                    className="bg-slate-700 border-slate-600 text-white" 
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <Label className="text-white">RUC/Documento</Label>
                  <Input 
                    value={isEditing ? editData.company_document : (user.company_document || '')}
                    onChange={(e) => setEditData(prev => ({...prev, company_document: e.target.value}))}
                    className="bg-slate-700 border-slate-600 text-white" 
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-white">GitHub URL</Label>
                    <Input 
                      value={isEditing ? editData.github_url : (user.github_url || '')}
                      onChange={(e) => setEditData(prev => ({...prev, github_url: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white" 
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <Label className="text-white">LinkedIn URL</Label>
                    <Input 
                      value={isEditing ? editData.linkedin_url : (user.linkedin_url || '')}
                      onChange={(e) => setEditData(prev => ({...prev, linkedin_url: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white" 
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Portfolio URL</Label>
                    <Input 
                      value={isEditing ? editData.portfolio_url : (user.portfolio_url || '')}
                      onChange={(e) => setEditData(prev => ({...prev, portfolio_url: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white" 
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Habilidades</Label>
                  {isEditing ? (
                    <>
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
                        {editData.skills.map((skill, index) => (
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
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.skills?.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <Label className="text-white">Biografía</Label>
              <Textarea
                value={isEditing ? editData.bio : (user.bio || '')}
                onChange={(e) => setEditData(prev => ({...prev, bio: e.target.value}))}
                className="bg-slate-700 border-slate-600 text-white"
                rows={4}
                readOnly={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* File Upload Section - Only for students */}
        {user.role === 'estudiante' && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Documentos y Certificaciones</CardTitle>
              <CardDescription className="text-gray-400">
                Sube tu CV, certificados y títulos universitarios (solo archivos PDF)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CV Upload */}
              <div>
                <Label className="text-white mb-2 block">Curriculum Vitae (CV)</Label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4">
                  {user.cv_file_path ? (
                    <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm">CV subido</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {/* TODO: implement delete */}}
                        className="text-red-400 hover:text-red-300"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <label htmlFor="cv-upload" className="cursor-pointer">
                        <span className="text-cyan-400 hover:text-cyan-300">Haz clic para subir tu CV</span>
                        <p className="text-gray-400 text-sm mt-1">Solo archivos PDF</p>
                        <input 
                          id="cv-upload" 
                          type="file" 
                          accept=".pdf" 
                          onChange={(e) => handleFileChange('cv', e)}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificates Upload */}
              <div>
                <Label className="text-white mb-2 block">Certificaciones</Label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label htmlFor="cert-upload" className="cursor-pointer">
                      <span className="text-cyan-400 hover:text-cyan-300">Subir certificado</span>
                      <p className="text-gray-400 text-sm mt-1">Solo archivos PDF</p>
                      <input 
                        id="cert-upload" 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => handleFileChange('certificate', e)}
                        className="hidden" 
                      />
                    </label>
                  </div>
                  
                  {/* Show existing certificates from user data */}
                  {user.certificate_files && user.certificate_files.length > 0 && (
                    <div className="space-y-2">
                      {user.certificate_files.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-700 p-3 rounded">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-purple-400" />
                            <span className="text-white text-sm">{cert.filename}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {/* TODO: implement delete */}}
                            className="text-red-400 hover:text-red-300"
                          >
                            Eliminar
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Degrees Upload */}
              <div>
                <Label className="text-white mb-2 block">Títulos Universitarios</Label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label htmlFor="degree-upload" className="cursor-pointer">
                      <span className="text-cyan-400 hover:text-cyan-300">Subir título</span>
                      <p className="text-gray-400 text-sm mt-1">Solo archivos PDF</p>
                      <input 
                        id="degree-upload" 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => handleFileChange('degree', e)}
                        className="hidden" 
                      />
                    </label>
                  </div>
                  
                  {/* Show existing degrees from user data */}
                  {user.degree_files && user.degree_files.length > 0 && (
                    <div className="space-y-2">
                      {user.degree_files.map((degree, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-700 p-3 rounded">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-orange-400" />
                            <span className="text-white text-sm">{degree.filename}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {/* TODO: implement delete */}}
                            className="text-red-400 hover:text-red-300"
                          >
                            Eliminar
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Header Component for Dashboard
const DashboardHeader = ({ user, logout, activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSavedClick = () => {
    navigate('/saved');
  };

  return (
    <>
      {/* Top bar with logos */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-gray-400 text-xs">Facultad</span>
            {/* Placeholder for faculty logo */}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">TH</span>
            </div>
            <h1 className="text-2xl font-bold text-white">TechHub UPE</h1>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-400 text-xs">Universidad</span>
            {/* Placeholder for university logo */}
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <nav className="hidden md:flex space-x-6">
            <Button 
              key="inicio-btn"
              variant={activeSection === 'inicio' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('inicio')}
              className={activeSection === 'inicio' ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:text-cyan-400'}
            >
              Inicio
            </Button>
            <Button 
              key="cursos-btn"
              variant={activeSection === 'cursos' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('cursos')}
              className={activeSection === 'cursos' ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:text-cyan-400'}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Cursos
            </Button>
            <Button 
              key="eventos-btn"
              variant={activeSection === 'eventos' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('eventos')}
              className={activeSection === 'eventos' ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:text-cyan-400'}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Eventos
            </Button>
            <Button 
              key="vacantes-btn"
              variant={activeSection === 'vacantes' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('vacantes')}
              className={activeSection === 'vacantes' ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:text-cyan-400'}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Vacantes
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className={user.role === 'empresa' ? 'text-orange-400 border-orange-400/30' : 'text-cyan-400 border-cyan-400/30'}>
                {user.role === 'empresa' ? 'Empresa' : 'Estudiante'}
              </Badge>
              <Button key="saved-btn" variant="ghost" size="sm" onClick={handleSavedClick} className="text-gray-300 hover:text-white">
                <User className="w-4 h-4 mr-2" />
                Guardados
              </Button>
              <Button key="profile-btn" variant="ghost" size="sm" onClick={handleProfileClick} className="text-gray-300 hover:text-white">
                <User className="w-4 h-4 mr-2" />
                Mi Perfil
              </Button>
              <Button key="logout-btn" variant="ghost" size="sm" onClick={logout} className="text-gray-300 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

// Dashboard Content Components
const DashboardHome = ({ user }) => {
  const [stats, setStats] = useState({
    events: 0,
    jobs: 0,
    courses: 0,
    users: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/api/stats`, { withCredentials: true });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="py-8 px-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            ¡Bienvenido de vuelta, {user.name}! 👋
          </h1>
          <p className="text-gray-300 mb-6">
            {user.role === 'empresa' ? 
              'Gestiona tus vacantes y encuentra el mejor talento para tu empresa.' :
              'Descubre nuevas oportunidades de aprendizaje y crecimiento profesional.'
            }
          </p>

          {/* Resource Cards - Fixed dimensions with real data */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700 h-32">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm">Eventos</h3>
                <p className="text-gray-400 text-xs">{stats.events} eventos disponibles</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 h-32">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <Briefcase className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm">Oportunidades</h3>
                <p className="text-gray-400 text-xs">{stats.jobs} vacantes registradas</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 h-32">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <BookOpen className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm">Recursos</h3>
                <p className="text-gray-400 text-xs">{stats.courses} cursos disponibles</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 h-32">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm">Comunidad</h3>
                <p className="text-gray-400 text-xs">{stats.users} usuarios registrados</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News & Tips Section - Fixed dimensions */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="bg-slate-800 border-slate-700 h-96">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Newspaper className="w-5 h-5 text-cyan-400" />
              Noticias Educativas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto" style={{ maxHeight: '280px' }}>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-1 text-sm">SNPP lanza nuevos cursos técnicos</h4>
              <p className="text-gray-400 text-xs">El Servicio Nacional de Promoción Profesional amplía su oferta educativa.</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-1 text-sm">Becas 100% Paraguay 2024</h4>
              <p className="text-gray-400 text-xs">Abierta convocatoria para 500 becas de estudio en universidades.</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-1 text-sm">UPE inaugura nuevo campus</h4>
              <p className="text-gray-400 text-xs">La Universidad expande sus instalaciones en Ciudad del Este.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 h-96">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Tips de Crecimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto" style={{ maxHeight: '280px' }}>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-1 text-sm">Networking Digital</h4>
              <p className="text-gray-400 text-xs">Construye conexiones profesionales efectivas usando LinkedIn.</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-1 text-sm">Portafolio Profesional</h4>
              <p className="text-gray-400 text-xs">Crea un portafolio que destaque tus mejores proyectos.</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-1 text-sm">Entrevistas Remotas</h4>
              <p className="text-gray-400 text-xs">Domina las entrevistas virtuales con preparación.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 h-96">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-blue-400" />
              Recursos TechHub
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto" style={{ maxHeight: '280px' }}>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-1 text-sm">
                {user.role === 'empresa' ? 'Encuentra Talento' : 'Encuentra Oportunidades'}
              </h4>
              <p className="text-gray-400 text-xs">
                {user.role === 'empresa' ? 
                  'Accede a candidatos calificados en constante crecimiento.' :
                  'Descubre vacantes que se ajusten a tu perfil profesional.'
                }
              </p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-1 text-sm">Educación Continua</h4>
              <p className="text-gray-400 text-xs">Cursos gratuitos de las mejores plataformas mundiales.</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-1 text-sm">Eventos Profesionales</h4>
              <p className="text-gray-400 text-xs">Conecta con la comunidad en eventos y conferencias.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Tips for Students */}
      {user.role === 'estudiante' && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Tips para Estudiar Efectivamente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Técnica Pomodoro</h4>
                    <p className="text-gray-400 text-xs">25 minutos de estudio intenso + 5 minutos de descanso</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Práctica Activa</h4>
                    <p className="text-gray-400 text-xs">Aplica lo aprendido en proyectos reales</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Comunidad de Estudio</h4>
                    <p className="text-gray-400 text-xs">Únete a grupos de estudio online</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Metas SMART</h4>
                    <p className="text-gray-400 text-xs">Específicas, Medibles, Alcanzables, Relevantes, Temporales</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Documentar Progreso</h4>
                    <p className="text-gray-400 text-xs">Mantén un diario de aprendizaje</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Descanso Adecuado</h4>
                    <p className="text-gray-400 text-xs">7-8 horas de sueño para mejor retención</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Fixed dimensions for all content cards
const CoursesSection = ({ courses, savedItems, onSaveItem, onUnsaveItem }) => {
  const coursesArray = Array.isArray(courses) ? courses : [];
  const [filteredCourses, setFilteredCourses] = useState(coursesArray);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredCourses(coursesArray);
    } else {
      setFilteredCourses(coursesArray.filter(course => course.category === selectedCategory));
    }
  }, [coursesArray, selectedCategory]);

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "Tecnología", label: "Tecnología" },
    { value: "Marketing", label: "Marketing" },
    { value: "Diseño", label: "Diseño" },
    { value: "Administración", label: "Administración" },
    { value: "Recursos Humanos", label: "Recursos Humanos" },
    { value: "Contabilidad", label: "Contabilidad" },
    { value: "Idiomas", label: "Idiomas" },
    { value: "Gestión de Empresas", label: "Gestión de Empresas" }
  ];

  const isSaved = (itemId) => {
    return savedItems?.courses?.some(item => item.id === itemId) || false;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Todos los Cursos ({Array.isArray(filteredCourses) ? filteredCourses.length : 0})</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Fixed grid with uniform card dimensions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(filteredCourses) && filteredCourses.map(course => (
          <Card key={course.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all h-80 flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                  {course.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
                    Gratis
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => isSaved(course.id) ? onUnsaveItem(course.id, 'course') : onSaveItem(course.id, 'course', course)}
                    className={isSaved(course.id) ? "text-yellow-400 hover:text-yellow-300 p-1" : "text-gray-400 hover:text-yellow-400 p-1"}
                  >
                    {isSaved(course.id) ? '★' : '☆'}
                  </Button>
                </div>
              </div>
              <CardTitle className="text-white text-sm leading-tight line-clamp-2 h-10">{course.title}</CardTitle>
              <CardDescription className="text-gray-400 text-xs">{course.provider}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col justify-between flex-grow">
              <p className="text-gray-300 text-xs mb-4 line-clamp-3 flex-grow">{course.description}</p>
              <Button 
                size="sm"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black text-xs"
                onClick={() => window.open(course.url, '_blank')}
              >
                Ir al Curso <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EventsSection = ({ events, savedItems, onSaveItem, onUnsaveItem }) => {
  const eventsArray = Array.isArray(events) ? events : [];
  const [filteredEvents, setFilteredEvents] = useState(eventsArray);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredEvents(eventsArray);
    } else if (selectedFilter === "online") {
      setFilteredEvents(eventsArray.filter(event => event.is_online));
    } else if (selectedFilter === "presencial") {
      setFilteredEvents(eventsArray.filter(event => !event.is_online));
    } else if (selectedFilter === "paraguay") {
      setFilteredEvents(eventsArray.filter(event => !event.is_online && event.location.toLowerCase().includes('paraguay')));
    } else {
      setFilteredEvents(eventsArray.filter(event => event.category === selectedFilter));
    }
  }, [eventsArray, selectedFilter]);

  const filters = [
    { value: "all", label: "Todos los eventos" },
    { value: "online", label: "Solo Online" },
    { value: "presencial", label: "Solo Presencial" },
    { value: "paraguay", label: "En Paraguay" },
    { value: "Tecnología", label: "Tecnología" },
    { value: "Marketing", label: "Marketing" },
    { value: "Diseño", label: "Diseño" },
    { value: "Administración", label: "Administración" },
    { value: "Recursos Humanos", label: "Recursos Humanos" },
    { value: "Contabilidad", label: "Contabilidad" },
    { value: "Gestión de Empresas", label: "Gestión de Empresas" }
  ];

  const isSaved = (itemId) => {
    return savedItems?.events?.some(item => item.id === itemId) || false;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Todos los Eventos ({filteredEvents.length})</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
              <SelectValue placeholder="Filtrar eventos" />
            </SelectTrigger>
            <SelectContent>
              {filters.map(filter => (
                <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Fixed grid with uniform card dimensions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <Card key={event.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all h-80 flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                  {event.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-gray-400 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(event.event_date).toLocaleDateString('es-ES')}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => isSaved(event.id) ? onUnsaveItem(event.id, 'event') : onSaveItem(event.id, 'event', event)}
                    className={isSaved(event.id) ? "text-yellow-400 hover:text-yellow-300 p-1" : "text-gray-400 hover:text-yellow-400 p-1"}
                  >
                    {isSaved(event.id) ? '★' : '☆'}
                  </Button>
                </div>
              </div>
              <CardTitle className="text-white text-sm leading-tight line-clamp-2 h-10">{event.title}</CardTitle>
              <CardDescription className="text-gray-400 text-xs">
                {event.organizer} • {event.is_online ? 'Online' : event.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col justify-between flex-grow">
              <p className="text-gray-300 text-xs mb-4 line-clamp-3 flex-grow">{event.description}</p>
              <Button 
                size="sm"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs"
                onClick={() => window.open(event.url, '_blank')}
              >
                Registrarse <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const JobsSection = ({ jobs, user, savedItems, onSaveItem, onUnsaveItem }) => {
  const [showJobForm, setShowJobForm] = useState(false);
  const jobsArray = Array.isArray(jobs) ? jobs : [];
  const [filteredJobs, setFilteredJobs] = useState(jobsArray);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [userPostedJobs, setUserPostedJobs] = useState([]); // Jobs posted by companies
  const [loadingUserJobs, setLoadingUserJobs] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: [],
    modality: '',
    job_type: '',
    seniority_level: '',
    skills_stack: [],
    city: '',
    salary_range: '',
    apply_type: 'interno',
    apply_url: '',
    knockout_questions: []
  });
  const { toast } = useToast();

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredJobs(jobsArray);
    } else {
      setFilteredJobs(jobsArray.filter(job => job.modality === selectedFilter));
    }
  }, [jobsArray, selectedFilter]);

  // Load user-posted jobs (company feed)
  useEffect(() => {
    if (user) {
      fetchUserPostedJobs();
    }
  }, [user]);

  const fetchUserPostedJobs = async () => {
    setLoadingUserJobs(true);
    try {
      // Fetch all active jobs (for feed view)
      const response = await axios.get(`${API}/api/jobs`, { withCredentials: true });
      setUserPostedJobs(response.data.jobs || response.data);
    } catch (error) {
      console.error('Error fetching user jobs:', error);
    }
    setLoadingUserJobs(false);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!jobForm.title || !jobForm.description || !jobForm.modality) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      await axios.post(`${API}/api/jobs`, jobForm, { withCredentials: true });
      toast({
        title: "¡Vacante publicada!",
        description: "Tu vacante ha sido publicada exitosamente en el feed",
      });
      setShowJobForm(false);
      
      // Reset form
      setJobForm({
        title: '',
        description: '',
        requirements: [],
        modality: '',
        job_type: '',
        seniority_level: '',
        skills_stack: [],
        city: '',
        salary_range: '',
        apply_type: 'interno',
        apply_url: '',
        knockout_questions: []
      });
      
      // Refresh both feeds
      fetchUserPostedJobs();
      window.location.reload(); // Reload to get updated jobs from parent
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al publicar la vacante",
        variant: "destructive"
      });
    }
  };

  const addRequirement = (req) => {
    if (req.trim() && !jobForm.requirements.includes(req.trim())) {
      setJobForm(prev => ({
        ...prev,
        requirements: [...prev.requirements, req.trim()]
      }));
    }
  };

  const removeRequirement = (req) => {
    setJobForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== req)
    }));
  };

  const isSaved = (itemId) => {
    return savedItems?.jobs?.some(item => item.id === itemId) || false;
  };

  const filters = [
    { value: "all", label: "Todas las vacantes" },
    { value: "remoto", label: "Remoto" },
    { value: "presencial", label: "Presencial" },
    { value: "hibrido", label: "Híbrido" }
  ];

  return (
    <div className="space-y-8">
      {/* Header with filters and post button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Oportunidades Laborales
          </h2>
          <p className="text-gray-400 text-sm">
            {user?.role === 'empresa' ? 'Publica tus vacantes y encuentra talento' : 'Descubre oportunidades de empleo'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
              <SelectValue placeholder="Filtrar por modalidad" />
            </SelectTrigger>
            <SelectContent>
              {filters.map(filter => (
                <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {user?.role === 'empresa' && (
            <Button 
              onClick={() => setShowJobForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Publicar Vacante
            </Button>
          )}
        </div>
      </div>

      {/* Opportunities Cards Section (Top) - Static opportunities */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Oportunidades Destacadas</h3>
          <Badge className="bg-orange-500/20 text-orange-400 text-xs">Top</Badge>
        </div>
        
        {/* Horizontal scrolling cards */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 w-max">
            {filteredJobs.slice(0, 5).map(job => (
              <Card key={job.id} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 hover:border-orange-400 transition-all w-80 flex-shrink-0">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                      {job.job_type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => isSaved(job.id) ? onUnsaveItem(job.id, 'job') : onSaveItem(job.id, 'job', job)}
                      className="text-orange-400 hover:text-orange-300 p-1"
                    >
                      {isSaved(job.id) ? '★' : '☆'}
                    </Button>
                  </div>
                  <CardTitle className="text-white text-base leading-tight">{job.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-sm">
                    {job.company_name} • {job.city}, {job.country}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-semibold text-sm">{job.salary_range}</span>
                    <Button 
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => job.apply_type === 'externo' ? window.open(job.apply_url, '_blank') : alert('Aplicar internamente')}
                    >
                      Aplicar <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Company Feed Section (Bottom) */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Feed de Empresas</h3>
          <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">En vivo</Badge>
        </div>
        
        {loadingUserJobs ? (
          <div className="text-center text-gray-400 py-8">Cargando publicaciones...</div>
        ) : userPostedJobs.length > 0 ? (
          <div className="space-y-4">
            {userPostedJobs.map(job => (
              <Card key={job.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{job.company_name}</h4>
                        <p className="text-gray-400 text-sm">Publicó una nueva vacante • hace 2h</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => isSaved(job.id) ? onUnsaveItem(job.id, 'job') : onSaveItem(job.id, 'job', job)}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {isSaved(job.id) ? '★' : '☆'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">{job.modality}</Badge>
                      <Badge variant="outline" className="text-purple-400 border-purple-400/30">{job.job_type}</Badge>
                      <Badge variant="outline" className="text-green-400 border-green-400/30">{job.city}</Badge>
                    </div>
                    <p className="text-gray-300 mb-4">{job.description}</p>
                    
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-white font-semibold mb-2 text-sm">Requisitos:</h5>
                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                          {job.requirements.slice(0, 3).map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-semibold">{job.salary_range}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-500/10"
                        >
                          Más info
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-cyan-500 hover:bg-cyan-600 text-black"
                          onClick={() => job.apply_type === 'externo' ? window.open(job.apply_url, '_blank') : alert('Aplicar internamente')}
                        >
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">¡Sé el primero en publicar!</h3>
              <p className="text-gray-400 mb-4">
                {user?.role === 'empresa' ? 
                  'No hay publicaciones aún. Publica la primera vacante de tu empresa.' :
                  'Las empresas aún no han publicado vacantes. ¡Mantente atento!'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Job Creation Modal */}
      {showJobForm && user?.role === 'empresa' && (
        <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Publicar Nueva Vacante</DialogTitle>
              <DialogDescription className="text-gray-400">
                Comparte tu oportunidad laboral con nuestra comunidad
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Título del puesto *</Label>
                  <Input
                    value={jobForm.title}
                    onChange={(e) => setJobForm(prev => ({...prev, title: e.target.value}))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Ej: Desarrollador Frontend"
                  />
                </div>
                <div>
                  <Label className="text-white">Modalidad *</Label>
                  <Select value={jobForm.modality} onValueChange={(value) => setJobForm(prev => ({...prev, modality: value}))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Seleccionar modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label className="text-white">Descripción *</Label>
                <Textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm(prev => ({...prev, description: e.target.value}))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Describe el puesto, responsabilidades y lo que ofreces..."
                  rows={4}
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Tipo de trabajo</Label>
                  <Select value={jobForm.job_type} onValueChange={(value) => setJobForm(prev => ({...prev, job_type: value}))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="medio">Medio</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="pasantia">Pasantía</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Ciudad</Label>
                  <Input
                    value={jobForm.city}
                    onChange={(e) => setJobForm(prev => ({...prev, city: e.target.value}))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Ciudad del Este"
                  />
                </div>
                <div>
                  <Label className="text-white">Salario</Label>
                  <Input
                    value={jobForm.salary_range}
                    onChange={(e) => setJobForm(prev => ({...prev, salary_range: e.target.value}))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Gs. 5.000.000"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowJobForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Publicar Vacante
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Saved Items Page
const SavedItemsPage = ({ user }) => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState({ courses: [], events: [], jobs: [] });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      const response = await axios.get(`${API}/api/saved-items`, { withCredentials: true });
      setSavedItems(response.data.saved_items || response.data);
    } catch (error) {
      console.error('Error fetching saved items:', error);
    }
    setLoading(false);
  };

  const handleUnsaveItem = async (itemId, itemType) => {
    try {
      await axios.delete(`${API}/api/saved-items/${itemId}?item_type=${itemType}`, { withCredentials: true });
      await fetchSavedItems(); // Refresh the list
      toast({
        title: "Eliminado",
        description: "Item eliminado de guardados",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el item",
        variant: "destructive"
      });
    }
  };

  if (!user) return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando guardados...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Footer />
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-cyan-400 hover:text-cyan-300">
            ← Volver al Dashboard
          </Button>
          <Badge variant="outline" className={user.role === 'empresa' ? 'text-orange-400 border-orange-400/30' : 'text-cyan-400 border-cyan-400/30'}>
            {user.role === 'empresa' ? 'Empresa' : 'Estudiante'}
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Mis Guardados</h1>
        
        <Tabs defaultValue="cursos" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="cursos" className="text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Cursos ({savedItems.courses.length})
            </TabsTrigger>
            <TabsTrigger value="eventos" className="text-white data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Eventos ({savedItems.events.length})
            </TabsTrigger>
            <TabsTrigger value="vacantes" className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Vacantes ({savedItems.jobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cursos">
            {savedItems.courses.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No tienes cursos guardados aún</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedItems.courses.map(course => (
                  <Card key={course.id} className="bg-slate-800 border-slate-700 h-80 flex flex-col">
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                          {course.category}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUnsaveItem(course.id, 'course')}
                          className="text-yellow-400 hover:text-yellow-300 p-1"
                        >
                          ★
                        </Button>
                      </div>
                      <CardTitle className="text-white text-sm leading-tight line-clamp-2 h-10">{course.title}</CardTitle>
                      <CardDescription className="text-gray-400 text-xs">{course.provider}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 flex flex-col justify-between flex-grow">
                      <div className="flex-grow"></div>
                      <Button 
                        size="sm"
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black text-xs"
                        onClick={() => window.open(course.url, '_blank')}
                      >
                        Ir al Curso <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="eventos">
            {savedItems.events.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No tienes eventos guardados aún</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedItems.events.map(event => (
                  <Card key={event.id} className="bg-slate-800 border-slate-700 h-80 flex flex-col">
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                          {event.category}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUnsaveItem(event.id, 'event')}
                          className="text-yellow-400 hover:text-yellow-300 p-1"
                        >
                          ★
                        </Button>
                      </div>
                      <CardTitle className="text-white text-sm leading-tight line-clamp-2 h-10">{event.title}</CardTitle>
                      <CardDescription className="text-gray-400 text-xs">
                        {new Date(event.event_date).toLocaleDateString('es-ES')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 flex flex-col justify-between flex-grow">
                      <div className="flex-grow"></div>
                      <Button 
                        size="sm"
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs"
                        onClick={() => window.open(event.url, '_blank')}
                      >
                        Registrarse <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="vacantes">
            {savedItems.jobs.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No tienes vacantes guardadas aún</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedItems.jobs.map(job => (
                  <Card key={job.id} className="bg-slate-800 border-slate-700 h-80 flex flex-col">
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                          {job.job_type}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUnsaveItem(job.id, 'job')}
                          className="text-yellow-400 hover:text-yellow-300 p-1"
                        >
                          ★
                        </Button>
                      </div>
                      <CardTitle className="text-white text-sm leading-tight line-clamp-2 h-10">{job.title}</CardTitle>
                      <CardDescription className="text-gray-400 text-xs">{job.company_name}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 flex flex-col justify-between flex-grow">
                      <div className="flex-grow"></div>
                      <Button 
                        size="sm"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs"
                        onClick={() => window.open(job.apply_url, '_blank')}
                      >
                        Aplicar <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Dashboard Page (Protected)
const Dashboard = ({ user, logout }) => {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [savedItems, setSavedItems] = useState({ courses: [], events: [], jobs: [] });
  const [activeSection, setActiveSection] = useState('inicio');
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
    fetchSavedItems();
  }, []);

  const fetchContent = async () => {
    try {
      console.log('Fetching content from:', `${API}/api/courses`);
      const [coursesRes, eventsRes, jobsRes] = await Promise.all([
        axios.get(`${API}/api/courses?limit=20`),
        axios.get(`${API}/api/events?limit=12`),
        axios.get(`${API}/api/jobs?limit=12`)
      ]);
      
      console.log('Courses response:', coursesRes.data);
      console.log('Events response:', eventsRes.data);
      console.log('Jobs response:', jobsRes.data);
      
      setCourses(coursesRes.data.courses || []);
      setEvents(eventsRes.data.events || []);
      setJobs(jobsRes.data.jobs || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      console.error('API base URL:', API);
    }
  };

  const fetchSavedItems = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/api/saved-items`, { withCredentials: true });
      setSavedItems(response.data.saved_items || response.data);
    } catch (error) {
      console.error('Error fetching saved items:', error);
      // For development, set empty saved items if auth fails
      if (process.env.NODE_ENV === 'development') {
        setSavedItems({ courses: [], events: [], jobs: [] });
      }
    }
  }, []);

  const handleSaveItem = useCallback(async (itemId, itemType, itemData) => {
    try {
      await axios.post(`${API}/api/saved-items`, {
        item_id: itemId,
        item_type: itemType,
        item_data: itemData
      }, { withCredentials: true });
      await fetchSavedItems(); // Refresh saved items
      toast({
        title: "Guardado",
        description: "Item guardado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al guardar el item",
        variant: "destructive"
      });
    }
  }, [fetchSavedItems, toast]);

  const handleUnsaveItem = useCallback(async (itemId, itemType) => {
    try {
      await axios.delete(`${API}/api/saved-items/${itemId}`, { withCredentials: true });
      await fetchSavedItems(); // Refresh saved items
      toast({
        title: "Eliminado",
        description: "Item eliminado de guardados",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al eliminar el item",
        variant: "destructive"
      });
    }
  }, [fetchSavedItems, toast]);

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return <DashboardHome key="dashboard-home" user={user} />;
      case 'cursos':
        return (
          <CoursesSection 
            key="courses-section"
            courses={courses} 
            savedItems={savedItems}
            onSaveItem={handleSaveItem}
            onUnsaveItem={handleUnsaveItem}
          />
        );
      case 'eventos':
        return (
          <EventsSection 
            key="events-section"
            events={events} 
            savedItems={savedItems}
            onSaveItem={handleSaveItem}
            onUnsaveItem={handleUnsaveItem}
          />
        );
      case 'vacantes':
        return (
          <JobsSection 
            key="jobs-section"
            jobs={jobs} 
            user={user} 
            savedItems={savedItems}
            onSaveItem={handleSaveItem}
            onUnsaveItem={handleUnsaveItem}
          />
        );
      default:
        return <DashboardHome key="dashboard-home-default" user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <DashboardHeader user={user} logout={logout} activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        {renderContent()}
      </div>
      <Footer />
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
          <Route 
            path="/profile" 
            element={
              user && (user.role === 'estudiante' || user.role === 'empresa') ? 
                <ProfilePage user={user} setUser={setUser} /> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/saved" 
            element={
              user && (user.role === 'estudiante' || user.role === 'empresa') ? 
                <SavedItemsPage user={user} /> : 
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