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

export default function CreateJobButton({ onJobCreated, inline = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    modality: 'remoto',
    job_type: 'junior',
    seniority_level: 'Junior',
    skills_stack: '',
    city: '',
    country: 'Paraguay',
    salary_range: '',
    apply_type: 'externo',
    apply_url: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      // Preparar datos
      const jobData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        skills_stack: formData.skills_stack.split(',').map(s => s.trim()).filter(s => s)
      };

      const response = await axios.post(`${BACKEND_URL}/api/jobs`, jobData);

      toast({
        title: "Vacante creada",
        description: "La vacante ha sido publicada exitosamente",
      });

      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        requirements: '',
        modality: 'remoto',
        job_type: 'junior',
        seniority_level: 'Junior',
        skills_stack: '',
        city: '',
        country: 'Paraguay',
        salary_range: '',
        apply_type: 'externo',
        apply_url: ''
      });

      if (onJobCreated) {
        onJobCreated(response.data.job);
      }

    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo crear la vacante",
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
          "bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-4 py-2 flex items-center gap-1" :
          "fixed bottom-6 right-6 h-14 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg z-50 flex items-center gap-2"
        }
      >
        <Plus className={inline ? "w-3 h-3" : "w-5 h-5"} />
        {inline ? "Crear" : "Crear Vacante"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Publicar Nueva Vacante</DialogTitle>
            <DialogDescription className="text-gray-400">
              Completa los detalles de la vacante laboral
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Vacante *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Desarrollador Full Stack"
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
                placeholder="Describe la posición, responsabilidades, etc."
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidad *</Label>
                <Select value={formData.modality} onValueChange={(value) => handleSelectChange('modality', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remoto">Remoto</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_type">Tipo de Trabajo *</Label>
                <Select value={formData.job_type} onValueChange={(value) => handleSelectChange('job_type', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practica">Práctica</SelectItem>
                    <SelectItem value="pasantia">Pasantía</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="medio">Semi-Senior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requisitos (uno por línea)</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={3}
                placeholder="Licenciatura en Informática&#10;2+ años de experiencia&#10;Inglés intermedio"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills_stack">Tecnologías (separadas por comas)</Label>
              <Input
                id="skills_stack"
                name="skills_stack"
                value={formData.skills_stack}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Asunción"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range">Rango Salarial</Label>
                <Input
                  id="salary_range"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  placeholder="$30,000 - $50,000"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apply_url">URL para Aplicar *</Label>
              <Input
                id="apply_url"
                name="apply_url"
                type="url"
                value={formData.apply_url}
                onChange={handleChange}
                required
                placeholder="https://ejemplo.com/aplicar"
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
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loading ? 'Publicando...' : 'Publicar Vacante'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
