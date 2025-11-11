import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
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
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export default function ContentManagement({ type }) {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchItems();
  }, [type]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/admin/content/${type}`, {
        withCredentials: true
      });
      setItems(response.data[type] || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar contenido',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(getEmptyForm());
    setIsDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/admin/content/${type}/${id}`, {
        withCredentials: true
      });
      toast({
        title: 'Éxito',
        description: 'Elemento eliminado correctamente'
      });
      fetchItems();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar elemento',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await axios.put(
          `${BACKEND_URL}/api/admin/content/${type}/${editingItem.id}`,
          formData,
          { withCredentials: true }
        );
        toast({
          title: 'Éxito',
          description: 'Elemento actualizado correctamente'
        });
      } else {
        await axios.post(
          `${BACKEND_URL}/api/admin/content/${type}`,
          formData,
          { withCredentials: true }
        );
        toast({
          title: 'Éxito',
          description: 'Elemento creado correctamente'
        });
      }
      setIsDialogOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving content:', error.response?.data || error);
      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        : error.response?.data?.message || 'Error al guardar elemento';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const getEmptyForm = () => {
    switch (type) {
      case 'courses':
        return {
          title: '',
          description: '',
          provider: '',
          url: '',
          language: 'es',
          has_spanish_subtitles: true,
          category: '',
          is_free: true,
          image_url: ''
        };
      case 'events':
        return {
          title: '',
          description: '',
          organizer: '',
          url: '',
          event_date: '',
          location: '',
          is_online: true,
          category: '',
          image_url: ''
        };
      case 'jobs':
        return {
          title: '',
          description: '',
          company: '',
          location: '',
          job_type: 'junior',
          modality: 'presencial',
          salary_range: '',
          requirements: [],
          responsibilities: [],
          benefits: [],
          apply_type: 'externo',
          external_url: '',
          is_active: true,
          category: 'Tecnología'
        };
      case 'news':
        return {
          title: '',
          excerpt: '',
          content: '',
          category: 'Educación',
          image_url: '',
          author: 'TechHub UPE',
          is_published: true
        };
      default:
        return {};
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'courses':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-900 border-slate-700"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-900 border-slate-700"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Proveedor</Label>
                <Input
                  value={formData.provider || ''}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
              <div>
                <Label>Categoría</Label>
                <Input
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>
            <div>
              <Label>URL del Curso</Label>
              <Input
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="bg-slate-900 border-slate-700"
              />
            </div>
            <div>
              <Label>URL de Imagen</Label>
              <Input
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-slate-900 border-slate-700"
              />
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título del Evento</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-900 border-slate-700"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-900 border-slate-700"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Organizador</Label>
                <Input
                  value={formData.organizer || ''}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
              <div>
                <Label>Categoría</Label>
                <Input
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha del Evento</Label>
                <Input
                  type="datetime-local"
                  value={formData.event_date || ''}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
              <div>
                <Label>Ubicación</Label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>
            <div>
              <Label>URL de Registro</Label>
              <Input
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="bg-slate-900 border-slate-700"
              />
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título del Puesto</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-900 border-slate-700"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-900 border-slate-700"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Empresa</Label>
                <Input
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
              <div>
                <Label>Ubicación</Label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select
                  value={formData.job_type || 'junior'}
                  onValueChange={(value) => setFormData({ ...formData, job_type: value })}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practica">Práctica</SelectItem>
                    <SelectItem value="pasantia">Pasantía</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="medio">Medio</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Modalidad</Label>
                <Select
                  value={formData.modality || 'presencial'}
                  onValueChange={(value) => setFormData({ ...formData, modality: value })}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remoto">Remoto</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rango Salarial</Label>
                <Input
                  value={formData.salary_range || ''}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                  placeholder="Ej: Gs. 5M - 8M"
                />
              </div>
            </div>
            <div>
              <Label>Categoría</Label>
              <Input
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-slate-900 border-slate-700"
                placeholder="Ej: Tecnología"
              />
            </div>
            <div>
              <Label>URL de Aplicación</Label>
              <Input
                value={formData.external_url || ''}
                onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                className="bg-slate-900 border-slate-700"
              />
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título de la Noticia</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-900 border-slate-700"
                required
                placeholder="Mínimo 3 caracteres"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.title || '').length}/200 caracteres
              </p>
            </div>
            <div>
              <Label>Extracto (resumen breve)</Label>
              <Textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="bg-slate-900 border-slate-700"
                rows={2}
                required
                placeholder="Mínimo 10 caracteres"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.excerpt || '').length}/500 caracteres (mínimo 10)
              </p>
            </div>
            <div>
              <Label>Contenido Completo</Label>
              <Textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="bg-slate-900 border-slate-700"
                rows={6}
                required
                placeholder="Mínimo 20 caracteres"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.content || '').length}/10000 caracteres (mínimo 20)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoría</Label>
                <Select
                  value={formData.category || 'Educación'}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Educación">Educación</SelectItem>
                    <SelectItem value="Becas">Becas</SelectItem>
                    <SelectItem value="Empleo">Empleo</SelectItem>
                    <SelectItem value="Eventos">Eventos</SelectItem>
                    <SelectItem value="Comunidad">Comunidad</SelectItem>
                    <SelectItem value="Certificaciones">Certificaciones</SelectItem>
                    <SelectItem value="Universidad">Universidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Autor</Label>
                <Input
                  value={formData.author || 'TechHub UPE'}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>
            <div>
              <Label>URL de Imagen</Label>
              <Input
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-slate-900 border-slate-700"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published !== false}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="is_published">Publicar noticia</Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderItem = (item) => {
    switch (type) {
      case 'courses':
        return (
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all">
            <div className="flex-1">
              <h3 className="text-white font-medium">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.provider} • {item.category}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={item.is_free ? 'default' : 'secondary'} className="bg-green-500/20 text-green-400">
                  {item.is_free ? 'Gratis' : 'Pago'}
                </Badge>
                <Badge variant="outline" className="text-gray-400">
                  {item.language}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all">
            <div className="flex-1">
              <h3 className="text-white font-medium">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.organizer}</p>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.event_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.is_online ? 'Online' : item.location}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all">
            <div className="flex-1">
              <h3 className="text-white font-medium">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.company} • {item.location}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                  {item.job_type}
                </Badge>
                <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                  {item.modality}
                </Badge>
                {item.salary_range && (
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {item.salary_range}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all">
            <div className="flex-1">
              <h3 className="text-white font-medium">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.category} • {item.author}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.excerpt}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={item.is_published ? 'default' : 'secondary'} className={item.is_published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                  {item.is_published ? 'Publicado' : 'Borrador'}
                </Badge>
                <Badge variant="outline" className="text-gray-400">
                  {new Date(item.published_at || item.created_at).toLocaleDateString('es-ES')}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">
                Gestión de {type === 'courses' ? 'Cursos' : type === 'events' ? 'Eventos' : type === 'jobs' ? 'Vacantes' : 'Noticias'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {items.length} elementos en total
              </CardDescription>
            </div>
            <Button onClick={handleCreate} className="bg-cyan-500 hover:bg-cyan-600 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Nuevo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Cargando...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No hay elementos</div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id}>
                  {renderItem(item)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingItem ? 'Editar' : 'Crear Nuevo'} {type === 'courses' ? 'Curso' : type === 'events' ? 'Evento' : type === 'jobs' ? 'Vacante' : 'Noticia'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Completa la información requerida
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {renderForm()}
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-black">
                {editingItem ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
