import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import axios from 'axios';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase,
  FileText,
  Star,
  Clock,
  ExternalLink
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      const [studentResponse, applicationsResponse] = await Promise.all([
        axios.get(`${API}/api/admin/users/${id}`, { withCredentials: true }),
        axios.get(`${API}/api/admin/users/${id}/applications`, { withCredentials: true })
      ]);
      
      setStudent(studentResponse.data.user);
      setApplications(applicationsResponse.data.applications || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Cargando perfil del estudiante...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-xl mb-4">Estudiante no encontrado</h2>
          <Button onClick={() => navigate('/users')} className="bg-cyan-600 hover:bg-cyan-700">
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Button 
            onClick={() => navigate('/users')} 
            variant="ghost" 
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la lista
          </Button>
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {`${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Sin nombre'}
              </h1>
              <div className="flex items-center gap-4 text-blue-100">
                <Badge className="bg-green-500/20 text-green-200 border-green-400">
                  Estudiante
                </Badge>
                {student.career && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {student.career}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{student.email}</span>
                  </div>
                )}
                {student.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{student.phone}</span>
                  </div>
                )}
                {(student.city || student.location) && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{student.city || student.location}</span>
                  </div>
                )}
                {student.created_at && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      Registrado: {formatDate(student.created_at)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Academic Information */}
            {(student.career || student.university || student.graduation_year) && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Información Académica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {student.career && (
                    <div>
                      <span className="text-gray-400 text-sm">Carrera:</span>
                      <p className="text-white">{student.career}</p>
                    </div>
                  )}
                  {student.university && (
                    <div>
                      <span className="text-gray-400 text-sm">Universidad:</span>
                      <p className="text-white">{student.university}</p>
                    </div>
                  )}
                  {student.graduation_year && (
                    <div>
                      <span className="text-gray-400 text-sm">Año de graduación:</span>
                      <p className="text-white">{student.graduation_year}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {student.skills && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Habilidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.split(',').map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Applications and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio/Description */}
            {student.description && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Descripción Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{student.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Applications */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Postulaciones ({applications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app, index) => (
                      <div key={index} className="border border-slate-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">
                              {app.job_title || 'Título no disponible'}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {app.company_name || 'Empresa no disponible'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              variant={app.status === 'aceptado' ? 'default' : 'secondary'}
                              className={
                                app.status === 'aceptado' ? 'bg-green-500/20 text-green-400' :
                                app.status === 'rechazado' ? 'bg-red-500/20 text-red-400' :
                                app.status === 'en_revision' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                              }
                            >
                              {app.status === 'aceptado' ? 'Aceptado' :
                               app.status === 'rechazado' ? 'Rechazado' :
                               app.status === 'en_revision' ? 'En revisión' :
                               'Nuevo'}
                            </Badge>
                            {app.created_at && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(app.created_at)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {app.cover_letter && (
                          <div className="mt-3 p-3 bg-slate-700/50 rounded">
                            <span className="text-gray-400 text-xs block mb-1">Carta de presentación:</span>
                            <p className="text-gray-300 text-sm line-clamp-3">{app.cover_letter}</p>
                          </div>
                        )}
                        
                        {app.availability && (
                          <div className="mt-2">
                            <span className="text-gray-400 text-xs">Disponibilidad: </span>
                            <span className="text-cyan-400 text-sm capitalize">{app.availability}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No ha realizado postulaciones aún</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;