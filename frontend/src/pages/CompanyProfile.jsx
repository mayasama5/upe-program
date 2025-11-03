import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import axios from 'axios';
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Briefcase,
  FileText,
  Globe,
  Clock,
  ExternalLink,
  User
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      const [companyResponse, jobsResponse, applicationsResponse] = await Promise.all([
        axios.get(`${API}/api/admin/users/${id}`, { withCredentials: true }),
        axios.get(`${API}/api/admin/companies/${id}/jobs`, { withCredentials: true }),
        axios.get(`${API}/api/admin/companies/${id}/applications`, { withCredentials: true })
      ]);
      
      setCompany(companyResponse.data.user);
      setJobs(jobsResponse.data.jobs || []);
      setApplications(applicationsResponse.data.applications || []);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJobStatusBadge = (job) => {
    const now = new Date();
    const deadline = new Date(job.application_deadline);
    
    if (job.status === 'cerrado') {
      return <Badge className="bg-red-500/20 text-red-400">Cerrado</Badge>;
    } else if (deadline < now) {
      return <Badge className="bg-orange-500/20 text-orange-400">Vencido</Badge>;
    } else {
      return <Badge className="bg-green-500/20 text-green-400">Activo</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Cargando perfil de la empresa...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-xl mb-4">Empresa no encontrada</h2>
          <Button onClick={() => navigate('/users')} className="bg-cyan-600 hover:bg-cyan-700">
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Button 
            onClick={() => navigate('/users')} 
            variant="ghost" 
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la lista
          </Button>
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {company.company_name || 'Empresa sin nombre'}
              </h1>
              <div className="flex items-center gap-4 text-orange-100">
                <Badge className="bg-orange-500/20 text-orange-200 border-orange-400">
                  Empresa
                </Badge>
                {company.industry && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {company.industry}
                  </span>
                )}
                {company.company_size && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company.company_size} empleados
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{company.email}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{company.phone}</span>
                  </div>
                )}
                {(company.city || company.location) && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{company.city || company.location}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {company.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {company.created_at && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      Registrado: {formatDate(company.created_at)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Stats */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Vacantes publicadas:</span>
                  <span className="text-white font-medium">{jobs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Postulaciones recibidas:</span>
                  <span className="text-white font-medium">{applications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vacantes activas:</span>
                  <span className="text-white font-medium">
                    {jobs.filter(job => {
                      const now = new Date();
                      const deadline = new Date(job.application_deadline);
                      return job.status !== 'cerrado' && deadline >= now;
                    }).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Jobs and Applications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Description */}
            {company.description && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Descripción de la Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{company.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Published Jobs */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Vacantes Publicadas ({jobs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job, index) => {
                      const jobApplications = applications.filter(app => app.job_vacancy_id === job.id);
                      return (
                        <div key={index} className="border border-slate-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-1">{job.title}</h4>
                              <p className="text-gray-400 text-sm mb-2">{job.job_type} • {job.modality}</p>
                              <p className="text-gray-300 text-sm line-clamp-2">{job.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getJobStatusBadge(job)}
                              {job.created_at && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(job.created_at)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-400">
                                <User className="w-4 h-4 inline mr-1" />
                                {jobApplications.length} postulaciones
                              </span>
                              {job.salary_range && (
                                <span className="text-cyan-400">{job.salary_range}</span>
                              )}
                            </div>
                            {job.application_deadline && (
                              <span className="text-xs text-gray-500">
                                Hasta: {formatDate(job.application_deadline)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No ha publicado vacantes aún</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Applications */}
            {applications.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Postulaciones Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            {app.applicant_name || 'Nombre no disponible'}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {app.job_title || 'Vacante no disponible'}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="secondary"
                            className={
                              app.status === 'aceptado' ? 'bg-green-500/20 text-green-400' :
                              app.status === 'rechazado' ? 'bg-red-500/20 text-red-400' :
                              app.status === 'en_revision' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }
                          >
                            {app.status === 'aceptado' ? 'Aceptado' :
                             app.status === 'rechazado' ? 'Rechazado' :
                             app.status === 'en_revision' ? 'En revisión' :
                             'Nuevo'}
                          </Badge>
                          {app.created_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(app.created_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;