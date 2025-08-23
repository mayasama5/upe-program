import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { Search, BookOpen, Calendar, Briefcase, MapPin, Clock, ExternalLink, User, Building, LogOut, Plus, Filter } from "lucide-react";

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

  const login = () => {
    const redirectUrl = encodeURIComponent(`${window.location.origin}/profile`);
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

  return { user, loading, login, logout };
};

// Header Component
const Header = ({ user, login, logout }) => {
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
          <a href="#nosotros" className="text-gray-300 hover:text-cyan-400 transition-colors">Nosotros</a>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-gray-300">¡Hola, {user.name}!</span>
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-300 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          ) : (
            <Button onClick={login} className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium">
              Iniciar Sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

// Home Page
const Home = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      const [coursesRes, eventsRes, jobsRes] = await Promise.all([
        axios.get(`${API}/courses?limit=6`),
        axios.get(`${API}/events?limit=4`),
        axios.get(`${API}/jobs?limit=6`)
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
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Tu carrera tech
            <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
              empieza aquí
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Descubre cursos gratuitos, eventos, becas y oportunidades laborales 
            en tecnología, todo reunido en un solo lugar para estudiantes de Paraguay y Latinoamérica.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <BookOpen className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Cursos Gratuitos</h3>
              <p className="text-gray-400">Accede a miles de cursos en español de programación, IA, datos y más</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <Calendar className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Eventos Tech</h3>
              <p className="text-gray-400">Capacitaciones, webinars y hackathons online y en Paraguay</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <Briefcase className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Oportunidades</h3>
              <p className="text-gray-400">Vacantes, becas y prácticas profesionales en tecnología</p>
            </div>
          </div>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-3">
                Crear Cuenta Estudiante
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3">
                Registrar Empresa
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Courses */}
      <section id="cursos" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Cursos Destacados</h2>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
              Ver todos <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Card key={course.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                      {course.category}
                    </Badge>
                    <Badge variant="outline" className="text-green-400 border-green-400/30">
                      Gratis
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                  <CardDescription className="text-gray-400">{course.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <Button 
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black"
                    onClick={() => window.open(course.url, '_blank')}
                  >
                    Ir al Curso <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section id="eventos" className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Próximos Eventos</h2>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
              Ver todos <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {events.map(event => (
              <Card key={event.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                      {event.category}
                    </Badge>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(event.event_date).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">{event.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {event.organizer} • {event.is_online ? 'Online' : event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <Button 
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    onClick={() => window.open(event.url, '_blank')}
                  >
                    Registrarse <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section id="vacantes" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Vacantes Recientes</h2>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
              Ver todas <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <Card key={job.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                      {job.job_type}
                    </Badge>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                      {job.modality}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {job.company_name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.city || job.country}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skills_stack.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    {job.apply_type === 'interno' ? 'Postularme' : 'Aplicar en Sitio'}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
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
                La plataforma tech para estudiantes de Paraguay y Latinoamérica.
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

// Profile Page
const Profile = ({ user }) => {
  if (!user) return <Navigate to="/" />;
  
  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Mi Perfil</CardTitle>
            <CardDescription className="text-gray-400">
              Gestiona tu información personal y profesional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white">Nombre</Label>
                <Input value={user.name} className="bg-slate-700 border-slate-600 text-white" readOnly />
              </div>
              <div>
                <Label className="text-white">Email</Label>
                <Input value={user.email} className="bg-slate-700 border-slate-600 text-white" readOnly />
              </div>
              <div>
                <Label className="text-white">Rol</Label>
                <Input value={user.role} className="bg-slate-700 border-slate-600 text-white" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main App
function App() {
  const { user, loading, login, logout } = useAuth();

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
        <Header user={user} login={login} logout={logout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;