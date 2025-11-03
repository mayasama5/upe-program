import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, MapPin, Users, ExternalLink, Briefcase, Calendar, ArrowLeft, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' :
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');
const API = BACKEND_URL;

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, [id]);

  const loadCompanyData = async () => {
    try {
      // Primero intentar cargar la empresa real de la API
      const companyResponse = await axios.get(`${API}/api/companies`, {
        withCredentials: true
      });
      
      if (companyResponse.data && companyResponse.data.success && companyResponse.data.companies) {
        // Buscar la empresa específica por ID
        const realCompany = companyResponse.data.companies.find(c => c.id === id);
        
        if (realCompany) {
          
          // Formatear los datos de la empresa real
          const formattedCompany = {
            id: realCompany.id,
            name: realCompany.company_name || realCompany.name || 'Empresa sin nombre',
            industry: realCompany.industry || 'No especificado',
            location: realCompany.city || realCompany.country || realCompany.address || 'Ubicación no especificada',
            employees: realCompany.company_size || 'No especificado',
            description: realCompany.bio || 'Descripción no disponible',
            website: realCompany.website || '#',
            email: realCompany.email,
            phone: realCompany.phone,
            founded: new Date(realCompany.created_at).getFullYear().toString(),
            specialties: realCompany.industry ? [realCompany.industry] : ['No especificado'],
            mission: realCompany.bio || 'Misión no disponible',
            benefits: realCompany.benefits ? realCompany.benefits.split(',').map(b => b.trim()) : ['Beneficios no especificados']
          };
          
          setCompany(formattedCompany);
          
          // Intentar cargar trabajos reales de esta empresa
          try {
            const jobsResponse = await axios.get(`${API}/api/jobs?company_id=${id}`, {
              withCredentials: true
            });
            
            if (jobsResponse.data && jobsResponse.data.jobs) {
              // Formatear los trabajos para asegurar compatibilidad
              const formattedJobs = jobsResponse.data.jobs.map(job => ({
                id: job.id,
                title: job.title,
                department: job.category || 'No especificado',
                type: job.job_type || 'Tiempo completo',
                salary: job.salary_range || 'No especificado',
                posted: job.created_at,
                created_at: job.created_at,
                description: job.description,
                requirements: job.requirements || [],
                location: job.location || 'Ubicación no especificada',
                modality: job.modality || 'No especificado',
                company: job.company,
                is_active: job.is_active,
                apply_type: job.apply_type,
                external_url: job.external_url,
                contact_whatsapp: job.contact_whatsapp
              }));
              
              setJobs(formattedJobs);
            } else {
              setJobs([]);
            }
          } catch (jobError) {
            setJobs([]);
          }
          
          setLoading(false);
          return;
        }
      }
      
      // Si no se encuentra la empresa real, mostrar error
      navigate('/companies');
      
    } catch (error) {
      console.error('Error loading company data:', error);
      // Si falla la API, mostrar error
      setLoading(false);
      setCompany(null);
    }
  };

  const handleApplyToJob = (job) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'estudiante') {
      alert('Solo los estudiantes pueden aplicar a vacantes');
      return;
    }

    // Aquí se implementaría la lógica de aplicación
    navigate(`/apply/${job.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando información de la empresa...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Empresa no encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/companies')}
            className="text-cyan-400 hover:text-cyan-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Empresas
          </Button>
        </div>

        {/* Company Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building className="w-12 h-12 text-white" />
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-white mb-2">{company.name}</h1>
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 mb-4">
                {company.industry}
              </Badge>
              <p className="text-gray-300 mb-4">{company.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300">{company.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">{company.employees} empleados</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Fundada en {company.founded}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {company.website}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="jobs" className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Vacantes ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Acerca de
            </TabsTrigger>
            <TabsTrigger value="benefits" className="text-white data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Beneficios
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            {jobs.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No hay vacantes disponibles en este momento</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {jobs.map(job => (
                  <Card key={job.id} className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            {job.department} • {job.type}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500/20 text-green-400 mb-2">
                            {job.salary}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            Publicado: {
                              job.created_at || job.posted 
                                ? new Date(job.created_at || job.posted).toLocaleDateString('es-ES')
                                : 'Fecha no disponible'
                            }
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{job.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-white font-medium mb-2">Requisitos:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req, index) => (
                              <Badge key={index} variant="secondary" className="bg-slate-700 text-gray-300 text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-3 h-3 text-cyan-400" />
                              <span className="text-gray-300">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Building className="w-3 h-3 text-purple-400" />
                              <span className="text-gray-300">{job.modality}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => handleApplyToJob(job)}
                      >
                        {user && user.role === 'estudiante' ? 'Aplicar a esta vacante' : 'Ver detalles'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Misión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{company.mission}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Especialidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {company.specialties?.map((specialty, index) => (
                      <Badge key={index} className="bg-cyan-500/20 text-cyan-400">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{company.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Teléfono</p>
                      <p className="text-white">{company.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Beneficios y Ventajas</CardTitle>
                <CardDescription className="text-gray-400">
                  Lo que ofrecemos a nuestros empleados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {company.benefits?.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}