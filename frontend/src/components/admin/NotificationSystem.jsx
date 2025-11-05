import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Bell, Send, AlertCircle, Info, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';
import { getBackendUrl } from '../../config';

const BACKEND_URL = getBackendUrl();

export default function NotificationSystem() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    target_users: 'all'
  });

  useEffect(() => {
    fetchNotifications();
    // Polling cada 30 segundos para actualizar notificaciones
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/notifications`, {
        withCredentials: true
      });

      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/notifications`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Agregar la notificación a la lista
        setNotifications([response.data.notification, ...notifications]);

        toast({
          title: 'Notificación enviada',
          description: `Notificación enviada a: ${formData.target_users === 'all' ? 'todos los usuarios' : formData.target_users}`
        });

        setIsDialogOpen(false);
        setFormData({
          title: '',
          message: '',
          type: 'info',
          target_users: 'all'
        });
      }
    } catch (error) {
      console.error('Error creating notification:', error);

      let errorMessage = 'Error al enviar notificación';

      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.data?.errors) {
          errorMessage = error.response.data.errors.map(e => e.message).join(', ');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return `Hace ${diffDays} días`;
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas de notificaciones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">No leídas</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {notifications.filter(n => !n.read).length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Errores</p>
                <p className="text-2xl font-bold text-red-400">
                  {notifications.filter(n => n.type === 'error').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Advertencias</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {notifications.filter(n => n.type === 'warning').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de notificaciones */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Notificaciones del Sistema</CardTitle>
              <CardDescription className="text-gray-400">
                Alertas y eventos importantes
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Notificación
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Cargando notificaciones...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No hay notificaciones</div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 bg-slate-900 rounded-lg border-l-4 ${getNotificationBorderColor(notification.type)} ${
                      !notification.read ? 'border border-slate-600' : 'border border-slate-700'
                    } transition-all hover:border-cyan-500/50`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-white font-medium">{notification.title}</h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {formatTime(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={
                              notification.type === 'error' ? 'text-red-400 border-red-400/30' :
                              notification.type === 'warning' ? 'text-yellow-400 border-yellow-400/30' :
                              notification.type === 'success' ? 'text-green-400 border-green-400/30' :
                              'text-blue-400 border-blue-400/30'
                            }
                          >
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30">
                              Nueva
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear notificación */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Crear Nueva Notificación</DialogTitle>
            <DialogDescription className="text-gray-400">
              Envía una notificación a los usuarios del sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateNotification}>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-300">Mensaje (mínimo 10 caracteres)</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  rows={4}
                  placeholder="Escribe un mensaje descriptivo (mínimo 10 caracteres)"
                  minLength={10}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Información</SelectItem>
                      <SelectItem value="success">Éxito</SelectItem>
                      <SelectItem value="warning">Advertencia</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Destinatarios</Label>
                  <Select
                    value={formData.target_users}
                    onValueChange={(value) => setFormData({ ...formData, target_users: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="estudiante">Solo Estudiantes</SelectItem>
                      <SelectItem value="empresa">Solo Empresas</SelectItem>
                      <SelectItem value="admin">Solo Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-black">
                <Send className="w-4 h-4 mr-2" />
                Enviar Notificación
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
