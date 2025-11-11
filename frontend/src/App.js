import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import { Search, BookOpen, Calendar, Briefcase, MapPin, ExternalLink, User, Building, LogOut, Filter, UserCheck, Users, Newspaper, TrendingUp, Target, Lightbulb, Upload, Plus, FileText } from "lucide-react";
import Footer from "./components/Footer";
import JobApplicationForm from './components/JobApplicationForm';
import ChatButton from "./components/ChatButton";
import CreateEventButton from "./components/CreateEventButton";
import CreateJobButton from "./components/CreateJobButton";
import { useSystemSettings } from "./hooks/useSystemSettings";
import techHubLogo from './images/LOGO_TECH_HUB(1).png';
import facultadLogo from './images/logo_upe_infor(1).png';
import upeLogo from './images/LOGO_UPE(1).png';

// Import public pages
import PublicCourses from "./pages/PublicCourses";
import PublicEvents from "./pages/PublicEvents";
import PublicJobs from "./pages/PublicJobs";
import Scholarships from "./pages/Scholarships";
import Certifications from "./pages/Certifications";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import CareerAdvice from "./pages/CareerAdvice";
import News from "./pages/News";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AdminDashboard from "./pages/AdminDashboard";
import Maintenance from "./pages/Maintenance";

// Import auth pages
import StudentOnboarding from "./pages/StudentOnboarding";
import CompanyOnboarding from "./pages/CompanyOnboarding";

// Backend URL configuration from config.js
import { getBackendUrl } from './config';

const API = getBackendUrl(); // Remove /api from here since it's added in individual calls

import { useAuth } from "./hooks/useAuth";

// Import new auth pages
import LoginPage from "./pages/LoginPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import CompanyRegisterPage from "./pages/CompanyRegisterPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AuthCallback from "./pages/AuthCallback";
import ViewCandidates from "./pages/ViewCandidates";
import MyJobs from "./pages/MyJobs";
import MyApplications from "./pages/MyApplications";
import JobApplicationPage from "./pages/JobApplicationPage";
import UsersList from "./pages/UsersList";
import StudentProfile from "./pages/StudentProfile";
import CompanyProfile from "./pages/CompanyProfile";

// Auth & Landing Page
const AuthLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top logos bar */}
      <div className="bg-slate-800 border-b border-slate-700 th-header-top-fixed">
        <div className="max-w-7xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4">
          <div className="flex items-center justify-center">
            <img src={upeLogo} alt="Universidad Privada del Este" className="logo-img logo-left" />
          </div>
          <div className="flex items-center justify-center">
            <img src={techHubLogo} alt="TechHub UPE" className="logo-img logo-center" />
          </div>
          <div className="flex items-center justify-center">
            <img src={facultadLogo} alt="Facultad de Ciencias de la Informática" className="logo-img logo-right" />
          </div>
        </div>
      </div>
      {/* Secondary header keeps spacing/style consistent */}
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3 th-header">
        <div className="max-w-7xl mx-auto" />
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
                onClick={() => navigate('/registro-estudiante')}
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-3 flex items-center gap-2"
              >
                <UserCheck className="w-5 h-5" />
                Crear Cuenta Estudiante
              </Button>
              <Button
                onClick={() => navigate('/registro-empresa')}
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
                onClick={() => navigate('/login')}
                variant="ghost"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Iniciar Sesión
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
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState(null);
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
      setPreviewPicture(null);
      setNewProfilePicture(null);
    }
  }, [user]);

  if (!user) return <Navigate to="/" />;

  const handleSave = async () => {
    try {
      // First update profile data
      const response = await axios.put(`${API}/api/users/profile`, editData, { withCredentials: true });

      // If there's a new profile picture, upload it
      if (newProfilePicture) {
        const formData = new FormData();
        formData.append('picture', newProfilePicture);
        const pictureResponse = await axios.post(`${API}/api/users/picture`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setUser(pictureResponse.data.user);
      } else {
        setUser(response.data.user);
      }

      setIsEditing(false);
      setNewProfilePicture(null);
      setPreviewPicture(null);

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
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3 th-header">
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
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img
                    src={previewPicture || user.picture || 'https://via.placeholder.com/100?text=Sin+Foto'}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-2 border-cyan-500 object-cover"
                  />
                  {isEditing && (
                    <label
                      htmlFor="profile-picture-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                      <Upload className="w-6 h-6 text-white" />
                      <input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            // Validate file type
                            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                            if (!validTypes.includes(file.type)) {
                              toast({
                                title: "Tipo de archivo inválido",
                                description: "Solo se permiten imágenes (JPG, PNG, GIF, WEBP)",
                                variant: "destructive"
                              });
                              return;
                            }

                            // Validate file size (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              toast({
                                title: "Archivo muy grande",
                                description: "La imagen debe ser menor a 5MB",
                                variant: "destructive"
                              });
                              return;
                            }

                            // Store file for later upload
                            setNewProfilePicture(file);

                            // Create preview
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPreviewPicture(reader.result);
                            };
                            reader.readAsDataURL(file);

                            toast({
                              title: "Foto seleccionada",
                              description: "Haz clic en 'Guardar' para actualizar tu foto de perfil",
                            });
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <div>
                  <CardTitle className="text-white text-2xl">{user.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {user.email}
                  </CardDescription>
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1">
                      {previewPicture ? '✓ Nueva foto seleccionada - Haz clic en Guardar' : 'Haz clic en la foto para cambiarla'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setPreviewPicture(null);
                      setNewProfilePicture(null);
                      setEditData({
                        github_url: user.github_url || '',
                        linkedin_url: user.linkedin_url || '',
                        portfolio_url: user.portfolio_url || '',
                        bio: user.bio || '',
                        skills: user.skills || [],
                        company_name: user.company_name || '',
                        company_document: user.company_document || ''
                      });
                    }}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-slate-700"
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={isEditing ? "bg-green-500 hover:bg-green-600 text-white" : "bg-cyan-500 hover:bg-cyan-600 text-black"}
                >
                  {isEditing ? 'Guardar' : 'Editar'}
                </Button>
              </div>
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
const DashboardHeader = ({ user, logout }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSavedClick = () => {
    navigate('/saved');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showUserMenu]);

  return (
    <>
      {/* Top bar with logos */}
      <div className="bg-slate-800 border-b border-slate-700 th-header-top-fixed">
        <div className="max-w-7xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4">
          {/* Logo izquierdo - UPE */}
          <div className="flex items-center justify-center">
            <img src={upeLogo} alt="Universidad Privada del Este" className="logo-img logo-left" />
          </div>

          {/* Logo centro - TechHub */}
          <div className="flex items-center justify-center">
            <img src={techHubLogo} alt="TechHub UPE" className="logo-img logo-center" />
          </div>

          {/* Logo derecho - Facultad de Informática */}
          <div className="flex items-center justify-center">
            <img src={facultadLogo} alt="Facultad de Ciencias de la Informática" className="logo-img logo-right" />
          </div>
        </div>
      </div>

      {/* Navigation menu */}
  <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3 sticky top-0 z-50 th-header">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <nav className="flex-1">
            {/* Mobile: show hamburger to toggle nav; Desktop: always show centered nav */}
            <div className="flex items-center">
              {/* Hamburger for mobile */}
              <button
                aria-label="Toggle navigation"
                onClick={() => setMobileOpen(v => !v)}
                className="mr-3 md:hidden p-2 rounded bg-slate-800 border border-slate-700 text-gray-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              {/* horizontal nav: only visible on md+; on mobile we use the dropdown */}
              <div id="main-nav" className={`hidden md:flex w-full items-center justify-center gap-3 md:gap-6 overflow-x-auto`}>
              <Button
                key="inicio-btn"
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-gray-300 hover:text-cyan-400 px-3 md:px-4"
              >
                Inicio
              </Button>
              <Button
                key="cursos-btn"
                variant="ghost"
                onClick={() => navigate('/courses')}
                className="text-gray-300 hover:text-cyan-400 px-3 md:px-4"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="whitespace-nowrap">Cursos</span>
              </Button>
              <Button
                key="eventos-btn"
                variant="ghost"
                onClick={() => navigate('/events')}
                className="text-gray-300 hover:text-cyan-400 px-3 md:px-4"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span className="whitespace-nowrap">Eventos</span>
              </Button>
              <Button
                key="vacantes-btn"
                variant="ghost"
                onClick={() => navigate('/jobs')}
                className="text-gray-300 hover:text-cyan-400 px-3 md:px-4"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="whitespace-nowrap">Vacantes</span>
              </Button>
              <Button
                key="empresas-btn"
                variant="ghost"
                onClick={() => navigate('/companies')}
                className="text-gray-300 hover:text-cyan-400 px-3 md:px-4"
              >
                <Building className="w-4 h-4 mr-2" />
                <span className="whitespace-nowrap">Empresas</span>
              </Button>
            </div>

            {/* Mobile dropdown (absolute) */}
            {mobileOpen && (
              <div className="md:hidden absolute left-4 right-4 top-16 z-40 bg-slate-900 border border-slate-700 rounded-lg shadow-lg">
                <div className="flex flex-col p-2">
                  <button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} className="text-left px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white rounded">Inicio</button>
                  <button onClick={() => { navigate('/courses'); setMobileOpen(false); }} className="text-left px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white rounded"><BookOpen className="w-4 h-4 inline mr-2"/>Cursos</button>
                  <button onClick={() => { navigate('/events'); setMobileOpen(false); }} className="text-left px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white rounded"><Calendar className="w-4 h-4 inline mr-2"/>Eventos</button>
                  <button onClick={() => { navigate('/jobs'); setMobileOpen(false); }} className="text-left px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white rounded"><Briefcase className="w-4 h-4 inline mr-2"/>Vacantes</button>
                  <button onClick={() => { navigate('/companies'); setMobileOpen(false); }} className="text-left px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white rounded"><Building className="w-4 h-4 inline mr-2"/>Empresas</button>
                </div>
              </div>
            )}
          </div>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Avatar with dropdown menu (presentation-only) */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(prev => !prev)}
                aria-haspopup="true"
                aria-expanded={!!showUserMenu}
                className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 hover:bg-slate-700 focus:outline-none"
              >
                <img
                  src={user.picture || (user.email ? `https://www.gravatar.com/avatar/${encodeURIComponent(user.email)}?d=identicon` : 'https://via.placeholder.com/100?text=Sin+Foto')}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:inline text-white text-sm">Perfil</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded shadow-lg z-50">
                  <div className="p-3 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.picture || (user.email ? `https://www.gravatar.com/avatar/${encodeURIComponent(user.email)}?d=identicon` : 'https://via.placeholder.com/100?text=Sin+Foto')}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-white text-sm line-clamp-1">{user.name}</div>
                        <div className="text-gray-400 text-xs">{user.role === 'empresa' ? 'Empresa' : 'Estudiante'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col p-2">
                    <button onClick={handleProfileClick} className="text-left px-3 py-2 text-gray-200 hover:bg-slate-700 rounded">Mi Perfil</button>
                    <button onClick={handleSavedClick} className="text-left px-3 py-2 text-gray-200 hover:bg-slate-700 rounded">Guardados</button>
                    <button onClick={() => {
                      setShowUserMenu(false);
                      if (logout && typeof logout === 'function') {
                        logout();
                      } else {
                        console.error('Logout function is not available');
                      }
                    }} className="text-left px-3 py-2 text-red-400 hover:bg-slate-700 rounded">Salir</button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Close dropdown when clicking outside */}
            {
              /* attach effect */
            }
          </div>
        </div>
      </header>
    </>
  );
};

// Dashboard Content Components
const DashboardHome = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    events: 0,
    jobs: 0,
    courses: 0,
    users: 0
  });
  
  // Company-specific stats
  const [companyStats, setCompanyStats] = useState({
    applications: 0,
    pendingApplications: 0,
    activeJobs: 0,
    totalJobs: 0
  });

  // Student-specific stats
  const [studentStats, setStudentStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    interviewApplications: 0,
    offers: 0
  });

    // News state
    const [news, setNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(true);  useEffect(() => {
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

  useEffect(() => {
    const fetchCompanyStats = async () => {
      if (user.role === 'empresa') {
        try {
          const token = localStorage.getItem('authToken');
          
          // Fetch company jobs
          const jobsResponse = await axios.get(`${API}/api/company/jobs`, {
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true
          });
          
          // Fetch company applications
          const applicationsResponse = await axios.get(`${API}/api/company/applications`, {
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true
          });

          const jobs = jobsResponse.data.jobs || [];
          const applications = applicationsResponse.data.applications || [];
          
          setCompanyStats({
            applications: applications.length,
            pendingApplications: applications.filter(app => app.status === 'nuevo').length,
            activeJobs: jobs.filter(job => job.is_active).length,
            totalJobs: jobs.length
          });
        } catch (error) {
          console.error('Error fetching company stats:', error);
        }
      }
    };

    const fetchStudentStats = async () => {
      if (user.role === 'estudiante') {
        try {
          const token = localStorage.getItem('authToken');
          
          // Fetch student applications
          const applicationsResponse = await axios.get(`${API}/api/student/applications`, {
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true
          });

          const applications = applicationsResponse.data.applications || [];
          
          setStudentStats({
            totalApplications: applications.length,
            pendingApplications: applications.filter(app => app.status === 'nuevo').length,
            interviewApplications: applications.filter(app => app.status === 'entrevista').length,
            offers: applications.filter(app => app.status === 'oferta').length
          });
        } catch (error) {
          console.error('Error fetching student stats:', error);
        }
      }
    };
    
    fetchCompanyStats();
    fetchStudentStats();
  }, [user.role]);

    useEffect(() => {
      const fetchNews = async () => {
        try {
          setNewsLoading(true);
          const response = await axios.get(`${API}/api/news`, {
            params: { limit: 3 }
          });
          if (response.data.success) {
            setNews(response.data.news || []);
          }
        } catch (error) {
          console.error('Error fetching news:', error);
          console.error('URL attempted:', `${API}/api/news`);
          console.error('Error details:', error.response?.data || error.message);
        } finally {
          setNewsLoading(false);
        }
      };

      fetchNews();
    }, []);  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="py-8 px-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            ¡Bienvenido de vuelta! {user.name}👋
          </h1>
          <p className="text-gray-300 mb-6">
            {user.role === 'empresa' ? 
              'Gestiona tus vacantes y encuentra el mejor talento para tu empresa.' :
              'Descubre nuevas oportunidades de aprendizaje y crecimiento profesional.'
            }
          </p>

          {/* Resource Cards - Fixed dimensions with real data */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card 
              className="bg-slate-800/50 border-slate-700 h-40 hover:bg-slate-800/70 transition-colors"
              onClick={(e) => {
                // Solo navegar si no se hizo click en el botón de empresa
                if (!e.target.closest('button')) {
                  navigate('/events');
                }
              }}
            >
              <CardContent className="p-4 text-center h-full flex flex-col justify-center cursor-pointer">
                <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm">Eventos</h3>
                <p className="text-gray-400 text-xs mb-3">{stats.events} eventos disponibles</p>
                {user.role === 'empresa' && (
                  <CreateEventButton
                    inline={true}
                    onEventCreated={() => {
                      // Refresh stats after creating event
                      const fetchStats = async () => {
                        try {
                          const response = await axios.get(`${API}/api/stats`, { withCredentials: true });
                          setStats(response.data);
                        } catch (error) {
                          console.error('Error fetching stats:', error);
                        }
                      };
                      fetchStats();
                    }}
                  />
                )}
              </CardContent>
            </Card>
            <Card 
              className="bg-slate-800/50 border-slate-700 h-40 hover:bg-slate-800/70 transition-colors"
              onClick={(e) => {
                // Solo navegar si no se hizo click en el botón de empresa
                if (!e.target.closest('button')) {
                  navigate('/jobs');
                }
              }}
            >
              <CardContent className="p-4 text-center h-full flex flex-col justify-center cursor-pointer">
                <Briefcase className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm">Oportunidades</h3>
                <p className="text-gray-400 text-xs mb-3">{stats.jobs} vacantes registradas</p>
                {user.role === 'empresa' && (
                  <CreateJobButton
                    inline={true}
                    onJobCreated={() => {
                      // Refresh stats after creating job
                      const fetchStats = async () => {
                        try {
                          const response = await axios.get(`${API}/api/stats`, { withCredentials: true });
                          setStats(response.data);
                        } catch (error) {
                          console.error('Error fetching stats:', error);
                        }
                      };
                      fetchStats();
                    }}
                  />
                )}
              </CardContent>
            </Card>
            <Card 
              className="bg-slate-800/50 border-slate-700 h-40 hover:bg-slate-800/70 transition-colors"
              onClick={(e) => {
                // Solo navegar si no se hizo click en el botón de empresa
                if (!e.target.closest('button')) {
                  navigate('/companies');
                }
              }}
            >
              <CardContent className="p-4 text-center h-full flex flex-col justify-center cursor-pointer">
                <Building className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm">Empresas</h3>
                <p className="text-gray-400 text-xs">Empresas colaboradoras</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Management Section - Only for companies */}
      {user.role === 'empresa' && (
        <section className="py-8 px-4 bg-gradient-to-r from-orange-900/20 to-yellow-900/20 rounded-xl border border-orange-500/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Building className="w-6 h-6 text-orange-400" />
              Gestión Empresarial
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all cursor-pointer" onClick={() => navigate('/candidates')}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-orange-400" />
                    Ver Candidatos
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Revisa las aplicaciones a tus vacantes laborales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">{companyStats.pendingApplications}</p>
                      <p className="text-xs text-gray-400">
                        {companyStats.pendingApplications === 1 ? 'Aplicación pendiente' : 'Aplicaciones pendientes'}
                      </p>
                      {companyStats.applications > companyStats.pendingApplications && (
                        <p className="text-xs text-cyan-400 mt-1">
                          {companyStats.applications} total
                        </p>
                      )}
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-black">
                      Ver Todas
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => navigate('/my-jobs')}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    Mis Vacantes
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Administra tus ofertas laborales publicadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">{companyStats.activeJobs}</p>
                      <p className="text-xs text-gray-400">
                        {companyStats.activeJobs === 1 ? 'Vacante activa' : 'Vacantes activas'}
                      </p>
                      {companyStats.totalJobs > companyStats.activeJobs && (
                        <p className="text-xs text-gray-500 mt-1">
                          {companyStats.totalJobs} total
                        </p>
                      )}
                    </div>
                    <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
                      Gestionar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all cursor-pointer" onClick={() => navigate('/profile')}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Building className="w-5 h-5 text-green-400" />
                    Perfil Empresarial
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Actualiza la información de tu empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">{user.company_name || 'Sin nombre'}</p>
                      <p className="text-xs text-gray-400">Perfil empresarial</p>
                    </div>
                    <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Student Progress Section - Only for students */}
      {user.role === 'estudiante' && (
        <section className="py-8 px-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-cyan-400" />
              Mi Progreso Profesional
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer" onClick={() => navigate('/my-applications')}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    Mis Aplicaciones
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Haz seguimiento de tus postulaciones laborales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">{studentStats.totalApplications}</p>
                      <p className="text-xs text-gray-400">
                        {studentStats.totalApplications === 1 ? 'Aplicación enviada' : 'Aplicaciones enviadas'}
                      </p>
                      {studentStats.offers > 0 && (
                        <p className="text-xs text-green-400 mt-1">
                          {studentStats.offers} {studentStats.offers === 1 ? 'oferta' : 'ofertas'}
                        </p>
                      )}
                    </div>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-black">
                      Ver Estado
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all cursor-pointer" onClick={() => navigate('/jobs')}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Briefcase className="w-5 h-5 text-green-400" />
                    Buscar Vacantes
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Encuentra nuevas oportunidades laborales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">Explorar trabajos</p>
                      <p className="text-xs text-gray-400">Nuevas oportunidades disponibles</p>
                      {studentStats.interviewApplications > 0 && (
                        <p className="text-xs text-purple-400 mt-1">
                          {studentStats.interviewApplications} {studentStats.interviewApplications === 1 ? 'entrevista' : 'entrevistas'} pendientes
                        </p>
                      )}
                    </div>
                    <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
                      Explorar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer" onClick={() => navigate('/profile')}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-purple-400" />
                    Mi Perfil
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Actualiza tu información y CV
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">Perfil profesional</p>
                      {studentStats.pendingApplications > 0 && (
                        <p className="text-xs text-yellow-400 mt-1">
                          {studentStats.pendingApplications} {studentStats.pendingApplications === 1 ? 'respuesta' : 'respuestas'} pendientes
                        </p>
                      )}
                    </div>
                    <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* News & Tips Section - Fixed dimensions */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="bg-slate-800 border-slate-700 h-96 hover:border-cyan-500/50 transition-all cursor-pointer" onClick={() => navigate('/news')}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Newspaper className="w-5 h-5 text-cyan-400" />
              Noticias Educativas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto" style={{ maxHeight: '280px' }}>
            {newsLoading ? (
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-600 rounded mb-2"></div>
                  <div className="h-3 bg-slate-600 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-slate-600 rounded w-1/2"></div>
                </div>
              </div>
            ) : news.length > 0 ? (
              news.map((newsItem) => (
                <div key={newsItem.id} className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <h4 className="text-white font-medium mb-1 text-sm line-clamp-2">{newsItem.title}</h4>
                  <p className="text-gray-400 text-xs line-clamp-2">{newsItem.excerpt}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(newsItem.published_at || newsItem.created_at).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <p className="text-gray-400 text-xs text-center">No hay noticias disponibles</p>
              </div>
            )}
            <Button 
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-xs"
              onClick={() => navigate('/news')}
            >
              Ver Todas las Noticias
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 h-96 hover:border-green-500/50 transition-all cursor-pointer" onClick={() => navigate('/career-advice')}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Tips de Crecimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto" style={{ maxHeight: '280px' }}>
            <div className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
              <h4 className="text-white font-medium mb-1 text-sm">Networking Digital</h4>
              <p className="text-gray-400 text-xs">Construye conexiones profesionales efectivas usando LinkedIn.</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
              <h4 className="text-white font-medium mb-1 text-sm">Portafolio Profesional</h4>
              <p className="text-gray-400 text-xs">Crea un portafolio que destaque tus mejores proyectos.</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
              <h4 className="text-white font-medium mb-1 text-sm">Entrevistas Remotas</h4>
              <p className="text-gray-400 text-xs">Domina las entrevistas virtuales con preparación.</p>
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-xs">
              Ver Más Consejos
            </Button>
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
            <div
              className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              onClick={() => navigate('/jobs')}
            >
              <h4 className="text-white font-medium mb-1 text-sm flex items-center justify-between">
                {user.role === 'empresa' ? 'Encuentra Talento' : 'Encuentra Oportunidades'}
                <ExternalLink className="w-3 h-3" />
              </h4>
              <p className="text-gray-400 text-xs">
                {user.role === 'empresa' ?
                  'Accede a candidatos calificados en constante crecimiento.' :
                  'Descubre vacantes que se ajusten a tu perfil profesional.'
                }
              </p>
            </div>
            <div
              className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              onClick={() => navigate('/certifications')}
            >
              <h4 className="text-white font-medium mb-1 text-sm flex items-center justify-between">
                Educación Continua
                <ExternalLink className="w-3 h-3" />
              </h4>
              <p className="text-gray-400 text-xs">Certificaciones y cursos de las mejores plataformas mundiales.</p>
            </div>
            <div
              className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              onClick={() => navigate('/events')}
            >
              <h4 className="text-white font-medium mb-1 text-sm flex items-center justify-between">
                Eventos Profesionales
                <ExternalLink className="w-3 h-3" />
              </h4>
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


// Saved Items Page
const SavedItemsPage = ({ user }) => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState({ courses: [], events: [], jobs: [] });
  const [loading, setLoading] = useState(true);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);
  const [userApplications, setUserApplications] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedItems();
    if (user && user.role === 'estudiante') {
      fetchUserApplications();
    }
  }, []);

  // Escuchar actualizaciones de aplicaciones
  useEffect(() => {
    const handleApplicationsUpdate = () => {
      console.log('🔄 SavedItems - Applications updated event received');
      if (user && user.role === 'estudiante') {
        fetchUserApplications();
      }
    };

    window.addEventListener('applicationsUpdated', handleApplicationsUpdate);
    
    return () => {
      window.removeEventListener('applicationsUpdated', handleApplicationsUpdate);
    };
  }, [user]);

  const fetchSavedItems = async () => {
    try {
      const response = await axios.get(`${API}/api/saved-items`, { withCredentials: true });
      const data = response.data || {};
      const savedArray = data.saved_items || [];
      const grouped = { courses: [], events: [], jobs: [] };
      if (Array.isArray(savedArray)) {
        savedArray.forEach(si => {
          if (si.item_type === 'course') {
            if (si.course) grouped.courses.push(si.course);
            else if (si.course_id) grouped.courses.push({ id: si.course_id });
          } else if (si.item_type === 'event') {
            if (si.event) grouped.events.push(si.event);
            else if (si.event_id) grouped.events.push({ id: si.event_id });
          } else if (si.item_type === 'job') {
            if (si.job_vacancy) grouped.jobs.push(si.job_vacancy);
            else if (si.job_vacancy_id) grouped.jobs.push({ id: si.job_vacancy_id });
          }
        });
      }
      setSavedItems(grouped);
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

  const fetchUserApplications = async () => {
    try {
      const response = await axios.get(`${API}/api/student/applications`, { 
        withCredentials: true 
      });
      setUserApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching user applications:', error);
      setUserApplications([]);
    }
  };

  const hasApplied = (jobId) => {
    const applied = userApplications.some(app => {
      // El campo correcto es job_vacancy_id según el schema
      const appJobId = String(app.job_vacancy_id);
      const currentJobId = String(jobId);
      return appJobId === currentJobId;
    });
    
    return applied;
  };

  const handleApply = (job) => {
    // Si el usuario no está autenticado, redirigir al login
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para aplicar a vacantes",
        variant: "destructive"
      });
      return;
    }

    // Si el usuario no es estudiante, no puede aplicar
    if (user.role !== 'estudiante') {
      toast({
        title: "Acceso restringido",
        description: "Solo los estudiantes pueden aplicar a vacantes",
        variant: "destructive"
      });
      return;
    }

    console.log('Job apply_type:', job.apply_type);

    // PRIORIDAD 1: Si es aplicación externa explícita, abrir URL externa
    if (job.apply_type === 'externo' && job.apply_url) {
      console.log('App.js opening external URL:', job.apply_url);
      window.open(job.apply_url, '_blank');
    }
    // PRIORIDAD 2: Por defecto, siempre usar formulario interno para estudiantes
    else {
      console.log('App.js using internal form. Navigating to:', `/apply/${job.id}`);
      navigate(`/apply/${job.id}`);
    }
  };

  const handleApplicationSent = () => {
    // Actualizar datos o mostrar notificación de éxito
    toast({
      title: "¡Aplicación enviada!",
      description: "La empresa podrá ver tu aplicación y contactarte",
    });
    
    // Refrescar aplicaciones del usuario
    if (user && user.role === 'estudiante') {
      fetchUserApplications();
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
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3 th-header">
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
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                            {job.job_type}
                          </Badge>
                          {user && user.role === 'estudiante' && hasApplied(job.id) && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                              Postulado
                            </Badge>
                          )}
                        </div>
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
                        className={`w-full text-xs ${
                          user && user.role === 'estudiante' && hasApplied(job.id)
                            ? "bg-green-600/50 hover:bg-green-600/70 text-green-200 cursor-default"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                        onClick={() => hasApplied(job.id) ? null : handleApply(job)}
                        disabled={user && user.role === 'estudiante' && hasApplied(job.id)}
                      >
                        {user && user.role === 'estudiante' && hasApplied(job.id) 
                          ? "Ya Aplicado" 
                          : "Aplicar"} 
                        {!hasApplied(job.id) && <ExternalLink className="w-3 h-3 ml-1" />}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Job Application Form */}
      <JobApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
        job={selectedJobForApplication}
        user={user}
        onApplicationSent={handleApplicationSent}
      />
    </div>
  );
};

// Dashboard Page (Protected)
const Dashboard = ({ user, logout }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader user={user} logout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardHome user={user} />
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const { user, loading, logout, updateUser } = useAuth();

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
              user ? (
                user.role === 'estudiante' || user.role === 'empresa' ?
                  <Navigate to="/dashboard" replace /> :
                user.role === 'admin' ?
                  <Navigate to="/admin" replace /> :
                  <AuthLandingPage />
              ) :
              <AuthLandingPage />
            }
          />
          <Route
            path="/onboarding-estudiante"
            element={user ? <StudentOnboarding /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/onboarding-empresa"
            element={user ? <CompanyOnboarding /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                user.role === 'estudiante' || user.role === 'empresa' ?
                  <Dashboard user={user} logout={logout} /> :
                  <Navigate to="/" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user && (user.role === 'estudiante' || user.role === 'empresa') ?
                <ProfilePage user={user} setUser={updateUser} /> :
                <Navigate to="/" replace />
            }
          />
          <Route
            path="/saved"
            element={
              user && (user.role === 'estudiante' || user.role === 'empresa') ?
                <SavedItemsPage user={user} /> :
                <Navigate to="/" replace />
            }
          />
          <Route
            path="/candidates"
            element={
              user && user.role === 'empresa' ?
                <ViewCandidates /> :
                <Navigate to="/" replace />
            }
          />
          <Route
            path="/my-jobs"
            element={
              user && user.role === 'empresa' ?
                <MyJobs /> :
                <Navigate to="/" replace />
            }
          />
          <Route
            path="/my-applications"
            element={
              user && user.role === 'estudiante' ?
                <MyApplications /> :
                <Navigate to="/" replace />
            }
          />
          <Route
            path="/apply/:jobId"
            element={
              user && user.role === 'estudiante' ?
                <JobApplicationPage /> :
                <Navigate to="/" replace />
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              user && user.role === 'admin' ?
                <AdminDashboard /> :
                <Navigate to="/" replace />
            }
          />

          {/* Users Management Routes */}
          <Route
            path="/users"
            element={
              user && user.role === 'admin' ?
                <UsersList /> :
                <Navigate to="/" replace />
            }
          />
          <Route
            path="/user/student/:id"
            element={
              user && user.role === 'admin' ?
                <StudentProfile /> :
                <Navigate to="/" replace />
            }
          />
          <Route
            path="/user/company/:id"
            element={
              user && user.role === 'admin' ?
                <CompanyProfile /> :
                <Navigate to="/" replace />
            }
          />

          {/* Auth Pages */}
          <Route path="/registro-estudiante" element={user ? <Navigate to="/dashboard" replace /> : <StudentRegisterPage />} />
          <Route path="/registro-empresa" element={user ? <Navigate to="/dashboard" replace /> : <CompanyRegisterPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Public Pages */}
          <Route path="/courses" element={<PublicCourses />} />
          <Route path="/events" element={<PublicEvents />} />
          <Route path="/jobs" element={<PublicJobs />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/career-advice" element={<CareerAdvice />} />
          <Route path="/news" element={<News />} />
          <Route path="/change-password" element={user ? <ChangePasswordPage /> : <Navigate to="/login" replace />} />
          <Route path="/support" element={<Support />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Maintenance Mode */}
          <Route path="/maintenance" element={<Maintenance />} />
        </Routes>
        <Footer />
        <Toaster />
        <ChatButton user={user} />
      </BrowserRouter>
    </div>
  );
}

export default App;