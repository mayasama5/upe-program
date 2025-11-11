import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

// Component para manejar avatares con imagen o fallback
const UserAvatar = ({ user, size = 'sm', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-10 sm:h-10',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-sm',
    lg: 'text-2xl'
  };

  const showImage = user.picture && !imageError;
  const imageUrl = user.picture ? 
    (user.picture.startsWith('http') ? user.picture : `${BACKEND_URL}${user.picture}`) : 
    null;

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold ${textSizeClasses[size]} flex-shrink-0 overflow-hidden ${className}`}>
      {showImage && (
        <img 
          src={imageUrl}
          alt={user.name}
          className={`w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
      {(!showImage || !imageLoaded) && (
        <span className="flex items-center justify-center w-full h-full">
          {user.name?.charAt(0) || 'U'}
        </span>
      )}
    </div>
  );
};

import {
  Users,
  Activity,
  Calendar,
  Briefcase,
  BookOpen,
  AlertCircle,
  TrendingUp,
  Shield,
  Database,
  Settings,
  FileText,
  BarChart3,
  UserCheck,
  UserX,
  Eye,
  Trash2,
  Search,
  Download,
  RefreshCw,
  Bell,
  FolderOpen,
  UserCog,
  Newspaper
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { saveAs } from 'file-saver';
import Header from '../components/Header';
import ContentManagement from '../components/admin/ContentManagement';
import NotificationSystem from '../components/admin/NotificationSystem';
import ReportsPanel from '../components/admin/ReportsPanel';
import { UserGrowthChart, CategoryActivityChart, UsersByRoleChart } from '../components/admin/AdminCharts';
import { exportToExcel } from '../utils/exportUtils';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const COLORS = {
  nuevo: '#3B82F6',      // blue
  en_revision: '#F59E0B', // amber
  entrevista: '#8B5CF6',  // purple
  oferta: '#10B981',      // emerald-500 (green)
  contratado: '#06B6D4',  // cyan-500 (light blue/cyan)
  rechazado: '#EF4444'    // red
};

const STATUS_LABELS = {
  nuevo: 'Nuevo',
  en_revision: 'En Revisión',
  entrevista: 'Entrevista',
  oferta: 'Oferta',
  contratado: 'Contratado',
  rechazado: 'Rechazado'
};

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEvents: 0,
    totalJobs: 0,
    activeUsers: 0,
    pendingApplications: 0
  });
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    categoryActivity: { courses: 0, events: 0, jobs: 0 },
    usersByRole: [],
    activitySummary: {
      newUsers: { count: 0, percentage: 0 },
      savedCourses: { count: 0, percentage: 0 },
      registeredEvents: { count: 0, percentage: 0 },
      applications: { count: 0, percentage: 0 }
    }
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Reports state
  const [reportsLoading, setReportsLoading] = useState(false);
  const [applicationsStats, setApplicationsStats] = useState(null);
  const [usersStats, setUsersStats] = useState(null);
  const [jobsStats, setJobsStats] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchStats();
      fetchUsers();
      fetchLogs();
      fetchAnalytics();
      fetchMaintenanceStatus();
      fetchReports(); // Auto-load reports on mount
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/dashboard-stats`, {
        withCredentials: true
      });

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback a datos mock si falla
      setStats({
        totalUsers: 0,
        totalCourses: 0,
        totalEvents: 0,
        totalJobs: 0,
        activeUsers: 0,
        pendingApplications: 0
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/users`, {
        withCredentials: true,
        params: { limit: 20 }
      });

      if (response.data.success) {
        // Mapear datos para incluir status
        const usersWithStatus = response.data.users.map(u => ({
          ...u,
          status: u.is_verified ? 'active' : 'inactive',
          createdAt: u.created_at
        }));
        setUsers(usersWithStatus);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/logs`, {
        withCredentials: true,
        params: { limit: 50 }
      });

      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/analytics`, {
        withCredentials: true
      });

      if (response.data.success) {
        const analytics = response.data.analytics;

        // Procesar userGrowth para el formato del gráfico
        const userGrowthData = analytics.userGrowth?.map(item => {
          const date = new Date(item.created_at);
          return {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            count: item._count
          };
        }) || [];

        // Procesar savedItems para categoryActivity
        const categoryData = {
          courses: 0,
          events: 0,
          jobs: 0
        };
        analytics.savedItemsActivity?.forEach(item => {
          if (item.item_type === 'course') categoryData.courses = item._count;
          if (item.item_type === 'event') categoryData.events = item._count;
          if (item.item_type === 'job') categoryData.jobs = item._count;
        });

        // Procesar usersByRole
        const roleData = analytics.usersByRole?.map(item => ({
          role: item.role,
          count: item._count
        })) || [];

        setAnalyticsData({
          userGrowth: userGrowthData.length > 0 ? userGrowthData : [
            { month: 1, year: 2025, count: 0 }
          ],
          categoryActivity: categoryData,
          usersByRole: roleData.length > 0 ? roleData : [
            { role: 'estudiante', count: 0 }
          ],
          activitySummary: analytics.activitySummary || {
            newUsers: { count: 0, percentage: 0 },
            savedCourses: { count: 0, percentage: 0 },
            registeredEvents: { count: 0, percentage: 0 },
            applications: { count: 0, percentage: 0 }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Datos mock como fallback
      setAnalyticsData({
        userGrowth: [{ month: 1, year: 2025, count: 0 }],
        categoryActivity: { courses: 0, events: 0, jobs: 0 },
        usersByRole: [{ role: 'estudiante', count: 0 }],
        activitySummary: {
          newUsers: { count: 0, percentage: 0 },
          savedCourses: { count: 0, percentage: 0 },
          registeredEvents: { count: 0, percentage: 0 },
          applications: { count: 0, percentage: 0 }
        }
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchUsers(), fetchLogs(), fetchAnalytics()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/settings`, {
        withCredentials: true
      });

      if (response.data.success) {
        setMaintenanceMode(response.data.data.maintenance_mode);
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    }
  };

  const toggleMaintenanceMode = async () => {
    setMaintenanceLoading(true);
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/admin/settings/maintenance`,
        { maintenance_mode: !maintenanceMode },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMaintenanceMode(response.data.data.maintenance_mode);
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      alert('Error al cambiar el modo de mantenimiento');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  // Reports functions
  const fetchReports = async (customDateRange = dateRange) => {
    setReportsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const queryParams = new URLSearchParams();
      if (customDateRange.startDate) queryParams.append('startDate', customDateRange.startDate);
      if (customDateRange.endDate) queryParams.append('endDate', customDateRange.endDate);
      const queryString = queryParams.toString();

      const [applicationsRes, usersRes, jobsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/reports/applications-stats?${queryString}`, { headers }),
        fetch(`${BACKEND_URL}/api/reports/users-stats?${queryString}`, { headers }),
        fetch(`${BACKEND_URL}/api/reports/jobs-stats?${queryString}`, { headers })
      ]);

      const applicationsData = await applicationsRes.json();
      const usersData = await usersRes.json();
      const jobsData = await jobsRes.json();

      if (!applicationsData.success) {
        console.error('❌ Backend returned error:', applicationsData);
        const errorMsg = `Error: ${applicationsData.message || 'No se pudieron cargar los reportes'}\n\nDetalles: ${applicationsData.details || applicationsData.error || 'Sin detalles'}`;
        alert(errorMsg);
        return;
      }

      setApplicationsStats(applicationsData.data);
      setUsersStats(usersData.data);
      setJobsStats(jobsData.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Error al cargar los reportes');
    } finally {
      setReportsLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    const newDateRange = { ...dateRange, [name]: value };
    setDateRange(newDateRange);
  };

  const applyFilters = () => {
    fetchReports(dateRange);
  };

  const clearFilters = () => {
    const cleared = { startDate: '', endDate: '' };
    setDateRange(cleared);
    fetchReports(cleared);
  };

  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (dateRange.startDate) queryParams.append('startDate', dateRange.startDate);
      if (dateRange.endDate) queryParams.append('endDate', dateRange.endDate);
      queryParams.append('format', 'csv');

      const response = await fetch(`${BACKEND_URL}/api/reports/export/applications?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const blob = await response.blob();
      saveAs(blob, `reporte-aplicaciones-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar el reporte');
    }
  };

  const exportToJSON = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (dateRange.startDate) queryParams.append('startDate', dateRange.startDate);
      if (dateRange.endDate) queryParams.append('endDate', dateRange.endDate);
      queryParams.append('format', 'json');

      const response = await fetch(`${BACKEND_URL}/api/reports/export/applications?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      saveAs(blob, `reporte-aplicaciones-${new Date().toISOString().split('T')[0]}.json`);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar el reporte');
    }
  };

  const exportApplicationsToExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (dateRange.startDate) queryParams.append('startDate', dateRange.startDate);
      if (dateRange.endDate) queryParams.append('endDate', dateRange.endDate);
      queryParams.append('format', 'json');

      const response = await fetch(`${BACKEND_URL}/api/reports/export/applications?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        // Formatear datos para Excel
        const formattedData = data.data.map(app => ({
          'ID': app.id,
          'Fecha': new Date(app.created_at).toLocaleDateString('es-ES'),
          'Estado': app.status,
          'Puesto': app.job_vacancy?.title || 'N/A',
          'Empresa': app.job_vacancy?.company || 'N/A',
          'Tipo': app.job_vacancy?.job_type || 'N/A',
          'Modalidad': app.job_vacancy?.modality || 'N/A',
          'Candidato': app.applicant?.name || 'N/A',
          'Email': app.applicant?.email || 'N/A',
          'Carrera': app.applicant?.career || 'N/A'
        }));

        exportToExcel(formattedData, `reporte-aplicaciones-${new Date().toISOString().split('T')[0]}`);
      } else {
        alert('No hay datos para exportar');
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error al exportar el reporte a Excel');
    }
  };

  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToDelete(user);
      setDeleteModalOpen(true);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/admin/users/${userToDelete.id}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setDeleteModalOpen(false);
        setUserToDelete(null);
        setDeleteConfirmText('');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const response = await axios.put(
        `${BACKEND_URL}/api/admin/users/${userId}`,
        { is_verified: newStatus === 'active' },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers(users.map(u =>
          u.id === userId ? { ...u, status: newStatus } : u
        ));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar usuario');
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    if (!window.confirm(`¿Estás seguro de cambiar el rol de este usuario a "${newRole}"?`)) {
      return;
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/admin/users/${userId}`,
        { role: newRole },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers(users.map(u =>
          u.id === userId ? { ...u, role: newRole } : u
        ));
        alert('Rol actualizado correctamente');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error al cambiar el rol del usuario');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-400 bg-red-500/10';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10';
      case 'info': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleExportUsers = () => {
    if (users.length === 0) {
      alert('No hay usuarios para exportar');
      return;
    }

    // Formatear datos para exportación
    const exportData = users.map(user => ({
      'Nombre': user.name || '',
      'Email': user.email || '',
      'Rol': user.role || '',
      'Verificado': user.is_verified ? 'Sí' : 'No',
      'Fecha de Registro': user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : ''
    }));

    const filename = `usuarios_${new Date().toISOString().split('T')[0]}`;
    exportToExcel(exportData, filename);
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400" />
              Panel de Administración
            </h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Bienvenido, <span className="text-cyan-400 font-medium">{user.name}</span> • Gestión completa del sistema UPE
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-black text-sm sm:text-base"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Total Usuarios</CardTitle>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-green-400 mt-1">+12% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Usuarios Activos</CardTitle>
                <Activity className="w-4 h-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
              <p className="text-xs text-green-400 mt-1">27% del total</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Cursos Disponibles</CardTitle>
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalCourses}</div>
              <p className="text-xs text-gray-400 mt-1">3 agregados esta semana</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Eventos</CardTitle>
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalEvents}</div>
              <p className="text-xs text-gray-400 mt-1">8 próximos eventos</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Vacantes Activas</CardTitle>
                <Briefcase className="w-4 h-4 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalJobs}</div>
              <p className="text-xs text-green-400 mt-1">+5 nuevas esta semana</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Aplicaciones Pendientes</CardTitle>
                <AlertCircle className="w-4 h-4 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingApplications}</div>
              <p className="text-xs text-yellow-400 mt-1">Requieren revisión</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-3 sm:space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700 w-full flex flex-wrap gap-1 p-1 sm:p-1.5 h-auto">
            <TabsTrigger value="users" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Contenido</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Reportes</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Configuración</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-3 sm:space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <CardTitle className="text-white text-lg sm:text-xl">Gestión de Usuarios</CardTitle>
                    <CardDescription className="text-gray-400 text-sm sm:text-base">
                      Administra todos los usuarios de la plataforma
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 sm:pl-10 bg-slate-900 border-slate-700 text-white text-sm sm:text-base"
                      />
                    </div>
                    <Button
                      onClick={handleExportUsers}
                      className="bg-cyan-500 hover:bg-cyan-600 text-black text-sm sm:text-base whitespace-nowrap"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Exportar Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-2 sm:space-y-3">
                  {currentUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No se encontraron usuarios
                    </div>
                  ) : (
                    currentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <UserAvatar user={user} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium text-sm sm:text-base truncate">{user.name}</p>
                          <p className="text-xs sm:text-sm text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <UserCog className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <Select
                            value={user.role}
                            onValueChange={(newRole) => handleChangeUserRole(user.id, newRole)}
                          >
                            <SelectTrigger className={`w-[110px] sm:w-[130px] h-7 text-xs sm:text-sm border ${
                              user.role === 'admin' ? 'text-red-400 border-red-400/30 bg-red-500/10' :
                              user.role === 'empresa' ? 'text-orange-400 border-orange-400/30 bg-orange-500/10' :
                              'text-cyan-400 border-cyan-400/30 bg-cyan-500/10'
                            }`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                              <SelectItem value="estudiante" className="text-cyan-400 hover:bg-cyan-500/10">Estudiante</SelectItem>
                              <SelectItem value="empresa" className="text-orange-400 hover:bg-orange-500/10">Empresa</SelectItem>
                              <SelectItem value="admin" className="text-red-400 hover:bg-red-500/10">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={`text-xs sm:text-sm ${
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border-green-400/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-400/30'
                        }`}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>

                        <span className="text-xs sm:text-sm text-gray-500 hidden md:inline">
                          {formatDate(user.createdAt)}
                        </span>

                        <div className="flex gap-1 sm:gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="text-gray-400 hover:text-white p-1 sm:p-2"
                          >
                            {user.status === 'active' ? <UserX className="w-3 h-3 sm:w-4 sm:h-4" /> : <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewUserDetails(user)}
                            className="text-gray-400 hover:text-cyan-400 p-1 sm:p-2"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-gray-400 hover:text-red-400 p-1 sm:p-2"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {filteredUsers.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700">
                    <div className="text-sm text-gray-400">
                      Mostrando {indexOfFirstUser + 1} a {Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length} usuarios
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="border-slate-700 text-gray-400 hover:text-white hover:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </Button>

                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                          // Show only 5 page numbers at a time
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={pageNumber}
                                variant={currentPage === pageNumber ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNumber)}
                                className={currentPage === pageNumber
                                  ? "bg-cyan-500 text-black hover:bg-cyan-600"
                                  : "border-slate-700 text-gray-400 hover:text-white hover:border-cyan-500"
                                }
                              >
                                {pageNumber}
                              </Button>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return <span key={pageNumber} className="text-gray-400 px-2">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="border-slate-700 text-gray-400 hover:text-white hover:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-4">
            <Tabs defaultValue="courses" className="space-y-4">
              <TabsList className="bg-slate-800 border border-slate-700">
                <TabsTrigger value="courses" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Cursos
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                  <Calendar className="w-4 h-4 mr-2" />
                  Eventos
                </TabsTrigger>
                <TabsTrigger value="jobs" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Vacantes
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                  <Newspaper className="w-4 h-4 mr-2" />
                  Noticias
                </TabsTrigger>
              </TabsList>

              <TabsContent value="courses">
                <ContentManagement type="courses" />
              </TabsContent>

              <TabsContent value="events">
                <ContentManagement type="events" />
              </TabsContent>

              <TabsContent value="jobs">
                <ContentManagement type="jobs" />
              </TabsContent>

              <TabsContent value="news">
                <ContentManagement type="news" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSystem />
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-3 sm:space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-white text-lg sm:text-xl">Logs del Sistema</CardTitle>
                <CardDescription className="text-gray-400 text-sm sm:text-base">
                  Registro de actividad y eventos del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <ScrollArea className="h-[400px] sm:h-[500px] pr-2 sm:pr-4">
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 sm:p-4 bg-slate-900 rounded-lg border border-slate-700"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge className={`text-xs ${getLogLevelColor(log.level)}`}>
                                {log.level.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                                {log.type}
                              </Badge>
                              <span className="text-xs text-gray-500 sm:hidden">
                                {formatDate(log.timestamp)}
                              </span>
                            </div>
                            <p className="text-white text-xs sm:text-sm break-words">{log.message}</p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:inline ml-4">
                            {formatDate(log.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-3 sm:space-y-4">
            {/* Reports Section */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Reportes y Estadísticas de Aplicaciones</CardTitle>
                <CardDescription className="text-gray-400">
                  Análisis de entrevistas, contrataciones y rechazos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-end mb-6">
                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Fecha Inicio
                    </label>
                    <Input
                      type="date"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateRangeChange}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>

                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Fecha Fin
                    </label>
                    <Input
                      type="date"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateRangeChange}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>

                  <Button
                    onClick={applyFilters}
                    disabled={reportsLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {reportsLoading ? 'Cargando...' : 'Aplicar Filtros'}
                  </Button>

                  <Button
                    onClick={clearFilters}
                    disabled={reportsLoading}
                    variant="outline"
                    className="border-slate-600 text-gray-300"
                  >
                    Limpiar
                  </Button>

                  <div className="ml-auto flex gap-2">
                    <Button
                      onClick={exportApplicationsToExcel}
                      disabled={reportsLoading || !applicationsStats}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Excel
                    </Button>
                    <Button
                      onClick={exportToCSV}
                      disabled={reportsLoading || !applicationsStats}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                    <Button
                      onClick={exportToJSON}
                      disabled={reportsLoading || !applicationsStats}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                </div>

                {/* Summary Cards */}
                {applicationsStats && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                      <div className="bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-700">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Total Aplicaciones</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-white break-words">{applicationsStats.summary?.total || 0}</p>
                      </div>

                      <div className="bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-700">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">En Entrevista</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-400 break-words">{applicationsStats.summary?.entrevista || 0}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {applicationsStats.summary?.conversionRates?.interviewRate || 0}% del total
                        </p>
                      </div>

                      <div className="bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-700">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Oferta</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-green-400 break-words">{applicationsStats.summary?.oferta || 0}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {applicationsStats.summary?.conversionRates?.offerRate || 0}% del total
                        </p>
                      </div>

                      <div className="bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-700">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Contratados</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-cyan-400 break-words">{applicationsStats.summary?.contratado || 0}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Finalizados
                        </p>
                      </div>

                      <div className="bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-700">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Rechazados</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-red-400 break-words">{applicationsStats.summary?.rechazado || 0}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {applicationsStats.summary?.conversionRates?.rejectionRate || 0}% del total
                        </p>
                      </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Pie Chart */}
                      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                        <h2 className="text-lg font-bold text-white mb-4">
                          Distribución por Estado
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: STATUS_LABELS.nuevo, value: applicationsStats.summary.nuevo, color: COLORS.nuevo },
                                { name: STATUS_LABELS.en_revision, value: applicationsStats.summary.en_revision, color: COLORS.en_revision },
                                { name: STATUS_LABELS.entrevista, value: applicationsStats.summary.entrevista, color: COLORS.entrevista },
                                { name: STATUS_LABELS.oferta, value: applicationsStats.summary.oferta, color: COLORS.oferta },
                                { name: STATUS_LABELS.contratado, value: applicationsStats.summary.contratado, color: COLORS.contratado },
                                { name: STATUS_LABELS.rechazado, value: applicationsStats.summary.rechazado, color: COLORS.rechazado }
                              ].filter(item => item.value > 0)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {[
                                { name: STATUS_LABELS.nuevo, value: applicationsStats.summary.nuevo, color: COLORS.nuevo },
                                { name: STATUS_LABELS.en_revision, value: applicationsStats.summary.en_revision, color: COLORS.en_revision },
                                { name: STATUS_LABELS.entrevista, value: applicationsStats.summary.entrevista, color: COLORS.entrevista },
                                { name: STATUS_LABELS.oferta, value: applicationsStats.summary.oferta, color: COLORS.oferta },
                                { name: STATUS_LABELS.contratado, value: applicationsStats.summary.contratado, color: COLORS.contratado },
                                { name: STATUS_LABELS.rechazado, value: applicationsStats.summary.rechazado, color: COLORS.rechazado }
                              ].filter(item => item.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Bar Chart */}
                      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                        <h2 className="text-lg font-bold text-white mb-4">
                          Cantidad por Estado
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={[
                            { name: STATUS_LABELS.nuevo, value: applicationsStats.summary.nuevo, color: COLORS.nuevo },
                            { name: STATUS_LABELS.en_revision, value: applicationsStats.summary.en_revision, color: COLORS.en_revision },
                            { name: STATUS_LABELS.entrevista, value: applicationsStats.summary.entrevista, color: COLORS.entrevista },
                            { name: STATUS_LABELS.oferta, value: applicationsStats.summary.oferta, color: COLORS.oferta },
                            { name: STATUS_LABELS.contratado, value: applicationsStats.summary.contratado, color: COLORS.contratado },
                            { name: STATUS_LABELS.rechazado, value: applicationsStats.summary.rechazado, color: COLORS.rechazado }
                          ].filter(item => item.value > 0)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                            <Bar dataKey="value" fill="#3B82F6">
                              {[
                                { name: STATUS_LABELS.nuevo, value: applicationsStats.summary.nuevo, color: COLORS.nuevo },
                                { name: STATUS_LABELS.en_revision, value: applicationsStats.summary.en_revision, color: COLORS.en_revision },
                                { name: STATUS_LABELS.entrevista, value: applicationsStats.summary.entrevista, color: COLORS.entrevista },
                                { name: STATUS_LABELS.oferta, value: applicationsStats.summary.oferta, color: COLORS.oferta },
                                { name: STATUS_LABELS.contratado, value: applicationsStats.summary.contratado, color: COLORS.contratado },
                                { name: STATUS_LABELS.rechazado, value: applicationsStats.summary.rechazado, color: COLORS.rechazado }
                              ].filter(item => item.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Additional Bar Charts */}
                    <div className="grid grid-cols-1 gap-6 mb-6">
                      {/* Applications by Month - Line/Bar Chart */}
                      {applicationsStats.byMonth && applicationsStats.byMonth.length > 0 && (
                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                          <h2 className="text-lg font-bold text-white mb-4">
                            Tendencia de Aplicaciones por Mes
                          </h2>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={applicationsStats.byMonth.slice(0, 12).reverse().map(item => {
                              const date = new Date(item.month);
                              return {
                                month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                                [STATUS_LABELS[item.status] || item.status]: parseInt(item.count),
                                status: item.status
                              };
                            }).reduce((acc, curr) => {
                              const existing = acc.find(item => item.month === curr.month);
                              if (existing) {
                                Object.assign(existing, curr);
                              } else {
                                acc.push(curr);
                              }
                              return acc;
                            }, [])}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis dataKey="month" stroke="#9CA3AF" />
                              <YAxis stroke="#9CA3AF" />
                              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                              <Legend />
                              <Bar dataKey={STATUS_LABELS.nuevo} stackId="a" fill={COLORS.nuevo} />
                              <Bar dataKey={STATUS_LABELS.en_revision} stackId="a" fill={COLORS.en_revision} />
                              <Bar dataKey={STATUS_LABELS.entrevista} stackId="a" fill={COLORS.entrevista} />
                              <Bar dataKey={STATUS_LABELS.oferta} stackId="a" fill={COLORS.oferta} />
                              <Bar dataKey={STATUS_LABELS.contratado} stackId="a" fill={COLORS.contratado} />
                              <Bar dataKey={STATUS_LABELS.rechazado} stackId="a" fill={COLORS.rechazado} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* Top Jobs Bar Chart */}
                      {applicationsStats.topJobs && applicationsStats.topJobs.length > 0 && (
                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                          <h2 className="text-lg font-bold text-white mb-4">
                            Top 10 Empleos por Aplicaciones
                          </h2>
                          <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                              data={applicationsStats.topJobs.slice(0, 10)}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis type="number" stroke="#9CA3AF" />
                              <YAxis
                                dataKey="title"
                                type="category"
                                stroke="#9CA3AF"
                                width={150}
                                tick={{ fontSize: 12 }}
                              />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                                formatter={(value, name, props) => [
                                  `${value} aplicaciones`,
                                  props.payload.company
                                ]}
                              />
                              <Bar dataKey="applicationsCount" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                                {applicationsStats.topJobs.slice(0, 10).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={`hsl(${220 - index * 15}, 70%, 50%)`} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>

                    {/* Top Jobs Table */}
                    {applicationsStats.topJobs && applicationsStats.topJobs.length > 0 && (
                      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 mb-6">
                        <h2 className="text-lg font-bold text-white mb-4">
                          Top 10 Empleos con Más Aplicaciones
                        </h2>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-800">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Puesto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Empresa
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Modalidad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Aplicaciones
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                              {applicationsStats.topJobs.map((job, index) => (
                                <tr key={job.id} className={index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800'}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    {job.title}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {job.company}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {job.job_type}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {job.modality}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-400">
                                    {job.applicationsCount}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Additional Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Users Stats */}
                      {usersStats && (
                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                          <h2 className="text-lg font-bold text-white mb-4">
                            Estadísticas de Usuarios
                          </h2>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Usuarios:</span>
                              <span className="font-semibold text-white">{usersStats.summary.total}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Verificados:</span>
                              <span className="font-semibold text-white">{usersStats.summary.verified}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Estudiantes:</span>
                              <span className="font-semibold text-white">{usersStats.summary.byRole?.estudiante || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Empresas:</span>
                              <span className="font-semibold text-white">{usersStats.summary.byRole?.empresa || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Administradores:</span>
                              <span className="font-semibold text-white">{usersStats.summary.byRole?.admin || 0}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Jobs Stats */}
                      {jobsStats && (
                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                          <h2 className="text-lg font-bold text-white mb-4">
                            Estadísticas de Empleos
                          </h2>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Empleos:</span>
                              <span className="font-semibold text-white">{jobsStats.summary.total}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Activos:</span>
                              <span className="font-semibold text-green-400">{jobsStats.summary.active}</span>
                            </div>
                            <div className="border-t border-slate-700 pt-3 mt-3">
                              <p className="text-sm font-medium text-gray-300 mb-2">Por Tipo:</p>
                              {Object.entries(jobsStats.summary.byType).map(([type, count]) => (
                                <div key={type} className="flex justify-between text-sm">
                                  <span className="text-gray-400 capitalize">{type}:</span>
                                  <span className="text-white">{count}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-slate-700 pt-3 mt-3">
                              <p className="text-sm font-medium text-gray-300 mb-2">Por Modalidad:</p>
                              {Object.entries(jobsStats.summary.byModality).map(([modality, count]) => (
                                <div key={modality} className="flex justify-between text-sm">
                                  <span className="text-gray-400 capitalize">{modality}:</span>
                                  <span className="text-white">{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {!applicationsStats && !reportsLoading && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No hay datos disponibles para mostrar</p>
                  </div>
                )}

                {reportsLoading && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando reportes...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Original Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <UserGrowthChart data={analyticsData.userGrowth} />
              <CategoryActivityChart data={analyticsData.categoryActivity} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UsersByRoleChart data={analyticsData.usersByRole} />
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Resumen de Actividad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Users className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Nuevos usuarios (30 días)</p>
                          <p className="text-xl font-bold text-white">{analyticsData.activitySummary.newUsers.count}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${analyticsData.activitySummary.newUsers.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analyticsData.activitySummary.newUsers.percentage >= 0 ? '+' : ''}{analyticsData.activitySummary.newUsers.percentage}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <BookOpen className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Cursos guardados (30 días)</p>
                          <p className="text-xl font-bold text-white">{analyticsData.activitySummary.savedCourses.count}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${analyticsData.activitySummary.savedCourses.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analyticsData.activitySummary.savedCourses.percentage >= 0 ? '+' : ''}{analyticsData.activitySummary.savedCourses.percentage}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Eventos registrados (30 días)</p>
                          <p className="text-xl font-bold text-white">{analyticsData.activitySummary.registeredEvents.count}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${analyticsData.activitySummary.registeredEvents.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analyticsData.activitySummary.registeredEvents.percentage >= 0 ? '+' : ''}{analyticsData.activitySummary.registeredEvents.percentage}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <Briefcase className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Aplicaciones enviadas (30 días)</p>
                          <p className="text-xl font-bold text-white">{analyticsData.activitySummary.applications.count}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${analyticsData.activitySummary.applications.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {analyticsData.activitySummary.applications.percentage >= 0 ? '+' : ''}{analyticsData.activitySummary.applications.percentage}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <ReportsPanel />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            {/* System Settings */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Configuración del Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Ajustes generales de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Modo de mantenimiento</p>
                      <p className="text-sm text-gray-400">Desactivar temporalmente la plataforma</p>
                    </div>
                    <Button
                      onClick={toggleMaintenanceMode}
                      disabled={maintenanceLoading}
                      variant="outline"
                      className={maintenanceMode ? "border-red-600 text-red-400 hover:bg-red-500/10" : "border-slate-600 text-gray-400"}
                    >
                      {maintenanceLoading ? 'Cargando...' : (maintenanceMode ? 'Activado' : 'Desactivado')}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Registro de nuevos usuarios</p>
                      <p className="text-sm text-gray-400">Permitir registro público</p>
                    </div>
                    <Button variant="outline" className="border-green-600 text-green-400">
                      Habilitado
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Respaldo automático</p>
                      <p className="text-sm text-gray-400">Último: Hoy a las 03:00 AM</p>
                    </div>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-black">
                      <Database className="w-4 h-4 mr-2" />
                      Crear Respaldo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Details Modal */}
      <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Detalles del Usuario
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Información completa del usuario seleccionado
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-lg">
                <UserAvatar user={selectedUser} size="lg" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{selectedUser.name || 'Sin nombre'}</h3>
                  <p className="text-gray-400">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`text-xs ${
                      selectedUser.role === 'admin' ? 'bg-red-500/20 text-red-400 border-red-400/30' :
                      selectedUser.role === 'empresa' ? 'bg-orange-500/20 text-orange-400 border-orange-400/30' :
                      'bg-cyan-500/20 text-cyan-400 border-cyan-400/30'
                    }`}>
                      {selectedUser.role}
                    </Badge>
                    <Badge className={selectedUser.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border-green-400/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-400/30'
                    }>
                      {selectedUser.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">ID:</span>
                        <span className="text-white">{selectedUser.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nombre:</span>
                        <span className="text-white">{selectedUser.name || 'No especificado'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Teléfono:</span>
                        <span className="text-white">{selectedUser.phone || 'No especificado'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Estado de la Cuenta</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Verificado:</span>
                        <span className={selectedUser.is_verified ? 'text-green-400' : 'text-red-400'}>
                          {selectedUser.is_verified ? 'Sí' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estado:</span>
                        <span className={selectedUser.status === 'active' ? 'text-green-400' : 'text-gray-400'}>
                          {selectedUser.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rol:</span>
                        <span className="text-white capitalize">{selectedUser.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Información Adicional</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Universidad:</span>
                        <span className="text-white">{selectedUser.university || 'No especificado'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Carrera:</span>
                        <span className="text-white">{selectedUser.career || 'No especificado'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Semestre:</span>
                        <span className="text-white">{selectedUser.semester || 'No especificado'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ciudad:</span>
                        <span className="text-white">{selectedUser.city || 'No especificado'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Fechas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Registro:</span>
                        <span className="text-white">
                          {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'No disponible'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Última actualización:</span>
                        <span className="text-white">
                          {selectedUser.updated_at ? new Date(selectedUser.updated_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'No disponible'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description/Bio if available */}
              {selectedUser.description && (
                <div className="p-4 bg-slate-900 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Descripción</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedUser.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => setUserModalOpen(false)}
                  className="border-slate-600 text-gray-400 hover:bg-slate-700"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setUserModalOpen(false);
                    // You could add navigation to edit user functionality here
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black"
                >
                  Editar Usuario
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={(open) => {
        setDeleteModalOpen(open);
        if (!open) {
          setUserToDelete(null);
          setDeleteConfirmText('');
        }
      }}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto m-2">
          <div className="p-4">
            <DialogHeader className="space-y-3 pb-4">
              <DialogTitle className="text-base sm:text-lg font-bold text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>Confirmar Eliminación</span>
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                Esta acción no se puede deshacer
              </DialogDescription>
            </DialogHeader>
          
          {userToDelete && (
            <div className="space-y-4">
              {/* Warning Message */}
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <UserAvatar user={userToDelete} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm break-words">{userToDelete.name || 'Usuario sin nombre'}</p>
                    <p className="text-xs text-gray-400 break-all">{userToDelete.email}</p>
                    <Badge className={`text-xs mt-1 inline-block ${
                      userToDelete.role === 'admin' ? 'bg-red-500/20 text-red-400 border-red-400/30' :
                      userToDelete.role === 'empresa' ? 'bg-orange-500/20 text-orange-400 border-orange-400/30' :
                      'bg-cyan-500/20 text-cyan-400 border-cyan-400/30'
                    }`}>
                      {userToDelete.role}
                    </Badge>
                  </div>
                </div>
                <p className="text-red-300 text-sm mb-3">
                  ¿Estás seguro de que deseas eliminar este usuario? Esta acción:
                </p>
                <ul className="list-disc text-red-300 text-sm space-y-1 ml-5">
                  <li>Eliminará permanentemente la cuenta del usuario</li>
                  <li>Eliminará todos sus datos asociados</li>
                  <li>Eliminará sus cursos guardados y aplicaciones</li>
                  <li>No se puede recuperar la información</li>
                </ul>
              </div>

              {/* Alternative Action Suggestion */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Alternativa:</strong> Considera desactivar la cuenta en lugar de eliminarla para preservar los datos.
                </p>
              </div>

              {/* Confirmation Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">
                  Para confirmar, escribe "ELIMINAR" en mayúsculas:
                </label>
                <Input
                  type="text"
                  placeholder="Escribe ELIMINAR para confirmar"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white text-sm h-10 w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setUserToDelete(null);
                    setDeleteConfirmText('');
                  }}
                  className="border-slate-600 text-gray-400 hover:bg-slate-700 text-sm h-10 flex-1 sm:flex-none sm:order-1"
                >
                  Cancelar
                </Button>
                {userToDelete?.status === 'active' && (
                  <Button
                    onClick={() => {
                      handleToggleUserStatus(userToDelete.id);
                      setDeleteModalOpen(false);
                      setUserToDelete(null);
                      setDeleteConfirmText('');
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-sm h-10 flex-1 sm:flex-none sm:order-2"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Desactivar
                  </Button>
                )}
                <Button
                  onClick={() => {
                    if (deleteConfirmText === 'ELIMINAR') {
                      confirmDeleteUser();
                      setDeleteConfirmText('');
                    } else {
                      alert('Debes escribir "ELIMINAR" para confirmar la acción');
                    }
                  }}
                  disabled={deleteConfirmText !== 'ELIMINAR'}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm h-10 flex-1 sm:flex-none sm:order-3"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
