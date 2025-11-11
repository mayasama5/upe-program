import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ExternalLink, MessageCircle, MapPin, Building2, DollarSign, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import Header from '../components/Header';
import JobApplicationForm from '../components/JobApplicationForm';
import { useAuth } from '../hooks/useAuth';
import CreateJobButton from '../components/CreateJobButton';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' :
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');
const API = BACKEND_URL;

export default function PublicJobs() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [savedItems, setSavedItems] = useState({ jobs: [] });
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedItems();
      if (user.role === 'estudiante') {
        fetchUserApplications();
      }
    }
  }, [user]);

  // Refrescar aplicaciones cuando se monta el componente
  useEffect(() => {
    if (user && user.role === 'estudiante') {
      // Pequeño delay para asegurar que la página esté completamente cargada
      const timer = setTimeout(() => {
        fetchUserApplications();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Escuchar actualizaciones de aplicaciones
  useEffect(() => {
    const handleApplicationsUpdate = () => {
      if (user && user.role === 'estudiante') {
        fetchUserApplications();
      }
    };

    const handleWindowFocus = () => {
      if (user && user.role === 'estudiante') {
        fetchUserApplications();
      }
    };

    window.addEventListener('applicationsUpdated', handleApplicationsUpdate);
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      window.removeEventListener('applicationsUpdated', handleApplicationsUpdate);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [user]);

  useEffect(() => {
    let filtered = jobs;

    // Apply modality filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(job => job.modality === selectedFilter);
    }

    // Apply city filter
    if (selectedCity !== "all") {
      filtered = filtered.filter(job => {
        const jobCity = job.city || job.location || '';
        return jobCity.toLowerCase().includes(selectedCity.toLowerCase());
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, selectedFilter, selectedCity]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/api/jobs?limit=12`);
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Si falla el API, generar datos de ejemplo
      const mockJobs = generateMockJobs();
      setJobs(mockJobs);
    }
    setLoading(false);
  };

  const generateMockJobs = () => {
    const modalities = ["remoto", "presencial", "hibrido"];
    const jobTypes = ["Tiempo Completo", "Medio Tiempo", "Por Proyecto", "Pasantía"];
    const companies = [
      "Tech Solutions PY", "Digital Marketing Pro", "Design Studio", "FinTech Paraguay",
      "Innovate Labs", "Cloud Services SA", "Data Analytics Co", "Software Factory",
      "E-commerce Giant", "StartUp Hub", "Consulting Group", "AI Research Center"
    ];
    const cities = ["Asunción", "Ciudad del Este", "Encarnación", "San Lorenzo", "Luque", "Fernando de la Mora"];

    const titles = [
      "Desarrollador Full Stack Senior",
      "Especialista en Marketing Digital",
      "Diseñador UX/UI",
      "Analista de Datos",
      "Gerente de Proyectos TI",
      "Desarrollador Frontend React",
      "Community Manager",
      "Diseñador Gráfico Senior",
      "Data Scientist",
      "Product Manager",
      "Desarrollador Backend Node.js",
      "Analista SEO/SEM",
      "Ilustrador Digital",
      "Business Intelligence Analyst",
      "Scrum Master",
      "Desarrollador Mobile Flutter",
      "Content Marketing Manager",
      "Motion Designer",
      "Analista de Ciberseguridad",
      "DevOps Engineer",
      "Desarrollador Python",
      "Growth Marketing Specialist",
      "UI Designer",
      "Contador Senior",
      "Arquitecto de Software",
      "Programador Java",
      "Email Marketing Specialist",
      "Brand Designer",
      "Auditor Interno",
      "Cloud Architect",
      "Desarrollador PHP/Laravel",
      "Social Media Manager",
      "Web Designer",
      "Analista Financiero",
      "QA Tester Automation",
      "Desarrollador .NET",
      "Performance Marketing Manager",
      "Video Editor",
      "Analista de RRHH",
      "Machine Learning Engineer"
    ];

    const salaryRanges = [
      "Gs. 4.000.000 - 6.000.000",
      "Gs. 5.000.000 - 8.000.000",
      "Gs. 6.000.000 - 10.000.000",
      "Gs. 7.000.000 - 12.000.000",
      "Gs. 8.000.000 - 15.000.000",
      "Gs. 3.000.000 - 5.000.000",
      "A convenir"
    ];

    return titles.map((title, index) => ({
      id: index + 1,
      title: title,
      description: `Buscamos ${title.toLowerCase()} con experiencia comprobable. Excelente ambiente laboral, beneficios competitivos y oportunidades de crecimiento profesional.`,
      company_name: companies[index % companies.length],
      city: cities[index % cities.length],
      country: "Paraguay",
      modality: modalities[index % modalities.length],
      job_type: jobTypes[index % jobTypes.length],
      salary_range: salaryRanges[index % salaryRanges.length],
      apply_type: "externo",
      apply_url: `https://ejemplo.com/aplicar-${index + 1}`,
      created_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  const fetchSavedItems = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/api/saved-items`, { withCredentials: true });
      const data = response.data || {};
      const savedArray = data.saved_items || [];
      const grouped = { jobs: [] };
      if (Array.isArray(savedArray)) {
        savedArray.forEach(si => {
          if (si.item_type === 'job') {
            if (si.job_vacancy) grouped.jobs.push(si.job_vacancy);
            else if (si.job_vacancy_id) grouped.jobs.push({ id: si.job_vacancy_id });
          }
        });
      }
      setSavedItems(grouped);
    } catch (error) {
      console.error('Error fetching saved items:', error);
    }
  }, []);

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

  const handleSaveItem = useCallback(async (itemId, itemType) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar vacantes",
        variant: "destructive"
      });
      return;
    }

    try {
      await axios.post(`${API}/api/saved-items`, {
        item_id: String(itemId),
        item_type: itemType
      }, { withCredentials: true });
      await fetchSavedItems();
      toast({
        title: "Guardado",
        description: "Vacante guardada exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al guardar la vacante",
        variant: "destructive"
      });
    }
  }, [user, fetchSavedItems, toast]);

  const handleUnsaveItem = useCallback(async (itemId) => {
    try {
      await axios.delete(`${API}/api/saved-items/${itemId}`, { withCredentials: true });
      await fetchSavedItems();
      toast({
        title: "Eliminado",
        description: "Vacante eliminada de guardados",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al eliminar la vacante",
        variant: "destructive"
      });
    }
  }, [fetchSavedItems, toast]);

  const filters = [
    { value: "all", label: "Todas las vacantes" },
    { value: "remoto", label: "Remoto" },
    { value: "presencial", label: "Presencial" },
    { value: "hibrido", label: "Híbrido" }
  ];

  const cityFilters = [
    { value: "all", label: "Todas las ciudades" },
    { value: "Asunción", label: "Asunción" },
    { value: "San Lorenzo", label: "San Lorenzo" },
    { value: "Luque", label: "Luque" },
    { value: "Capiatá", label: "Capiatá" },
    { value: "Lambaré", label: "Lambaré" },
    { value: "Fernando de la Mora", label: "Fernando de la Mora" },
    { value: "Limpio", label: "Limpio" },
    { value: "Ñemby", label: "Ñemby" },
    { value: "Encarnación", label: "Encarnación" },
    { value: "Ciudad del Este", label: "Ciudad del Este" },
    { value: "Pedro Juan Caballero", label: "Pedro Juan Caballero" },
    { value: "Presidente Franco", label: "Presidente Franco" },
    { value: "Mariano Roque Alonso", label: "Mariano Roque Alonso" },
    { value: "Villa Elisa", label: "Villa Elisa" },
    { value: "Itauguá", label: "Itauguá" },
    { value: "Coronel Oviedo", label: "Coronel Oviedo" },
    { value: "Concepción", label: "Concepción" },
    { value: "Caaguazú", label: "Caaguazú" },
    { value: "Villarrica", label: "Villarrica" },
    { value: "Itá", label: "Itá" },
    { value: "Caacupé", label: "Caacupé" },
    { value: "Paraguarí", label: "Paraguarí" },
    { value: "Pilar", label: "Pilar" },
    { value: "Hernandarias", label: "Hernandarias" },
    { value: "Salto del Guairá", label: "Salto del Guairá" }
  ];

  const isSaved = (itemId) => {
    return savedItems?.jobs?.some(item => item.id === itemId) || false;
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

  // Función para validar si una vacante tiene URL externa válida
  const hasExternalUrl = (job) => {
    const url = job.external_url || job.apply_url;
    return job.apply_type === 'externo' && url && url.trim() !== '' && url !== 'undefined' && url !== 'null';
  };

  const handleOpenJobDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
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

    // PRIORIDAD 1: Si es aplicación externa explícita, abrir URL externa
    if (hasExternalUrl(job)) {
      window.open(job.external_url || job.apply_url, '_blank');
    }
    // PRIORIDAD 2: Por defecto, siempre usar formulario interno para estudiantes
    else {
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

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Briefcase className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Vacantes Laborales</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Oportunidades de empleo en Paraguay y Latinoamérica
          </p>
        </div>

        {!user ? (
          <div className="bg-slate-800 border border-orange-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Inicia sesión para ver todas las vacantes disponibles
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              Accede a más de 40 oportunidades laborales en diferentes áreas
            </p>
            <Link to="/">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-lg px-8 py-3">
                Iniciar Sesión / Crear Cuenta
              </Button>
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center text-gray-400 py-12">
            Cargando vacantes...
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Todas las Vacantes ({filteredJobs.length})
              </h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                {user && user.role === 'empresa' && (
                  <CreateJobButton inline={true} onJobCreated={fetchJobs} />
                )}
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityFilters.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {filters.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredJobs.map(job => (
                <Card key={job.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all flex flex-col h-full">
                  <CardHeader className="pb-3 flex-shrink-0 p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                          {job.job_type}
                        </Badge>
                        {hasExternalUrl(job) && (
                          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                            <ExternalLink className="w-2 h-2 mr-1" />
                            Externo
                          </Badge>
                        )}
                        {user && user.role === 'estudiante' && hasApplied(job.id) && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                            Postulado
                          </Badge>
                        )}
                      </div>
                      {user && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => isSaved(job.id) ? handleUnsaveItem(job.id) : handleSaveItem(job.id, 'job')}
                          className={isSaved(job.id) ? "text-yellow-400 hover:text-yellow-300 p-1 min-w-8" : "text-gray-400 hover:text-yellow-400 p-1 min-w-8"}
                        >
                          {isSaved(job.id) ? '★' : '☆'}
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-white text-sm sm:text-base leading-tight line-clamp-2 min-h-[2.5rem]">{job.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-xs sm:text-sm">
                      <span className="font-medium">{job.company}</span> • {job.city || job.location || 'Paraguay'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 sm:p-6 flex flex-col justify-between flex-grow">
                    <p className="text-gray-300 text-xs sm:text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">{job.description}</p>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 text-xs">{job.modality}</Badge>
                        <span className="text-cyan-400 font-semibold text-xs sm:text-sm whitespace-nowrap">{job.salary_range}</span>
                      </div>
                      {job.contact_whatsapp && (
                        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 rounded p-2">
                          <MessageCircle className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{job.contact_whatsapp}</span>
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs"
                          onClick={() => handleOpenJobDetails(job)}
                        >
                          Ver más
                        </Button>
                        {user && user.role === 'estudiante' && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            {/* Botón de aplicar interno (formulario) */}
                            <Button
                              size="sm"
                              className={`flex-1 text-xs ${
                                hasApplied(job.id) 
                                  ? "bg-green-600/50 hover:bg-green-600/70 text-green-200 cursor-default"
                                  : "bg-orange-500 hover:bg-orange-600 text-white"
                              }`}
                              onClick={() => hasApplied(job.id) ? null : navigate(`/apply/${job.id}`)}
                              disabled={hasApplied(job.id)}
                            >
                              {hasApplied(job.id) ? "Aplicado" : "Aplicar"}
                            </Button>
                            
                            {/* Botón de aplicar externo si está disponible */}
                            {hasExternalUrl(job) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-xs border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                                onClick={() => window.open(job.external_url || job.apply_url, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Aplicar Externamente
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Botón de WhatsApp si está disponible */}
                      {job.contact_whatsapp && user && user.role === 'estudiante' && (
                        <Button
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                          onClick={() => {
                            const message = encodeURIComponent(`Hola, estoy interesado en la vacante: ${job.title}`);
                            const whatsappUrl = `https://wa.me/${job.contact_whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Contactar por WhatsApp
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de detalles de la vacante */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-slate-700">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">{selectedJob.title}</DialogTitle>
                    <DialogDescription className="text-gray-400 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {selectedJob.company}
                    </DialogDescription>
                  </div>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                    {selectedJob.job_type}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Información general */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-300">{selectedJob.city || selectedJob.location || 'Paraguay'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                      {selectedJob.modality}
                    </Badge>
                  </div>
                  {selectedJob.salary_range && (
                    <div className="flex items-center gap-2 text-sm col-span-2">
                      <DollarSign className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-400 font-semibold">{selectedJob.salary_range}</span>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedJob.description}</p>
                </div>

                {/* Requisitos */}
                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Requisitos</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx} className="text-gray-300">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tecnologías/Habilidades */}
                {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tecnologías y Habilidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.responsibilities.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-cyan-400 border-cyan-400/30">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aplicación Externa */}
                {hasExternalUrl(selectedJob) && (
                  <div className="bg-slate-800 border border-cyan-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ExternalLink className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-semibold">Aplicación Externa Disponible</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Esta empresa también acepta aplicaciones através de su sitio web oficial.
                    </p>
                  </div>
                )}

                {/* Contacto WhatsApp */}
                {selectedJob.contact_whatsapp && (
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold">Contacto por WhatsApp</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Comunícate directamente al: <span className="text-white font-semibold">{selectedJob.contact_whatsapp}</span>
                    </p>
                  </div>
                )}

                {/* Botones de aplicar */}
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-700">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 border-slate-600 text-gray-300"
                    >
                      Cerrar
                    </Button>
                  </div>
                  
                  {user && user.role === 'estudiante' && (
                    <div className="flex flex-col gap-2">
                      {/* Botón de aplicar interno (formulario) */}
                      <Button
                        onClick={() => navigate(`/apply/${selectedJob.id}`)}
                        className={`w-full ${
                          hasApplied(selectedJob.id)
                            ? "bg-green-600/50 hover:bg-green-600/70 text-green-200 cursor-default"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                        disabled={hasApplied(selectedJob.id)}
                      >
                        {hasApplied(selectedJob.id) 
                          ? "Ya Aplicado por Formulario" 
                          : "Aplicar por Formulario Interno"}
                      </Button>
                      
                      {/* Botón de aplicar externo si está disponible */}
                      {hasExternalUrl(selectedJob) && (
                        <Button
                          onClick={() => window.open(selectedJob.external_url || selectedJob.apply_url, '_blank')}
                          variant="outline"
                          className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Aplicar en Sitio Web de la Empresa
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {/* Botón de WhatsApp si está disponible */}
                  {selectedJob.contact_whatsapp && user && user.role === 'estudiante' && (
                    <Button
                      onClick={() => {
                        const message = encodeURIComponent(`Hola, estoy interesado en la vacante: ${selectedJob.title}`);
                        const whatsappUrl = `https://wa.me/${selectedJob.contact_whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactar por WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
}