import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { useToast } from '../hooks/use-toast';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Plus,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';

// Backend URL configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');

const MyJobs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'active', 'inactive'
    search: '',
    job_type: 'all'
  });

  // Fetch company jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/company/jobs`, {
        withCredentials: true
      });
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Error al cargar las vacantes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on current filters
  const filteredJobs = jobs.filter(job => {
    // Status filter
    if (filters.status === 'active' && !job.is_active) return false;
    if (filters.status === 'inactive' && job.is_active) return false;
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Job type filter
    if (filters.job_type !== 'all' && job.job_type !== filters.job_type) return false;
    
    return true;
  });

  // Toggle job status
  const toggleJobStatus = async (jobId, currentStatus) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/company/jobs/${jobId}/status`,
        { is_active: !currentStatus },
        { withCredentials: true }
      );

      toast({
        title: "Estado actualizado",
        description: `La vacante ha sido ${!currentStatus ? 'activada' : 'finalizada'}`,
      });

      fetchJobs(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el estado de la vacante",
        variant: "destructive"
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Group jobs by status
  const activeJobs = jobs.filter(job => job.is_active);
  const inactiveJobs = jobs.filter(job => !job.is_active);

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
              <Briefcase className="w-8 h-8 text-orange-400" />
              Mis Vacantes
            </h1>
            <p className="text-gray-400 mt-2">
              Gestiona tus ofertas laborales publicadas
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{jobs.length}</p>
              <p className="text-sm text-gray-400">Vacantes totales</p>
            </div>
            <Button 
              onClick={() => navigate('/jobs')}
              className="bg-orange-500 hover:bg-orange-600 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Vacante
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-orange-400" />
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
                    placeholder="Título, descripción o ubicación..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Estado</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Abiertas</SelectItem>
                    <SelectItem value="inactive">Finalizadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Tipo</label>
                <Select value={filters.job_type} onValueChange={(value) => handleFilterChange('job_type', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="practica">Práctica</SelectItem>
                    <SelectItem value="pasantia">Pasantía</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="medio">Medio</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ status: 'all', job_type: 'all', search: '' })}
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
          <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-3">
            <TabsTrigger 
              value="all" 
              className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-black"
            >
              Todas ({jobs.length})
            </TabsTrigger>
            <TabsTrigger 
              value="active"
              className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
            >
              Abiertas ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger 
              value="inactive"
              className="text-white data-[state=active]:bg-red-500 data-[state=active]:text-black"
            >
              Finalizadas ({inactiveJobs.length})
            </TabsTrigger>
          </TabsList>

          {/* All Jobs */}
          <TabsContent value="all">
            <JobsList 
              jobs={filteredJobs}
              loading={loading}
              onToggleStatus={toggleJobStatus}
              onViewApplications={(jobId) => navigate(`/candidates?job_id=${jobId}`)}
            />
          </TabsContent>

          {/* Active Jobs */}
          <TabsContent value="active">
            <JobsList 
              jobs={filteredJobs.filter(job => job.is_active)}
              loading={loading}
              onToggleStatus={toggleJobStatus}
              onViewApplications={(jobId) => navigate(`/candidates?job_id=${jobId}`)}
            />
          </TabsContent>

          {/* Inactive Jobs */}
          <TabsContent value="inactive">
            <JobsList 
              jobs={filteredJobs.filter(job => !job.is_active)}
              loading={loading}
              onToggleStatus={toggleJobStatus}
              onViewApplications={(jobId) => navigate(`/candidates?job_id=${jobId}`)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Jobs List Component
const JobsList = ({ jobs, loading, onToggleStatus, onViewApplications }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-white">Cargando vacantes...</div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="py-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No hay vacantes que coincidan con los filtros</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-semibold text-lg">{job.title}</h3>
                  <Badge 
                    className={job.is_active 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                    }
                  >
                    {job.is_active ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Abierta
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Finalizada
                      </>
                    )}
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                    {job.job_type}
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    {job.modality}
                  </Badge>
                </div>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{job.description}</p>
                
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-white">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-white">
                      {new Date(job.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-white">{job.applications_count || 0} aplicaciones</span>
                  </div>
                  {job.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      <span className="text-white">{job.city}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewApplications(job.id)}
                  className="border-gray-600 text-gray-300 hover:bg-slate-700"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Ver Candidatos ({job.applications_count || 0})
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {job.is_active ? 'Finalizar' : 'Reactivar'}
                  </span>
                  <Switch
                    checked={job.is_active}
                    onCheckedChange={() => onToggleStatus(job.id, job.is_active)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyJobs;