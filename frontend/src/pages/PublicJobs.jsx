import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import Header from '../components/Header';
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
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [savedItems, setSavedItems] = useState({ jobs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedItems();
    }
  }, [user]);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.modality === selectedFilter));
    }
  }, [jobs, selectedFilter]);

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

  const isSaved = (itemId) => {
    return savedItems?.jobs?.some(item => item.id === itemId) || false;
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Todas las Vacantes ({filteredJobs.length})
              </h2>
              <div className="flex items-center gap-3">
                {user && user.role === 'empresa' && (
                  <CreateJobButton inline={true} onJobCreated={fetchJobs} />
                )}
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
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map(job => (
                <Card key={job.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all h-80 flex flex-col">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                        {job.job_type}
                      </Badge>
                      {user && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => isSaved(job.id) ? handleUnsaveItem(job.id) : handleSaveItem(job.id, 'job')}
                          className={isSaved(job.id) ? "text-yellow-400 hover:text-yellow-300 p-1" : "text-gray-400 hover:text-yellow-400 p-1"}
                        >
                          {isSaved(job.id) ? '★' : '☆'}
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-white text-sm leading-tight line-clamp-2 h-10">{job.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-xs">
                      {job.company_name} • {job.city}, {job.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col justify-between flex-grow">
                    <p className="text-gray-300 text-xs mb-4 line-clamp-3 flex-grow">{job.description}</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 text-xs">{job.modality}</Badge>
                        <span className="text-cyan-400 font-semibold text-xs">{job.salary_range}</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs"
                        onClick={() => job.apply_type === 'externo' ? window.open(job.apply_url, '_blank') : alert('Aplicar internamente')}
                      >
                        Aplicar <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}