import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, MapPin, Users, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' :
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');
const API = BACKEND_URL;

export default function Companies() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      // Cargar empresas reales de la API
      const response = await axios.get(`${API}/api/companies`, {
        withCredentials: true
      });
      
      if (response.data && response.data.success && response.data.companies) {
        // Formatear los datos de la API para que coincidan con la estructura esperada
        const formattedCompanies = response.data.companies.map((company, index) => ({
          id: company.id,
          name: company.company_name || company.name || 'Empresa sin nombre',
          industry: company.industry || 'No especificado',
          location: company.city || company.country || company.address || 'Ubicación no especificada',
          employees: company.company_size || 'No especificado',
          description: company.bio || 'Descripción no disponible',
          openPositions: company.openPositions || 0, 
          website: company.website || '#',
          email: company.email,
          phone: company.phone,
          benefits: company.benefits
        }));
        
        setCompanies(formattedCompanies);
      } else {
        // Si no hay empresas reales, mostrar lista vacía
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error loading companies from API:', error);
      console.error('Error details:', error.response?.data);
      // Si falla la API, mostrar lista vacía
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Building className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Empresas Colaboradoras</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Conoce las empresas que confían en TechHub UPE para encontrar talento
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-white text-lg">Cargando empresas...</div>
          </div>
        ) : !user ? (
          <div className="bg-slate-800 border border-orange-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Inicia sesión para ver todas las empresas disponibles
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              Accede a información sobre empresas colaboradoras y sus vacantes
            </p>
            <Link to="/">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-lg px-8 py-3">
                Iniciar Sesión / Crear Cuenta
              </Button>
            </Link>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <Building className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-3">
              No hay empresas registradas
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              Aún no hay empresas colaboradoras registradas en la plataforma
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map(company => (
              <Card key={company.id} className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base">{company.name}</CardTitle>
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs mt-1">
                        {company.industry}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300 text-sm">
                    {company.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">{company.employees} empleados</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <span className="text-gray-400 text-sm">Vacantes abiertas</span>
                      <Badge className="bg-cyan-500 text-black font-semibold">
                        {company.openPositions}
                      </Badge>
                    </div>
                  </div>
                  <Link to={`/company/${company.id}`} className="w-full">
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm"
                    >
                      Ver perfil <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
