import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, User, Building2, MapPin, Mail, Phone, Filter, Grid, List } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/api/admin/users`, {
        withCredentials: true
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleUserClick = (user) => {
    if (user.role === 'estudiante') {
      navigate(`/user/student/${user.id}`);
    } else if (user.role === 'empresa') {
      navigate(`/user/company/${user.id}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Lista de Usuarios</h1>
          <p className="text-blue-100">
            Gestiona y visualiza todos los usuarios registrados en la plataforma
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, email o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-800 border-slate-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="estudiante">Estudiantes</SelectItem>
                  <SelectItem value="empresa">Empresas</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="bg-slate-700 hover:bg-slate-600"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="bg-slate-700 hover:bg-slate-600"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-gray-400">
            <span>Total: {filteredUsers.length} usuarios</span>
            <span>Estudiantes: {filteredUsers.filter(u => u.role === 'estudiante').length}</span>
            <span>Empresas: {filteredUsers.filter(u => u.role === 'empresa').length}</span>
          </div>
        </div>

        {/* Users Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map(user => (
              <Card 
                key={user.id} 
                className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer hover:scale-105"
                onClick={() => handleUserClick(user)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.role === 'empresa' ? (
                        <Building2 className="w-6 h-6" />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <Badge variant={user.role === 'empresa' ? 'default' : 'secondary'} className="text-xs">
                      {user.role === 'empresa' ? 'Empresa' : user.role === 'estudiante' ? 'Estudiante' : 'Admin'}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-sm leading-tight">
                    {user.role === 'empresa' ? user.company_name : `${user.first_name || ''} ${user.last_name || ''}`.trim()}
                  </CardTitle>
                  {user.email && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="space-y-2 text-xs">
                    {user.career && (
                      <div className="text-cyan-400 font-medium">{user.career}</div>
                    )}
                    {user.industry && (
                      <div className="text-orange-400 font-medium">{user.industry}</div>
                    )}
                    {(user.city || user.location) && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{user.city || user.location}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <Phone className="w-3 h-3" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.created_at && (
                      <div className="text-gray-500 text-xs">
                        Registrado: {formatDate(user.created_at)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map(user => (
              <Card 
                key={user.id} 
                className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user.role === 'empresa' ? (
                        <Building2 className="w-6 h-6" />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium text-sm truncate">
                          {user.role === 'empresa' ? user.company_name : `${user.first_name || ''} ${user.last_name || ''}`.trim()}
                        </h3>
                        <Badge variant={user.role === 'empresa' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                          {user.role === 'empresa' ? 'Empresa' : user.role === 'estudiante' ? 'Estudiante' : 'Admin'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-400">
                        {user.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        )}
                        {(user.city || user.location) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{user.city || user.location}</span>
                          </div>
                        )}
                        {user.created_at && (
                          <div className="text-gray-500">
                            Registrado: {formatDate(user.created_at)}
                          </div>
                        )}
                      </div>
                      {(user.career || user.industry) && (
                        <div className="mt-2 text-xs">
                          {user.career && <span className="text-cyan-400 font-medium">{user.career}</span>}
                          {user.industry && <span className="text-orange-400 font-medium">{user.industry}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No se encontraron usuarios</h3>
            <p className="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;