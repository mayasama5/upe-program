import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Briefcase,
  Mail,
  Phone,
  Calendar,
  FileText,
  ExternalLink,
  User,
  MessageSquare,
  Star,
  Download
} from 'lucide-react';

// Backend URL configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');

// Status colors and labels
const STATUS_CONFIG = {
  nuevo: { label: 'Nuevo', color: 'bg-blue-500/20 text-blue-400', icon: Clock },
  en_revision: { label: 'En Revisión', color: 'bg-yellow-500/20 text-yellow-400', icon: Eye },
  entrevista: { label: 'Entrevista', color: 'bg-purple-500/20 text-purple-400', icon: MessageSquare },
  oferta: { label: 'Oferta', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  rechazado: { label: 'Rechazado', color: 'bg-red-500/20 text-red-400', icon: XCircle }
};

const UserAvatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden`}>
      {user.picture ? (
        <img 
          src={user.picture.startsWith('http') ? user.picture : `${BACKEND_URL}${user.picture}`}
          alt={user.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <span className={`${user.picture ? 'hidden w-full h-full flex items-center justify-center' : 'block'} ${textSizeClasses[size]}`}>
        {user.name?.charAt(0) || 'U'}
      </span>
    </div>
  );
};

// Application Detail Modal Component
const ApplicationDetailModal = ({ application, isOpen, onClose, onStatusUpdate }) => {
  const { toast } = useToast();

  if (!isOpen || !application) return null;

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/company/applications/${application.id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      toast({
        title: "Estado actualizado",
        description: `La aplicación ha sido marcada como ${STATUS_CONFIG[newStatus].label}`,
      });

      onStatusUpdate();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el estado de la aplicación",
        variant: "destructive"
      });
    }
  };

  const StatusIcon = STATUS_CONFIG[application.status].icon;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        // Close modal when clicking on the backdrop/overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-3 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <UserAvatar user={application.applicant} size="lg" />
            <div className="min-w-0 flex-1">
              <h2 className="text-white text-lg sm:text-xl font-semibold truncate">{application.applicant.name}</h2>
              <p className="text-gray-400 text-sm truncate">{application.job_vacancy.title}</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <Badge className={`${STATUS_CONFIG[application.status].color} text-xs`}>
              <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">{STATUS_CONFIG[application.status].label}</span>
              <span className="sm:hidden">{STATUS_CONFIG[application.status].label.split(' ')[0]}</span>
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Candidate Information */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                Información del Candidato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Email</p>
                  <p className="text-white flex items-center gap-2 text-sm sm:text-base break-all">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
                    <span className="break-all">{application.applicant.email}</span>
                  </p>
                </div>
                {application.applicant.phone && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Teléfono</p>
                    <p className="text-white flex items-center gap-2 text-sm sm:text-base">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                      {application.applicant.phone}
                    </p>
                  </div>
                )}
                {application.applicant.career && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Carrera</p>
                    <p className="text-white text-sm sm:text-base">{application.applicant.career}</p>
                  </div>
                )}
                {application.applicant.education && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Educación</p>
                    <p className="text-white text-sm sm:text-base">{application.applicant.education}</p>
                  </div>
                )}
              </div>

              {application.applicant.bio && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Biografía</p>
                  <p className="text-white text-sm sm:text-base">{application.applicant.bio}</p>
                </div>
              )}

              {application.applicant.skills && application.applicant.skills.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Habilidades</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {application.applicant.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                {application.applicant.github_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(application.applicant.github_url, '_blank')}
                    className="border-gray-600 text-gray-300 hover:bg-slate-600 text-xs sm:text-sm"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    GitHub
                  </Button>
                )}
                {application.applicant.linkedin_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(application.applicant.linkedin_url, '_blank')}
                    className="border-gray-600 text-gray-300 hover:bg-slate-600 text-xs sm:text-sm"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    LinkedIn
                  </Button>
                )}
                {application.applicant.portfolio_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(application.applicant.portfolio_url, '_blank')}
                    className="border-gray-600 text-gray-300 hover:bg-slate-600 text-xs sm:text-sm"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Portfolio
                  </Button>
                )}
              </div>

              {/* CV and Documents */}
              {application.applicant.cv_file_path && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Curriculum Vitae</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${BACKEND_URL}${application.applicant.cv_file_path}`, '_blank')}
                    className="border-gray-600 text-gray-300 hover:bg-slate-600 text-xs sm:text-sm"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Descargar CV
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Details */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                Detalles de la Aplicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Posición</p>
                  <p className="text-white text-sm sm:text-base">{application.job_vacancy.title}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Fecha de Aplicación</p>
                  <p className="text-white flex items-center gap-2 text-sm sm:text-base">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                    <span className="hidden sm:inline">
                      {new Date(application.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="sm:hidden">
                      {new Date(application.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </p>
                </div>
              </div>

              {application.cover_letter && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Carta de Presentación</p>
                  <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600">
                    <div 
                      className="text-white whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words overflow-hidden"
                      style={{ 
                        minHeight: '60px',
                        maxHeight: application.cover_letter.length > 500 ? '300px' : 'auto',
                        overflowY: application.cover_letter.length > 500 ? 'auto' : 'visible',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {application.cover_letter}
                    </div>
                    {application.cover_letter.length > 500 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {application.cover_letter.length} caracteres
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Application Information */}
              {application.contact_info && Object.keys(application.contact_info).length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Información de Contacto</p>
                  <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600 space-y-2">
                    {application.contact_info.phone && (
                      <p className="text-white text-sm sm:text-base">
                        <span className="text-gray-400">Teléfono:</span> {application.contact_info.phone}
                      </p>
                    )}
                    {application.contact_info.email && (
                      <p className="text-white text-sm sm:text-base break-all">
                        <span className="text-gray-400">Email:</span> {application.contact_info.email}
                      </p>
                    )}
                    {application.contact_info.linkedin && (
                      <p className="text-white text-sm sm:text-base">
                        <span className="text-gray-400">LinkedIn:</span> 
                        <a href={application.contact_info.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 ml-1 break-all">
                          Ver perfil
                        </a>
                      </p>
                    )}
                    {application.contact_info.portfolio && (
                      <p className="text-white text-sm sm:text-base">
                        <span className="text-gray-400">Portfolio:</span> 
                        <a href={application.contact_info.portfolio} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 ml-1 break-all">
                          Ver portfolio
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {application.experience_summary && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Resumen de Experiencia</p>
                  <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600">
                    <div 
                      className="text-white whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words overflow-hidden"
                      style={{ 
                        minHeight: '60px',
                        maxHeight: application.experience_summary.length > 400 ? '250px' : 'auto',
                        overflowY: application.experience_summary.length > 400 ? 'auto' : 'visible',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {application.experience_summary}
                    </div>
                    {application.experience_summary.length > 400 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {application.experience_summary.length} caracteres
                      </p>
                    )}
                  </div>
                </div>
              )}

              {application.availability && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Disponibilidad</p>
                  <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600">
                    <div className="text-white capitalize text-sm sm:text-base leading-relaxed break-words overflow-hidden"
                         style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      {application.availability.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information from application form */}
              {application.additional_info && Object.keys(application.additional_info).length > 0 && (
                <>
                  {application.additional_info.motivation && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400 mb-2">Motivación</p>
                      <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600">
                        <div 
                          className="text-white whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words overflow-hidden"
                          style={{ 
                            minHeight: '60px',
                            maxHeight: application.additional_info.motivation.length > 300 ? '200px' : 'auto',
                            overflowY: application.additional_info.motivation.length > 300 ? 'auto' : 'visible',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere'
                          }}
                        >
                          {application.additional_info.motivation}
                        </div>
                        {application.additional_info.motivation.length > 300 && (
                          <p className="text-xs text-gray-500 mt-2">
                            {application.additional_info.motivation.length} caracteres
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {application.additional_info.skills && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400 mb-2">Habilidades y Tecnologías</p>
                      <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600">
                        <div 
                          className="text-white whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words overflow-hidden"
                          style={{ 
                            minHeight: '40px',
                            maxHeight: application.additional_info.skills.length > 200 ? '150px' : 'auto',
                            overflowY: application.additional_info.skills.length > 200 ? 'auto' : 'visible',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere'
                          }}
                        >
                          {application.additional_info.skills}
                        </div>
                        {application.additional_info.skills.length > 200 && (
                          <p className="text-xs text-gray-500 mt-2">
                            {application.additional_info.skills.length} caracteres
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {application.additional_info.salary_expectation && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400 mb-2">Expectativa Salarial</p>
                      <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600">
                        <div className="text-white text-sm sm:text-base leading-relaxed break-words overflow-hidden"
                             style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                          {application.additional_info.salary_expectation}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-white text-base sm:text-lg">Gestionar Aplicación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                  const StatusIcon = config.icon;
                  return (
                    <Button
                      key={status}
                      variant={application.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusUpdate(status)}
                      className={`text-xs justify-start sm:justify-center ${application.status === status ? 
                        'bg-cyan-500 text-black' : 
                        'border-gray-600 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      <StatusIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{config.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ViewCandidates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    job_id: '',
    search: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Check for URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobIdFromUrl = urlParams.get('job_id');
    
    if (jobIdFromUrl) {
      setFilters(prev => ({ ...prev, job_id: jobIdFromUrl }));
    }
  }, []);

  // Fetch company's job vacancies
  const fetchMyJobs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/company/jobs`, {
        withCredentials: true
      });
      setMyJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching company jobs:', error);
    }
  };

  // Fetch applications
  const fetchApplications = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.job_id) params.append('job_id', filters.job_id);

      const response = await axios.get(
        `${BACKEND_URL}/api/company/applications?${params}`,
        { withCredentials: true }
      );

      let applicationsData = response.data.applications || [];

      // Apply search filter on frontend (since backend doesn't support it)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        applicationsData = applicationsData.filter(app => 
          app.applicant.name.toLowerCase().includes(searchLower) ||
          app.applicant.email.toLowerCase().includes(searchLower) ||
          app.job_vacancy.title.toLowerCase().includes(searchLower)
        );
      }

      setApplications(applicationsData);
      setPagination(response.data.pagination || pagination);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Error al cargar las aplicaciones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
    fetchApplications();
  }, []);

  useEffect(() => {
    fetchApplications(1);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    fetchApplications(newPage);
  };

  const handleStatusUpdate = () => {
    fetchApplications(pagination.page);
  };

  // Group applications by status for tabs
  const applicationsByStatus = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const filteredApplications = filters.status 
    ? applications.filter(app => app.status === filters.status)
    : applications;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← Volver al Dashboard
          </Button>
          <Badge variant="outline" className="text-orange-400 border-orange-400/30">
            Empresa
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-cyan-400" />
              Ver Candidatos
            </h1>
            <p className="text-gray-400 mt-2">
              Gestiona las aplicaciones a tus vacantes laborales
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{pagination.total}</p>
            <p className="text-sm text-gray-400">Aplicaciones totales</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-cyan-400" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    placeholder="Nombre, email o posición..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Estado</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                      <SelectItem key={status} value={status}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Filter */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Vacante</label>
                <Select value={filters.job_id} onValueChange={(value) => handleFilterChange('job_id', value === 'all' ? '' : value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Todas las vacantes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las vacantes</SelectItem>
                    {myJobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} {job.is_active ? '(Abierta)' : '(Finalizada)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ status: '', job_id: '', search: '' })}
                  className="border-gray-600 text-gray-300 hover:bg-slate-700"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-6">
            <TabsTrigger 
              value="all" 
              className="text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-black"
            >
              Todas ({applications.length})
            </TabsTrigger>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <TabsTrigger 
                key={status}
                value={status}
                className="text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-black"
              >
                {config.label} ({applicationsByStatus[status] || 0})
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Applications List */}
          <TabsContent value="all">
            <ApplicationsList 
              applications={applications}
              loading={loading}
              onViewDetails={setSelectedApplication}
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>

          {Object.keys(STATUS_CONFIG).map((status) => (
            <TabsContent key={status} value={status}>
              <ApplicationsList 
                applications={applications.filter(app => app.status === status)}
                loading={loading}
                onViewDetails={setSelectedApplication}
                onStatusUpdate={handleStatusUpdate}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="border-gray-600 text-gray-300"
            >
              Anterior
            </Button>
            
            <span className="text-gray-400 px-4">
              Página {pagination.page} de {pagination.pages}
            </span>
            
            <Button
              variant="outline"
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="border-gray-600 text-gray-300"
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

// Applications List Component
const ApplicationsList = ({ applications, loading, onViewDetails, onStatusUpdate }) => {
  const { toast } = useToast();

  const handleQuickStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/company/applications/${applicationId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      toast({
        title: "Estado actualizado",
        description: `La aplicación ha sido marcada como ${STATUS_CONFIG[newStatus].label}`,
      });

      onStatusUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el estado",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-white">Cargando aplicaciones...</div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="py-12 text-center">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No hay aplicaciones que coincidan con los filtros</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const StatusIcon = STATUS_CONFIG[application.status].icon;
        
        return (
          <Card key={application.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <UserAvatar user={application.applicant} size="md" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">{application.applicant.name}</h3>
                      <Badge className={`${STATUS_CONFIG[application.status].color} text-xs`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">{STATUS_CONFIG[application.status].label}</span>
                        <span className="sm:hidden">{STATUS_CONFIG[application.status].label.split(' ')[0]}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-gray-400 text-xs sm:text-sm mb-1 truncate">{application.job_vacancy.title}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-2">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="hidden sm:inline">
                        Aplicó el {new Date(application.created_at).toLocaleDateString('es-ES')}
                      </span>
                      <span className="sm:hidden">
                        {new Date(application.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(application)}
                    className="border-gray-600 text-gray-300 hover:bg-slate-700 text-xs sm:text-sm whitespace-nowrap"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Ver Detalles</span>
                    <span className="sm:hidden">Ver</span>
                  </Button>

                  {/* Quick actions */}
                  {application.status === 'nuevo' && (
                    <Button
                      size="sm"
                      onClick={() => handleQuickStatusUpdate(application.id, 'en_revision')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs sm:text-sm whitespace-nowrap"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Revisar</span>
                      <span className="sm:hidden">Rev</span>
                    </Button>
                  )}

                  {application.status === 'en_revision' && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleQuickStatusUpdate(application.id, 'entrevista')}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                        title="Entrevista"
                      >
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickStatusUpdate(application.id, 'rechazado')}
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                        title="Rechazar"
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  )}

                  {application.status === 'entrevista' && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleQuickStatusUpdate(application.id, 'oferta')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        title="Hacer oferta"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickStatusUpdate(application.id, 'rechazado')}
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                        title="Rechazar"
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Application preview info */}
              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white break-all">{application.applicant.email}</p>
                </div>
                {application.applicant.phone && (
                  <div>
                    <p className="text-gray-400">Teléfono</p>
                    <p className="text-white">{application.applicant.phone}</p>
                  </div>
                )}
                {application.applicant.skills && application.applicant.skills.length > 0 && (
                  <div className="sm:col-span-1">
                    <p className="text-gray-400">Habilidades principales</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {application.applicant.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {application.applicant.skills.length > 2 && (
                        <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 text-xs">
                          +{application.applicant.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ViewCandidates;