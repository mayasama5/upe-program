import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import Header from '../components/Header';
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
  Briefcase,
  ArrowLeft,
  Upload,
  ExternalLink,
  Calendar
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export default function JobApplicationPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  
  const [formData, setFormData] = useState({
    cover_letter: '',
    contact_phone: '',
    contact_email: user?.email || '',
    linkedin_profile: '',
    portfolio_url: '',
    experience_summary: '',
    availability: 'inmediata',
    motivation: '',
    skills: '',
    salary_expectation: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'estudiante') {
      navigate('/');
      return;
    }
    fetchJobDetails();
  }, [jobId, user, navigate]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${BACKEND_URL}/api/jobs/${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      setJob(response.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
      
      // Si la API falla, intentar usar datos mock para IDs específicos
      const mockJobs = {
        1: {
          id: 1,
          title: "Desarrollador Full Stack Senior",
          company: "Tech Solutions Paraguay",
          company_name: "Tech Solutions Paraguay",
          description: "Buscamos un desarrollador full stack con experiencia en React, Node.js y bases de datos.",
          location: "Asunción, Paraguay",
          job_type: "Tiempo completo",
          modality: "Híbrido",
          salary_min: 8000000,
          salary_max: 12000000,
          requirements: "React/Next.js, Node.js, PostgreSQL, Git, 3+ años experiencia"
        },
        2: {
          id: 2,
          title: "DevOps Engineer",
          company: "Tech Solutions Paraguay",
          company_name: "Tech Solutions Paraguay",
          description: "Responsable de la automatización y gestión de infraestructura cloud.",
          location: "Asunción, Paraguay",
          job_type: "Tiempo completo",
          modality: "Remoto",
          salary_min: 10000000,
          salary_max: 15000000,
          requirements: "AWS/Azure, Docker, Kubernetes, Terraform, CI/CD"
        },
        3: {
          id: 3,
          title: "UX/UI Designer",
          company: "Tech Solutions Paraguay",
          company_name: "Tech Solutions Paraguay",
          description: "Diseñador con experiencia en crear interfaces intuitivas y experiencias de usuario excepcionales.",
          location: "Asunción, Paraguay",
          job_type: "Tiempo completo",
          modality: "Presencial",
          salary_min: 6000000,
          salary_max: 9000000,
          requirements: "Figma, Adobe Creative Suite, Prototipado, User Research, 2+ años experiencia"
        },
        4: {
          id: 4,
          title: "Especialista en Social Media",
          company: "Digital Marketing Pro",
          company_name: "Digital Marketing Pro",
          description: "Gestión de redes sociales y creación de contenido para múltiples clientes.",
          location: "Ciudad del Este, Paraguay",
          job_type: "Tiempo completo",
          modality: "Híbrido",
          salary_min: 4500000,
          salary_max: 6500000,
          requirements: "Gestión RRSS, Canva/Photoshop, Analytics, Copywriting, 1+ años experiencia"
        },
        5: {
          id: 5,
          title: "SEO Specialist",
          company: "Digital Marketing Pro",
          company_name: "Digital Marketing Pro",
          description: "Optimización SEO para sitios web de clientes y estrategias de posicionamiento.",
          location: "Ciudad del Este, Paraguay",
          job_type: "Medio tiempo",
          modality: "Remoto",
          salary_min: 3000000,
          salary_max: 4500000,
          requirements: "SEO Técnico, Google Analytics, Keyword Research, Link Building, 2+ años experiencia"
        }
      };

      const mockJob = mockJobs[jobId];
      if (mockJob) {
        console.log('Using mock job data for ID:', jobId);
        setJob(mockJob);
      } else {
        toast({
          title: "Error",
          description: "No se pudo cargar la información de la vacante",
          variant: "destructive"
        });
        navigate('/jobs');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Formato de archivo incorrecto",
          description: "Solo se permiten archivos PDF",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast({
          title: "Archivo muy grande",
          description: "El archivo no puede superar los 10MB",
          variant: "destructive"
        });
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      
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
        availability: formData.availability,
        additional_info: {
          motivation: formData.motivation,
          skills: formData.skills,
          salary_expectation: formData.salary_expectation
        }
      };

      // Si hay un CV, subirlo primero
      if (cvFile) {
        const cvFormData = new FormData();
        cvFormData.append('cv', cvFile);
        
        try {
          await axios.post(
            `${BACKEND_URL}/api/users/cv`,
            cvFormData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              },
              withCredentials: true
            }
          );
        } catch (cvError) {
          console.error('Error uploading CV:', cvError);
          // Continuar sin CV si falla la subida
        }
      }

      // Enviar aplicación
      await axios.post(
        `${BACKEND_URL}/api/jobs/${jobId}/apply`,
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
        title: "¡Aplicación enviada exitosamente!",
        description: `Tu aplicación para ${job.title} ha sido enviada. La empresa podrá revisar tu perfil y contactarte.`,
      });

      // Notificar a otras páginas que se actualizaron las aplicaciones
      localStorage.setItem('applicationsUpdated', Date.now().toString());
      window.dispatchEvent(new Event('applicationsUpdated'));

      navigate('/jobs');

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
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header user={user} logout={logout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header user={user} logout={logout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Vacante no encontrada</h2>
            <Button onClick={() => navigate('/jobs')} className="bg-cyan-500 hover:bg-cyan-600 text-black">
              Ver Todas las Vacantes
            </Button>
          </div>
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
          <Button 
            variant="ghost" 
            onClick={() => navigate('/jobs')}
            className="text-cyan-400 hover:text-cyan-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Vacantes
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Aplicar a Vacante</h1>
            <p className="text-gray-400">Completa tu aplicación para esta oportunidad laboral</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-orange-400" />
                  {job.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Building className="w-4 h-4" />
                  <span>{job.company || 'Empresa'}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>{job.city || job.location || 'Ubicación no especificada'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="capitalize">{job.modality}</span>
                  </div>

                  {job.salary_range && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <DollarSign className="w-4 h-4 text-orange-400" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span>Publicado el {new Date(job.created_at).toLocaleDateString('es-ES')}</span>
                  </div>
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
                      {job.description}
                    </p>
                  </div>
                )}

                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Requisitos</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
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

              {/* CV Upload */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-purple-400" />
                    Curriculum Vitae
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                      {cvFile ? (
                        <div className="space-y-2">
                          <FileText className="w-8 h-8 text-green-400 mx-auto" />
                          <p className="text-white font-medium">{cvFile.name}</p>
                          <p className="text-gray-400 text-sm">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCvFile(null)}
                            className="border-slate-600 text-gray-300"
                          >
                            Cambiar archivo
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <p className="text-white">Sube tu CV en formato PDF</p>
                          <p className="text-gray-400 text-sm">Máximo 10MB</p>
                          <label htmlFor="cv-upload" className="cursor-pointer">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="border-slate-600 text-gray-300"
                              onClick={() => document.getElementById('cv-upload').click()}
                            >
                              Seleccionar archivo
                            </Button>
                          </label>
                        </div>
                      )}
                      <input
                        id="cv-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Habilidades y Tecnologías</Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="Menciona las tecnologías, herramientas y habilidades que dominas..."
                      rows={3}
                      className="bg-slate-700 border-slate-600 text-white resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                      <Label htmlFor="salary_expectation">Expectativa Salarial (opcional)</Label>
                      <Input
                        id="salary_expectation"
                        name="salary_expectation"
                        value={formData.salary_expectation}
                        onChange={handleChange}
                        placeholder="Gs. 4.000.000"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Motivation and Cover Letter */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" />
                    Motivación y Carta de Presentación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="motivation">¿Por qué te interesa esta posición? *</Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      required
                      placeholder="Explica qué te motiva a aplicar a esta posición específica..."
                      rows={3}
                      className="bg-slate-700 border-slate-600 text-white resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover_letter">Carta de Presentación *</Label>
                    <Textarea
                      id="cover_letter"
                      name="cover_letter"
                      value={formData.cover_letter}
                      onChange={handleChange}
                      required
                      placeholder="Preséntate profesionalmente. Menciona tu experiencia relevante, logros y lo que puedes aportar a la empresa..."
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
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/jobs')}
                  className="flex-1 border-slate-600 text-gray-300"
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !formData.cover_letter || formData.cover_letter.length < 100}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {submitting ? (
                    "Enviando aplicación..."
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
      </div>
    </div>
  );
}