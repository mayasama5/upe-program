import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import Header from '../components/Header';
import { 
  Building, 
  MapPin, 
  Clock, 
  Calendar,
  Search,
  Filter,
  Eye,
  FileText,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Status configuration for applications
const STATUS_CONFIG = {
  nuevo: {
    label: 'Nuevo',
    icon: AlertCircle,
    color: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
    description: 'Tu aplicación ha sido recibida y está pendiente de revisión'
  },
  en_revision: {
    label: 'En Revisión',
    icon: Eye,
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
    description: 'La empresa está revisando tu aplicación'
  },
  entrevista: {
    label: 'Entrevista',
    icon: MessageSquare,
    color: 'bg-purple-500/20 text-purple-400 border-purple-400/30',
    description: 'Has sido seleccionado para una entrevista'
  },
  oferta: {
    label: 'Oferta',
    icon: CheckCircle,
    color: 'bg-green-500/20 text-green-400 border-green-400/30',
    description: '¡Felicitaciones! Has recibido una oferta de trabajo'
  },
  rechazado: {
    label: 'Rechazado',
    icon: XCircle,
    color: 'bg-red-500/20 text-red-400 border-red-400/30',
    description: 'Lamentablemente no fuiste seleccionado esta vez'
  }
};

const ApplicationDetailModal = ({ application, isOpen, onClose }) => {
  if (!isOpen || !application) return null;

  const StatusIcon = STATUS_CONFIG[application.status].icon;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-3 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Building className="w-8 h-8 text-orange-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h2 className="text-white text-lg sm:text-xl font-semibold truncate">{application.job_vacancy.title}</h2>
              <p className="text-gray-400 text-sm truncate">{application.job_vacancy.company}</p>
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
          {/* Job Information */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                Información de la Vacante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Empresa</p>
                  <p className="text-white text-sm sm:text-base">{application.job_vacancy.company}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Ubicación</p>
                  <p className="text-white text-sm sm:text-base">{application.job_vacancy.city || application.job_vacancy.location}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Modalidad</p>
                  <p className="text-white text-sm sm:text-base capitalize">{application.job_vacancy.modality}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Tipo</p>
                  <p className="text-white text-sm sm:text-base capitalize">{application.job_vacancy.job_type}</p>
                </div>
              </div>

              {application.job_vacancy.description && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Descripción</p>
                  <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600">
                    <p className="text-white text-sm sm:text-base leading-relaxed">{application.job_vacancy.description}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                Estado de la Aplicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <Badge className={`${STATUS_CONFIG[application.status].color} text-sm`}>
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {STATUS_CONFIG[application.status].label}
                </Badge>
                <p className="text-gray-400 text-sm">
                  Aplicado el {new Date(application.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600">
                <p className="text-white text-sm sm:text-base">
                  {STATUS_CONFIG[application.status].description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* My Application Data */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                Mi Aplicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {application.cover_letter && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Carta de Presentación</p>
                  <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600">
                    <div 
                      className="text-white whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words overflow-hidden"
                      style={{ 
                        maxHeight: '150px',
                        overflowY: application.cover_letter.length > 300 ? 'auto' : 'visible'
                      }}
                    >
                      {application.cover_letter}
                    </div>
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
                        maxHeight: '120px',
                        overflowY: application.experience_summary.length > 250 ? 'auto' : 'visible'
                      }}
                    >
                      {application.experience_summary}
                    </div>
                  </div>
                </div>
              )}

              {application.availability && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Disponibilidad</p>
                  <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-600">
                    <p className="text-white capitalize text-sm sm:text-base">
                      {application.availability.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function MyApplications() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'estudiante') {
      navigate('/');
      return;
    }
    fetchApplications();
  }, [user, navigate]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${BACKEND_URL}/api/student/applications`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las aplicaciones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.job_vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.job_vacancy.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = {};
    Object.keys(STATUS_CONFIG).forEach(status => {
      stats[status] = applications.filter(app => app.status === status).length;
    });
    return stats;
  };

  const statusStats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header user={user} logout={logout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white">Cargando aplicaciones...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mis Aplicaciones</h1>
          <p className="text-gray-400">Haz seguimiento del estado de tus postulaciones laborales</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const StatusIcon = config.icon;
            const count = statusStats[status];
            
            return (
              <Card key={status} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4 text-center">
                  <StatusIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-xs text-gray-400">{config.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por empresa o posición..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-md px-10 py-2 pr-8 appearance-none cursor-pointer"
            >
              <option value="">Todos los estados</option>
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <option key={status} value={status}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                {applications.length === 0 
                  ? "Aún no has aplicado a ninguna vacante" 
                  : "No se encontraron aplicaciones con los filtros aplicados"
                }
              </p>
              <Button 
                onClick={() => navigate('/jobs')}
                className="bg-cyan-500 hover:bg-cyan-600 text-black"
              >
                Explorar Vacantes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const StatusIcon = STATUS_CONFIG[application.status].icon;
              
              return (
                <Card key={application.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-orange-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                              {application.job_vacancy.title}
                            </h3>
                            <Badge className={`${STATUS_CONFIG[application.status].color} text-xs w-fit`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {STATUS_CONFIG[application.status].label}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-400 text-sm mb-2 truncate">{application.job_vacancy.company}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{application.job_vacancy.city || application.job_vacancy.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="capitalize">{application.job_vacancy.modality}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(application.created_at).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                          className="border-gray-600 text-gray-300 hover:bg-slate-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalles
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/jobs`)}
                          className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <ArrowRight className="w-4 h-4 mr-1" />
                          Más Vacantes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </div>
  );
}