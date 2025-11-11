import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { getBackendUrl } from '../config';

const BACKEND_URL = getBackendUrl();

export default function News() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await axios.get(`${BACKEND_URL}/api/news`, { params });

      if (response.data.success) {
        setNewsArticles(response.data.news || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      console.error('URL attempted:', `${BACKEND_URL}/api/news`);
      console.error('Error details:', error.response?.data || error.message);
      setNewsArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Datos hardcodeados como fallback (se mantienen por si hay error en la API)
  const fallbackNewsArticles = [
    {
      id: 1,
      title: "SNPP lanza nuevos cursos técnicos para 2025",
      category: "Educación",
      date: "2025-10-28",
      excerpt: "El Servicio Nacional de Promoción Profesional amplía su oferta educativa con más de 50 nuevos cursos técnicos enfocados en tecnología, diseño y administración.",
      content: "El SNPP ha anunciado el lanzamiento de su nueva oferta académica para 2025, incluyendo cursos en desarrollo de software, diseño gráfico, administración de empresas y más. Las inscripciones estarán abiertas del 1 al 30 de noviembre.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Becas 100% Paraguay: 500 oportunidades para estudiar",
      category: "Becas",
      date: "2025-10-25",
      excerpt: "Se abre convocatoria para 500 becas completas en universidades nacionales e internacionales. Dirigido a estudiantes de todo Paraguay.",
      content: "El programa Becas 100% Paraguay ofrece financiamiento completo para carreras de grado y posgrado. Incluye matrícula, mensualidades, materiales de estudio y seguro médico. Los interesados pueden postular hasta el 15 de diciembre.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "UPE inaugura nuevo campus en Ciudad del Este",
      category: "Universidad",
      date: "2025-10-20",
      excerpt: "La Universidad de la Empresa expande sus instalaciones con un moderno campus equipado con laboratorios de última generación.",
      content: "El nuevo campus de 5000m² cuenta con aulas inteligentes, laboratorios de computación, espacios de coworking y biblioteca digital. Permitirá duplicar la capacidad de estudiantes en la región del Alto Paraná.",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Tech Summit Paraguay 2025: Evento más grande del año",
      category: "Eventos",
      date: "2025-10-18",
      excerpt: "Se confirma la realización del Tech Summit Paraguay con más de 50 speakers internacionales y 3000 asistentes esperados.",
      content: "El evento más importante de tecnología en Paraguay se realizará del 15 al 17 de marzo de 2025. Contará con conferencias, talleres prácticos, hackathon y feria de empleo tech. Las entradas early bird ya están disponibles.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop"
    },
    {
      id: 5,
      title: "Empresas paraguayas buscan 1200 desarrolladores",
      category: "Empleo",
      date: "2025-10-15",
      excerpt: "El sector tecnológico paraguayo proyecta contratar más de 1200 profesionales en desarrollo de software durante el próximo año.",
      content: "Según estudio de la Cámara de Empresas de Tecnología, la demanda de desarrolladores continúa en aumento. Se buscan perfiles en JavaScript, Python, Java y tecnologías cloud. Salarios promedio entre Gs. 8.000.000 y Gs. 15.000.000.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop"
    },
    {
      id: 6,
      title: "Google Developer Groups Paraguay celebra 10 años",
      category: "Comunidad",
      date: "2025-10-12",
      excerpt: "La comunidad de desarrolladores más grande de Paraguay celebra una década formando profesionales tech.",
      content: "GDG Paraguay ha formado a más de 5000 desarrolladores en tecnologías Google. Para celebrar, organizarán el DevFest 2025, el evento tech gratuito más grande del año, con workshops de Android, Flutter, Cloud y Machine Learning.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop"
    },
    {
      id: 7,
      title: "Programa de Pasantías Tech 2025 abre inscripciones",
      category: "Empleo",
      date: "2025-10-10",
      excerpt: "50 empresas ofrecen 200 posiciones de pasantías remuneradas para estudiantes de carreras tech.",
      content: "El programa incluye mentoría, capacitaciones y posibilidad de contratación. Áreas disponibles: desarrollo web, mobile, data science, UX/UI y ciberseguridad. Remuneración mensual desde Gs. 2.500.000.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop"
    },
    {
      id: 8,
      title: "Bootcamp de Data Science gratuito en Asunción",
      category: "Educación",
      date: "2025-10-08",
      excerpt: "Fundación Paraguaya ofrece bootcamp intensivo de 12 semanas en Ciencia de Datos completamente gratuito.",
      content: "El programa incluye Python, SQL, Machine Learning y proyectos reales. 40 cupos disponibles para personas con conocimientos básicos de programación. Clases presenciales de lunes a viernes, 18:00 a 21:00.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
    },
    {
      id: 9,
      title: "Paraguay Tech Week: Una semana de innovación",
      category: "Eventos",
      date: "2025-10-05",
      excerpt: "Del 20 al 27 de noviembre, Paraguay celebra la semana de la tecnología con eventos gratuitos en todo el país.",
      content: "La Paraguay Tech Week incluye conferencias, talleres, hackatones y networking. Participan universidades, empresas y comunidades tech. Todos los eventos son gratuitos y abiertos al público. Registro disponible en el sitio oficial.",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop"
    },
    {
      id: 10,
      title: "Nuevas certificaciones de AWS disponibles en español",
      category: "Certificaciones",
      date: "2025-10-02",
      excerpt: "Amazon Web Services lanza exámenes de certificación en español para Cloud Practitioner y Solutions Architect.",
      content: "Los exámenes ahora disponibles en español facilitan el acceso a certificaciones internacionales. AWS también ofrece 100 vouchers gratuitos para estudiantes paraguayos. Los interesados deben aplicar antes del 30 de noviembre.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop"
    },
    {
      id: 11,
      title: "Hackathon Nacional de Salud Digital",
      category: "Eventos",
      date: "2025-09-28",
      excerpt: "Competencia busca soluciones tecnológicas para mejorar el sistema de salud en Paraguay. Premios de hasta Gs. 30.000.000.",
      content: "El Ministerio de Salud y empresas tech organizan hackathon de 48 horas. Se buscan soluciones en telemedicina, gestión hospitalaria y prevención. Los ganadores recibirán premios en efectivo y mentoría para implementar sus proyectos.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop"
    },
    {
      id: 12,
      title: "Mujeres en Tech: Programa de mentorías 2025",
      category: "Comunidad",
      date: "2025-09-25",
      excerpt: "Iniciativa conecta a 100 mujeres profesionales tech con mentoras experimentadas del sector.",
      content: "El programa gratuito incluye sesiones mensuales de mentoría, workshops de liderazgo y networking. Dirigido a mujeres que trabajan o estudian carreras tecnológicas. Las aplicaciones cierran el 30 de octubre.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop"
    }
  ];

  const categories = [
    { value: "all", label: "Todas las Noticias" },
    { value: "Educación", label: "Educación" },
    { value: "Becas", label: "Becas" },
    { value: "Empleo", label: "Empleo" },
    { value: "Eventos", label: "Eventos" },
    { value: "Comunidad", label: "Comunidad" },
    { value: "Certificaciones", label: "Certificaciones" }
  ];

  // Usa las noticias del backend si están disponibles, de lo contrario usa fallback
  const displayNews = newsArticles.length > 0 ? newsArticles : fallbackNewsArticles;
  
  const filteredNews = selectedCategory === "all"
    ? displayNews
    : displayNews.filter(article => article.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      "Educación": "bg-cyan-500/20 text-cyan-400 border-cyan-400/30",
      "Becas": "bg-green-500/20 text-green-400 border-green-400/30",
      "Empleo": "bg-orange-500/20 text-orange-400 border-orange-400/30",
      "Eventos": "bg-purple-500/20 text-purple-400 border-purple-400/30",
      "Comunidad": "bg-pink-500/20 text-pink-400 border-pink-400/30",
      "Certificaciones": "bg-blue-500/20 text-blue-400 border-blue-400/30",
      "Universidad": "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
    };
    return colors[category] || "bg-gray-500/20 text-gray-400 border-gray-400/30";
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Newspaper className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Noticias Educativas</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Mantente informado sobre las últimas novedades en educación, tecnología y oportunidades en Paraguay
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className={selectedCategory === category.value ?
                  "bg-cyan-500 text-black hover:bg-cyan-600 whitespace-nowrap" :
                  "border-slate-600 text-gray-300 hover:bg-slate-800 whitespace-nowrap"
                }
                size="sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedCategory === "all" ? "Todas las Noticias" : selectedCategory} ({filteredNews.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <p className="text-gray-400 mt-4">Cargando noticias...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map(article => (
              <Card key={article.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all flex flex-col overflow-hidden">
                {/* Image */}
                {article.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={`text-xs ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </Badge>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(article.published_at || article.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg leading-tight line-clamp-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col">
                  <CardDescription className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {article.excerpt}
                  </CardDescription>

                  <Button
                    size="sm"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                    onClick={() => {
                      // Aquí podrías navegar a una página de detalle de noticia
                      // Por ahora, mostraremos un alert con el contenido
                      alert(`${article.title}\n\n${article.content}`);
                    }}
                  >
                    Leer Noticia <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hay noticias en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
