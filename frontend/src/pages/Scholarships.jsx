import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' :
   'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');
const API = BACKEND_URL;

export default function Scholarships() {
  const [user, setUser] = useState(null);
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/api/auth/me`, { withCredentials: true });
      setUser(response.data.user);
      if (response.data.user) {
        loadScholarships();
      }
    } catch (error) {
      console.log('No active session');
      setUser(null);
    }
  };

  const loadScholarships = () => {
    const mockScholarships = [
      {
        id: 1,
        title: "Beca Fulbright Paraguay",
        organization: "Embajada de Estados Unidos",
        description: "Programa de becas para estudios de maestría y doctorado en Estados Unidos",
        amount: "Cobertura total",
        deadline: "2025-05-15",
        type: "Internacional"
      },
      {
        id: 2,
        title: "Becas ITAIPU Binacional",
        organization: "ITAIPU",
        description: "Becas para carreras de grado y posgrado en universidades paraguayas",
        amount: "Gs. 3.000.000/mes",
        deadline: "2025-04-30",
        type: "Nacional"
      },
      {
        id: 3,
        title: "Programa Chevening",
        organization: "Gobierno Británico",
        description: "Becas completas para estudios de maestría en Reino Unido",
        amount: "Cobertura total",
        deadline: "2025-06-01",
        type: "Internacional"
      },
      {
        id: 4,
        title: "Becas CONACYT",
        organization: "CONACYT Paraguay",
        description: "Becas para maestrías y doctorados en el extranjero",
        amount: "Variable",
        deadline: "2025-07-15",
        type: "Internacional"
      },
      {
        id: 5,
        title: "Programa DAAD",
        organization: "Servicio Alemán de Intercambio Académico",
        description: "Becas para estudios de posgrado en Alemania",
        amount: "€850-1,200/mes",
        deadline: "2025-05-20",
        type: "Internacional"
      },
      {
        id: 6,
        title: "Becas OEA",
        organization: "Organización de Estados Americanos",
        description: "Becas académicas para estudios de grado y posgrado",
        amount: "Variable",
        deadline: "2025-06-30",
        type: "Regional"
      }
    ];
    setScholarships(mockScholarships);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={null} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Becas y Ayudas</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Oportunidades de becas para estudios universitarios y especializaciones
          </p>
        </div>

        {!user ? (
          <div className="bg-slate-800 border border-yellow-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Inicia sesión para ver todas las becas disponibles
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              Accede a información sobre becas nacionales e internacionales
            </p>
            <Link to="/">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-lg px-8 py-3">
                Iniciar Sesión / Crear Cuenta
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map(scholarship => (
              <Card key={scholarship.id} className="bg-slate-800 border-slate-700 hover:border-yellow-500/50 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                      {scholarship.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-white">{scholarship.title}</CardTitle>
                  <CardDescription className="text-gray-400">{scholarship.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{scholarship.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Monto:</span>
                      <span className="text-cyan-400 font-semibold">{scholarship.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Fecha límite:</span>
                      <span className="text-white">{new Date(scholarship.deadline).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black">
                    Ver más detalles
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
