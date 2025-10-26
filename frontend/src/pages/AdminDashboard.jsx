import React, { useState, useEffect } from 'react';
import { useClerkAuth } from '../hooks/useClerkAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
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
  FolderOpen
} from 'lucide-react';
import Header from '../components/Header';
import ContentManagement from '../components/admin/ContentManagement';
import NotificationSystem from '../components/admin/NotificationSystem';
import ReportsPanel from '../components/admin/ReportsPanel';
import { UserGrowthChart, CategoryActivityChart, UsersByRoleChart } from '../components/admin/AdminCharts';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export default function AdminDashboard() {
  const { user, loading } = useClerkAuth();
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
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    categoryActivity: { courses: 0, events: 0, jobs: 0 },
    usersByRole: []
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchStats();
      fetchUsers();
      fetchLogs();
      fetchAnalytics();
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
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Datos mock como fallback
      setAnalyticsData({
        userGrowth: [{ month: 1, year: 2025, count: 0 }],
        categoryActivity: { courses: 0, events: 0, jobs: 0 },
        usersByRole: [{ role: 'estudiante', count: 0 }]
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchUsers(), fetchLogs(), fetchAnalytics()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const response = await axios.delete(`${BACKEND_URL}/api/admin/users/${userId}`, {
          withCredentials: true
        });

        if (response.data.success) {
          setUsers(users.filter(u => u.id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar usuario');
      }
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
      <Header user={user} logout={null} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              Panel de Administración
            </h1>
            <p className="text-gray-400 mt-2">Gestión completa del sistema UPE</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-cyan-500 hover:bg-cyan-600 text-black"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              <Users className="w-4 h-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              <FolderOpen className="w-4 h-4 mr-2" />
              Contenido
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              <Bell className="w-4 h-4 mr-2" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              <FileText className="w-4 h-4 mr-2" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              <Download className="w-4 h-4 mr-2" />
              Reportes
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Gestión de Usuarios</CardTitle>
                    <CardDescription className="text-gray-400">
                      Administra todos los usuarios de la plataforma
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-700 text-white w-64"
                      />
                    </div>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-black">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className={
                          user.role === 'admin' ? 'text-red-400 border-red-400/30' :
                          user.role === 'empresa' ? 'text-orange-400 border-orange-400/30' :
                          'text-cyan-400 border-cyan-400/30'
                        }>
                          {user.role}
                        </Badge>

                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border-green-400/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-400/30'
                        }>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>

                        <span className="text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </span>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="text-gray-400 hover:text-white"
                          >
                            {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-cyan-400"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
            </Tabs>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSystem />
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Logs del Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Registro de actividad y eventos del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="p-4 bg-slate-900 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getLogLevelColor(log.level)}>
                                {log.level.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-gray-400 border-gray-600">
                                {log.type}
                              </Badge>
                            </div>
                            <p className="text-white text-sm">{log.message}</p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
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
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          <p className="text-xl font-bold text-white">267</p>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm font-medium">+23%</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <BookOpen className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Cursos guardados (30 días)</p>
                          <p className="text-xl font-bold text-white">450</p>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm font-medium">+15%</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Eventos registrados (30 días)</p>
                          <p className="text-xl font-bold text-white">320</p>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm font-medium">+12%</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <Briefcase className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Aplicaciones enviadas (30 días)</p>
                          <p className="text-xl font-bold text-white">180</p>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm font-medium">+8%</div>
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
                    <Button variant="outline" className="border-slate-600 text-gray-400">
                      Desactivado
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
    </div>
  );
}
