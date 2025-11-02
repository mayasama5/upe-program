import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export default function CreateEventButton({ onEventCreated, inline = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    is_online: true,
    category: 'tech',
    url: '',
    image_url: ''
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/events`, formData);

      toast({
        title: "Evento creado",
        description: "El evento ha sido publicado exitosamente",
      });

      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        is_online: true,
        category: 'tech',
        url: '',
        image_url: ''
      });

      if (onEventCreated) {
        onEventCreated(response.data.event);
      }

    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo crear el evento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={inline ?
          "bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-xs px-4 py-2 flex items-center gap-1" :
          "fixed bottom-6 right-6 h-14 px-6 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-full shadow-lg z-50 flex items-center gap-2"
        }
      >
        <Plus className={inline ? "w-3 h-3" : "w-5 h-5"} />
        {inline ? "Crear" : "Crear Evento"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Publicar Nuevo Evento</DialogTitle>
            <DialogDescription className="text-gray-400">
              Completa los detalles del evento
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Evento *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Webinar de React Avanzado"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe el evento, agenda, temas a tratar, etc."
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_date">Fecha y Hora *</Label>
                <Input
                  id="event_date"
                  name="event_date"
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tecnología</SelectItem>
                    <SelectItem value="business">Negocios</SelectItem>
                    <SelectItem value="design">Diseño</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Ej: Zoom, Asunción - Centro de Convenciones"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_online"
                name="is_online"
                checked={formData.is_online}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
              />
              <Label htmlFor="is_online" className="cursor-pointer">
                Evento en línea
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL del Evento *</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://zoom.us/j/123456 o https://evento.com"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL de Imagen (opcional)</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-slate-700 text-gray-300"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 text-black"
              >
                {loading ? 'Publicando...' : 'Publicar Evento'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
