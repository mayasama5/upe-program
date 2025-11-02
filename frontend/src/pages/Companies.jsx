import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    const mockCompanies = [
      {
        id: 1,
        name: "Tech Solutions Paraguay",
        industry: "Tecnología",
        location: "Asunción, Paraguay",
        employees: "50-200",
        description: "Empresa líder en desarrollo de software y soluciones tecnológicas para empresas en Paraguay y Latinoamérica",
        openPositions: 5,
        website: "https://techsolutions.com.py"
      },
      {
        id: 2,
        name: "Digital Marketing Pro",
        industry: "Marketing Digital",
        location: "Ciudad del Este, Paraguay",
        employees: "10-50",
        description: "Agencia de marketing digital especializada en estrategias de crecimiento para PyMEs",
        openPositions: 3,
        website: "https://digitalmarketingpro.py"
      },
      {
        id: 3,
        name: "FinTech Paraguay",
        industry: "Finanzas",
        location: "Asunción, Paraguay",
        employees: "100-500",
        description: "Startup fintech revolucionando los servicios financieros en Paraguay",
        openPositions: 8,
        website: "https://fintechpy.com"
      },
      {
        id: 4,
        name: "Design Studio PY",
        industry: "Diseño",
        location: "Asunción, Paraguay",
        employees: "10-50",
        description: "Estudio de diseño gráfico y branding para marcas nacionales e internacionales",
        openPositions: 2,
        website: "https://designstudiopy.com"
      },
      {
        id: 5,
        name: "Cloud Services SA",
        industry: "Cloud Computing",
        location: "Asunción, Paraguay",
        employees: "50-200",
        description: "Proveedor de servicios en la nube y migración digital para empresas",
        openPositions: 6,
        website: "https://cloudservices.com.py"
      },
      {
        id: 6,
        name: "E-commerce Giant",
        industry: "E-commerce",
        location: "Asunción, Paraguay",
        employees: "200-500",
        description: "Plataforma de comercio electrónico líder en Paraguay",
        openPositions: 12,
        website: "https://ecommercegiant.py"
      },
      {
        id: 7,
        name: "Data Analytics Co",
        industry: "Análisis de Datos",
        location: "Asunción, Paraguay",
        employees: "20-100",
        description: "Empresa especializada en análisis de datos y business intelligence",
        openPositions: 4,
        website: "https://dataanalytics.py"
      },
      {
        id: 8,
        name: "StartUp Hub Paraguay",
        industry: "Incubadora",
        location: "Asunción, Paraguay",
        employees: "10-50",
        description: "Incubadora de startups tecnológicas en Paraguay",
        openPositions: 3,
        website: "https://startuphub.py"
      },
      {
        id: 9,
        name: "Consulting Group",
        industry: "Consultoría",
        location: "Asunción, Paraguay",
        employees: "50-200",
        description: "Firma de consultoría empresarial y transformación digital",
        openPositions: 7,
        website: "https://consultinggroup.py"
      }
    ];
    setCompanies(mockCompanies);
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

        {!user ? (
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
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm">
                    Ver perfil <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
