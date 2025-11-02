import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Medal, ExternalLink } from 'lucide-react';
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

export default function Certifications() {
  const { user, logout } = useAuth();
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = () => {
    const mockCertifications = [
      {
        id: 1,
        title: "Google Cloud Professional Certificate",
        provider: "Google Cloud",
        description: "Certificación profesional en servicios de nube de Google",
        duration: "6 meses",
        level: "Profesional",
        price: "USD 49/mes",
        category: "Cloud Computing"
      },
      {
        id: 2,
        title: "AWS Certified Solutions Architect",
        provider: "Amazon Web Services",
        description: "Certificación de arquitecto de soluciones en AWS",
        duration: "3-6 meses",
        level: "Asociado",
        price: "USD 150 (examen)",
        category: "Cloud Computing"
      },
      {
        id: 3,
        title: "Microsoft Azure Fundamentals",
        provider: "Microsoft",
        description: "Fundamentos de computación en la nube con Azure",
        duration: "2 meses",
        level: "Fundamental",
        price: "USD 99 (examen)",
        category: "Cloud Computing"
      },
      {
        id: 4,
        title: "Project Management Professional (PMP)",
        provider: "PMI",
        description: "Certificación profesional en gestión de proyectos",
        duration: "4-6 meses",
        level: "Profesional",
        price: "USD 555 (examen)",
        category: "Gestión de Proyectos"
      },
      {
        id: 5,
        title: "Scrum Master Certified",
        provider: "Scrum Alliance",
        description: "Certificación de Scrum Master para metodologías ágiles",
        duration: "2 días + estudio",
        level: "Fundamental",
        price: "USD 500-1000",
        category: "Metodologías Ágiles"
      },
      {
        id: 6,
        title: "CompTIA Security+",
        provider: "CompTIA",
        description: "Certificación en fundamentos de ciberseguridad",
        duration: "3-4 meses",
        level: "Intermedio",
        price: "USD 370 (examen)",
        category: "Ciberseguridad"
      },
      {
        id: 7,
        title: "Cisco CCNA",
        provider: "Cisco",
        description: "Certificación en redes de Cisco",
        duration: "3-6 meses",
        level: "Asociado",
        price: "USD 300 (examen)",
        category: "Networking"
      },
      {
        id: 8,
        title: "Certified Ethical Hacker (CEH)",
        provider: "EC-Council",
        description: "Certificación en hacking ético y pruebas de penetración",
        duration: "4-6 meses",
        level: "Profesional",
        price: "USD 1,199 (examen)",
        category: "Ciberseguridad"
      },
      {
        id: 9,
        title: "Google Digital Marketing",
        provider: "Google",
        description: "Certificación en marketing digital de Google",
        duration: "3 meses",
        level: "Fundamental",
        price: "Gratis",
        category: "Marketing Digital"
      }
    ];
    setCertifications(mockCertifications);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Medal className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Certificaciones Profesionales</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Certificaciones reconocidas internacionalmente para impulsar tu carrera
          </p>
        </div>

        {!user ? (
          <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Inicia sesión para ver todas las certificaciones disponibles
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              Accede a información sobre certificaciones profesionales reconocidas mundialmente
            </p>
            <Link to="/">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-lg px-8 py-3">
                Iniciar Sesión / Crear Cuenta
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map(cert => (
              <Card key={cert.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                      {cert.category}
                    </Badge>
                    <Badge variant="outline" className="text-purple-400 border-purple-400/30 text-xs">
                      {cert.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-base">{cert.title}</CardTitle>
                  <CardDescription className="text-gray-400">{cert.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{cert.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duración:</span>
                      <span className="text-white">{cert.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Precio:</span>
                      <span className="text-cyan-400 font-semibold">{cert.price}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-black text-sm">
                    Más información <ExternalLink className="w-3 h-3 ml-1" />
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
