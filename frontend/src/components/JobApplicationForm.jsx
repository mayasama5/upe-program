import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import { 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  Send,
  User,
  Mail,
  Phone,
  FileText,
  Briefcase
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export default function JobApplicationForm({ 
  isOpen, 
  onClose, 
  job, 
  user,
  onApplicationSent 
}) {
  const [formData, setFormData] = useState({
    cover_letter: '',
    contact_phone: '',
    contact_email: user?.email || '',
    linkedin_profile: '',
    portfolio_url: '',
    experience_summary: '',
    availability: 'inmediata'
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Error de autenticación",
          description: "Debes iniciar sesión para aplicar",
          variant: "destructive"
        });
        return;
      }

      // Preparar datos de la aplicación
      const applicationData = {
        cover_letter: formData.cover_letter,
        contact_info: {
          phone: formData.contact_phone,
          email: formData.contact_email,
          linkedin: formData.linkedin_profile,
          portfolio: formData.portfolio_url
        },
        experience_summary: formData.experience_summary,
        availability: formData.availability
      };

      const response = await axios.post(
        `${BACKEND_URL}/api/jobs/${job.id}/apply`,
        applicationData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      toast({
        title: "¡Aplicación enviada!",
        description: `Tu aplicación para ${job.title} ha sido enviada exitosamente`,
      });

      onClose();
      if (onApplicationSent) {
        onApplicationSent();
      }

      // Reset form
      setFormData({
        cover_letter: '',
        contact_phone: '',
        contact_email: user?.email || '',
        linkedin_profile: '',
        portfolio_url: '',
        experience_summary: '',
        availability: 'inmediata'
      });

    } catch (error) {
      console.error('Error applying to job:', error);
      
      let errorMessage = "No se pudo enviar la aplicación";
      
      if (error.response?.status === 409) {
        errorMessage = "Ya has aplicado a esta vacante anteriormente";
      } else if (error.response?.status === 404) {
        errorMessage = "Esta vacante ya no está disponible";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast({
        title: "Error al aplicar",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Send className="w-6 h-6 text-orange-400" />
            Aplicar a Vacante
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Completa tu aplicación para esta oportunidad laboral
          </DialogDescription>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-orange-400" />
                  Detalles de la Vacante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{job.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <Building className="w-4 h-4" />
                    <span>{job.company || 'Empresa'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>{job.city || job.location || 'Ubicación no especificada'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="capitalize">{job.modality}</span>
                  </div>

                  {job.salary_range && (
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <DollarSign className="w-4 h-4 text-orange-400" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                    {job.job_type}
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    {job.modality}
                  </Badge>
                </div>

                {job.description && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Descripción</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {job.description.length > 150 
                        ? `${job.description.substring(0, 150)}...` 
                        : job.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Email de Contacto *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="contact_email"
                          name="contact_email"
                          type="email"
                          value={formData.contact_email}
                          onChange={handleChange}
                          required
                          placeholder="tu@email.com"
                          className="bg-slate-700 border-slate-600 text-white pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Teléfono de Contacto *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="contact_phone"
                          name="contact_phone"
                          type="tel"
                          value={formData.contact_phone}
                          onChange={handleChange}
                          required
                          placeholder="+595 981 123456"
                          className="bg-slate-700 border-slate-600 text-white pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_profile">Perfil de LinkedIn</Label>
                      <Input
                        id="linkedin_profile"
                        name="linkedin_profile"
                        type="url"
                        value={formData.linkedin_profile}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/tu-perfil"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolio_url">Portfolio/CV Online</Label>
                      <Input
                        id="portfolio_url"
                        name="portfolio_url"
                        type="url"
                        value={formData.portfolio_url}
                        onChange={handleChange}
                        placeholder="https://tu-portfolio.com"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-400" />
                    Información Profesional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience_summary">Resumen de Experiencia</Label>
                    <Textarea
                      id="experience_summary"
                      name="experience_summary"
                      value={formData.experience_summary}
                      onChange={handleChange}
                      placeholder="Describe brevemente tu experiencia relevante, habilidades técnicas y logros destacados..."
                      rows={4}
                      className="bg-slate-700 border-slate-600 text-white resize-none"
                    />
                    <p className="text-xs text-gray-400">
                      Menciona tecnologías, proyectos y experiencia relevante para esta posición
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Disponibilidad para Iniciar</Label>
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="inmediata">Inmediata</option>
                      <option value="1_semana">En 1 semana</option>
                      <option value="2_semanas">En 2 semanas</option>
                      <option value="1_mes">En 1 mes</option>
                      <option value="a_convenir">A convenir</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" />
                    Carta de Presentación *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Textarea
                      id="cover_letter"
                      name="cover_letter"
                      value={formData.cover_letter}
                      onChange={handleChange}
                      required
                      placeholder="Explica por qué eres el candidato ideal para esta posición. Menciona tu motivación, experiencia relevante y lo que puedes aportar a la empresa..."
                      rows={6}
                      className="bg-slate-700 border-slate-600 text-white resize-none"
                    />
                    <p className="text-xs text-gray-400">
                      Mínimo 100 caracteres. Sé específico sobre tu interés en esta posición.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-slate-600 text-gray-300"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.cover_letter || formData.cover_letter.length < 100}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {loading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Aplicación
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}