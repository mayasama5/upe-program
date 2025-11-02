import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' :
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');
const API = BACKEND_URL;

export default function PublicCourses() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [savedItems, setSavedItems] = useState({ courses: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchSavedItems();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(course => course.category === selectedCategory));
    }
  }, [courses, selectedCategory]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/api/courses?limit=20`);
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Si falla el API, generar datos de ejemplo
      const mockCourses = generateMockCourses();
      setCourses(mockCourses);
    }
    setLoading(false);
  };

  const generateMockCourses = () => {
    const categories = ["Tecnología", "Marketing", "Diseño", "Administración", "Recursos Humanos", "Contabilidad", "Idiomas", "Gestión de Empresas"];
    const providers = ["Coursera", "edX", "Udemy", "Platzi", "Domestika", "LinkedIn Learning", "Google", "Microsoft", "IBM"];
    const titles = [
      "Fundamentos de Programación en Python",
      "Marketing Digital Avanzado",
      "Diseño UX/UI Profesional",
      "Gestión de Proyectos con Metodologías Ágiles",
      "Excel Avanzado para Negocios",
      "Inglés de Negocios Nivel Intermedio",
      "Análisis de Datos con Power BI",
      "Desarrollo Web Full Stack",
      "Estrategias de Social Media Marketing",
      "Diseño Gráfico con Adobe Photoshop",
      "Finanzas para No Financieros",
      "Liderazgo y Gestión de Equipos",
      "React JS - Desarrollo Frontend",
      "Google Ads y SEO Avanzado",
      "Ilustración Digital",
      "Contabilidad Financiera Básica",
      "Gestión de Recursos Humanos",
      "Python para Data Science",
      "Email Marketing Efectivo",
      "After Effects para Principiantes",
      "Finanzas Personales",
      "Comunicación Efectiva en Equipos",
      "Node.js y Express Backend",
      "Instagram Marketing",
      "Diseño de Logos y Branding",
      "Auditoría Interna",
      "Desarrollo de Talento Humano",
      "Machine Learning con Python",
      "Content Marketing",
      "Animación 3D con Blender",
      "Gestión Empresarial",
      "Psicología Organizacional",
      "TypeScript Avanzado",
      "Facebook Ads",
      "Portfolio Design",
      "Tributación Empresarial",
      "Clima Laboral",
      "Deep Learning",
      "Growth Hacking",
      "UI Design Systems"
    ];

    return titles.map((title, index) => ({
      id: index + 1,
      title: title,
      description: `Aprende ${title.toLowerCase()} desde cero hasta nivel avanzado. Curso completo con ejercicios prácticos y certificado al finalizar.`,
      category: categories[index % categories.length],
      provider: providers[index % providers.length],
      url: `https://ejemplo.com/curso-${index + 1}`,
      created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  const fetchSavedItems = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/api/saved-items`, { withCredentials: true });
      const data = response.data || {};
      const savedArray = data.saved_items || [];
      const grouped = { courses: [] };
      if (Array.isArray(savedArray)) {
        savedArray.forEach(si => {
          if (si.item_type === 'course') {
            if (si.course) grouped.courses.push(si.course);
            else if (si.course_id) grouped.courses.push({ id: si.course_id });
          }
        });
      }
      setSavedItems(grouped);
    } catch (error) {
      console.error('Error fetching saved items:', error);
    }
  }, []);

  const handleSaveItem = useCallback(async (itemId, itemType, itemData) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar cursos",
        variant: "destructive"
      });
      return;
    }

    try {
      await axios.post(`${API}/api/saved-items`, {
        item_id: String(itemId),
        item_type: itemType
      }, { withCredentials: true });
      await fetchSavedItems();
      toast({
        title: "Guardado",
        description: "Curso guardado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al guardar el curso",
        variant: "destructive"
      });
    }
  }, [user, fetchSavedItems, toast]);

  const handleUnsaveItem = useCallback(async (itemId, itemType) => {
    try {
      await axios.delete(`${API}/api/saved-items/${itemId}`, { withCredentials: true });
      await fetchSavedItems();
      toast({
        title: "Eliminado",
        description: "Curso eliminado de guardados",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al eliminar el curso",
        variant: "destructive"
      });
    }
  }, [fetchSavedItems, toast]);

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "Tecnología", label: "Tecnología" },
    { value: "Marketing", label: "Marketing" },
    { value: "Diseño", label: "Diseño" },
    { value: "Administración", label: "Administración" },
    { value: "Recursos Humanos", label: "Recursos Humanos" },
    { value: "Contabilidad", label: "Contabilidad" },
    { value: "Idiomas", label: "Idiomas" },
    { value: "Gestión de Empresas", label: "Gestión de Empresas" }
  ];

  const isSaved = (itemId) => {
    return savedItems?.courses?.some(item => item.id === itemId) || false;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <BookOpen className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Cursos Gratuitos</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Accede a miles de cursos gratuitos en español de las mejores plataformas educativas
          </p>
        </div>

        {!user ? (
          <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Inicia sesión para ver todos los cursos disponibles
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              Accede a más de 40 cursos gratuitos en diferentes categorías
            </p>
            <Link to="/">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-lg px-8 py-3">
                Iniciar Sesión / Crear Cuenta
              </Button>
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center text-gray-400 py-12">
            Cargando cursos...
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Todos los Cursos ({filteredCourses.length})
              </h2>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(course => (
                <Card key={course.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all h-80 flex flex-col">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                        {course.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
                          Gratis
                        </Badge>
                        {user && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => isSaved(course.id) ? handleUnsaveItem(course.id, 'course') : handleSaveItem(course.id, 'course', course)}
                            className={isSaved(course.id) ? "text-yellow-400 hover:text-yellow-300 p-1" : "text-gray-400 hover:text-yellow-400 p-1"}
                          >
                            {isSaved(course.id) ? '★' : '☆'}
                          </Button>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-white text-sm leading-tight line-clamp-2 h-10">{course.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-xs">{course.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col justify-between flex-grow">
                    <p className="text-gray-300 text-xs mb-4 line-clamp-3 flex-grow">{course.description}</p>
                    <Button
                      size="sm"
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-black text-xs"
                      onClick={() => window.open(course.url, '_blank')}
                    >
                      Ir al Curso <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginación */}
            {filteredCourses.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white disabled:opacity-50"
                >
                  Anterior
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.ceil(filteredCourses.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      className={currentPage === page ? "bg-cyan-500 text-black" : "bg-slate-700 border-slate-600 text-white"}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredCourses.length / itemsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(filteredCourses.length / itemsPerPage)}
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white disabled:opacity-50"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}