import React from 'react';
import { HelpCircle, Mail, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';

export default function Support() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Centro de Soporte</h1>
          <p className="text-xl text-gray-300">
            ¿Necesitas ayuda? Estamos aquí para asistirte
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                Correo Electrónico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Envíanos un correo y te responderemos en 24-48 horas
              </p>
              <a href="mailto:soporte@techhubupe.com" className="text-cyan-400 hover:text-cyan-300">
                soporte@techhubupe.com
              </a>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                Chat en Vivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Disponible de Lunes a Viernes, 9:00 AM - 6:00 PM
              </p>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black">
                Iniciar Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">¿Cómo creo una cuenta?</h3>
              <p className="text-gray-400">
                Haz clic en "Crear Cuenta" en la página principal y sigue los pasos de registro.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">¿La plataforma es gratuita?</h3>
              <p className="text-gray-400">
                Sí, TechHub UPE es completamente gratuito para estudiantes y empresas.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">¿Cómo aplico a una vacante?</h3>
              <p className="text-gray-400">
                Regístrate, completa tu perfil y haz clic en "Aplicar" en las vacantes de tu interés.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}