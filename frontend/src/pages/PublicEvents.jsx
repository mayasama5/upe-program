import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import CreateEventButton from '../components/CreateEventButton';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' :
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');
const API = BACKEND_URL;

export default function PublicEvents() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [savedItems, setSavedItems] = useState({ events: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchSavedItems();
    }
  }, [user]);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredEvents(events);
    } else if (selectedFilter === "online") {
      setFilteredEvents(events.filter(event => event.is_online));
    } else if (selectedFilter === "presencial") {
      setFilteredEvents(events.filter(event => !event.is_online));
    } else if (selectedFilter === "paraguay") {
      setFilteredEvents(events.filter(event => !event.is_online && event.location.toLowerCase().includes('paraguay')));
    } else {
      setFilteredEvents(events.filter(event => event.category === selectedFilter));
    }
  }, [events, selectedFilter]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/api/events?limit=12`);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Si falla el API, generar datos de ejemplo
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);
    }
    setLoading(false);
  };

  const generateMockEvents = () => {
    const categories = ["Tecnología", "Marketing", "Diseño", "Administración", "Recursos Humanos", "Contabilidad", "Gestión de Empresas"];
    const organizers = ["Google Developers", "Marketing Hub", "Design Academy", "Tech Conference PY", "HR Summit", "Finance Forum", "Business Leaders"];
    const locations = ["Asunción, Paraguay", "Ciudad del Este, Paraguay", "Encarnación, Paraguay", "Online"];

    const titles = [
      "Conferencia Internacional de Inteligencia Artificial",
      "Workshop: Estrategias de Marketing 2025",
      "Taller de Diseño UX Avanzado",
      "Summit de Liderazgo Empresarial",
      "Webinar: Gestión de Talento en Era Digital",
      "Foro de Finanzas Corporativas",
      "Hackathon Paraguay Tech 2025",
      "Masterclass: Growth Marketing",
      "Meetup: React y Next.js",
      "Cumbre de Recursos Humanos",
      "Conferencia de Cloud Computing",
      "Taller: Email Marketing Efectivo",
      "Evento: UI/UX Design Trends",
      "Workshop: Metodologías Ágiles",
      "Webinar: Employee Experience",
      "Seminario de Auditoría Financiera",
      "DevFest Paraguay 2025",
      "Charla: Branding Personal",
      "Encuentro: Frontend Developers",
      "Foro de Cultura Organizacional",
      "AWS Summit Paraguay",
      "Workshop: SEO y SEM",
      "Diseño de Productos Digitales",
      "Congreso de Innovación",
      "Webinar: Gestión del Cambio",
      "Conferencia de Blockchain",
      "Taller: Social Media Ads",
      "Meetup: Python Developers",
      "Summit de Transformación Digital",
      "Foro de Ciberseguridad"
    ];

    return titles.map((title, index) => ({
      id: index + 1,
      title: title,
      description: `Participa en ${title.toLowerCase()}. Evento profesional con expertos de la industria, networking y certificado de participación.`,
      category: categories[index % categories.length],
      organizer: organizers[index % organizers.length],
      location: locations[index % locations.length],
      is_online: index % 3 === 0,
      event_date: new Date(Date.now() + (index * 3 + 7) * 24 * 60 * 60 * 1000).toISOString(),
      url: `https://ejemplo.com/evento-${index + 1}`,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  const fetchSavedItems = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/api/saved-items`, { withCredentials: true });
      const data = response.data || {};
      const savedArray = data.saved_items || [];
      const grouped = { events: [] };
      if (Array.isArray(savedArray)) {
        savedArray.forEach(si => {
          if (si.item_type === 'event') {
            if (si.event) grouped.events.push(si.event);
            else if (si.event_id) grouped.events.push({ id: si.event_id });
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
        description: "Debes iniciar sesión para guardar eventos",
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
        description: "Evento guardado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al guardar el evento",
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
        description: "Evento eliminado de guardados",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al eliminar el evento",
        variant: "destructive"
      });
    }
  }, [fetchSavedItems, toast]);

  const filters = [
    { value: "all", label: "Todos los eventos" },
    { value: "online", label: "Solo Online" },
    { value: "presencial", label: "Solo Presencial" },
    { value: "paraguay", label: "En Paraguay" },
    { value: "Tecnología", label: "Tecnología" },
    { value: "Marketing", label: "Marketing" },
    { value: "Diseño", label: "Diseño" },
    { value: "Administración", label: "Administración" },
    { value: "Recursos Humanos", label: "Recursos Humanos" },
    { value: "Contabilidad", label: "Contabilidad" },
    { value: "Gestión de Empresas", label: "Gestión de Empresas" }
  ];

  const isSaved = (itemId) => {
    return savedItems?.events?.some(item => item.id === itemId) || false;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Calendar className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Eventos Profesionales</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Webinars, conferencias y capacitaciones online y presenciales en Paraguay
          </p>
        </div>

        {!user ? (
          <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Inicia sesión para ver todos los eventos disponibles
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              Accede a más de 30 eventos profesionales online y presenciales
            </p>
            <Link to="/">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-lg px-8 py-3">
                Iniciar Sesión / Crear Cuenta
              </Button>
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center text-gray-400 py-12">
            Cargando eventos...
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Todos los Eventos ({filteredEvents.length})
              </h2>
              <div className="flex items-center gap-3">
                {user && user.role === 'empresa' && (
                  <CreateEventButton inline={true} onEventCreated={fetchEvents} />
                )}
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
                    <SelectValue placeholder="Filtrar eventos" />
                  </SelectTrigger>
                  <SelectContent>
                    {filters.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <Card key={event.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all h-80 flex flex-col">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                        {event.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-gray-400 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(event.event_date).toLocaleDateString('es-ES')}
                        </div>
                        {user && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => isSaved(event.id) ? handleUnsaveItem(event.id, 'event') : handleSaveItem(event.id, 'event', event)}
                            className={isSaved(event.id) ? "text-yellow-400 hover:text-yellow-300 p-1" : "text-gray-400 hover:text-yellow-400 p-1"}
                          >
                            {isSaved(event.id) ? '★' : '☆'}
                          </Button>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-white text-sm leading-tight line-clamp-2 h-10">{event.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-xs">
                      {event.organizer} • {event.is_online ? 'Online' : event.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col justify-between flex-grow">
                    <p className="text-gray-300 text-xs mb-4 line-clamp-3 flex-grow">{event.description}</p>
                    <Button
                      size="sm"
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs"
                      onClick={() => window.open(event.url, '_blank')}
                    >
                      Registrarse <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}