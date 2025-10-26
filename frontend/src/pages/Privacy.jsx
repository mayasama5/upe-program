import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import Header from '../components/Header';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={null} logout={null} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Política de Privacidad</h1>
          <p className="text-gray-400">Última actualización: Octubre 2025</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Información que Recopilamos</h2>
              <p className="mb-2">Recopilamos diferentes tipos de información para proporcionar y mejorar nuestro servicio:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Información de perfil: nombre, correo electrónico, foto de perfil</li>
                <li>Información profesional: CV, habilidades, experiencia laboral</li>
                <li>Información de uso: cómo interactúas con nuestra plataforma</li>
                <li>Información técnica: dirección IP, tipo de navegador, páginas visitadas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Cómo Usamos tu Información</h2>
              <p className="mb-2">Utilizamos la información recopilada para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                <li>Personalizar tu experiencia en la plataforma</li>
                <li>Conectarte con oportunidades educativas y laborales relevantes</li>
                <li>Comunicarnos contigo sobre actualizaciones y cambios</li>
                <li>Proteger contra fraude y uso indebido</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Compartir Información</h2>
              <p>
                No vendemos tu información personal. Compartimos tu información solo en los siguientes casos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Con empresas cuando aplicas a sus vacantes</li>
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>Cuando es requerido por ley o para proteger derechos legales</li>
                <li>Con tu consentimiento explícito</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Seguridad de Datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal
                contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Tus Derechos</h2>
              <p className="mb-2">Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acceder a tu información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Exportar tus datos en formato portable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies</h2>
              <p>
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la
                plataforma y personalizar el contenido. Puedes controlar las cookies a través de la configuración
                de tu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Cambios en esta Política</h2>
              <p>
                Podemos actualizar nuestra Política de Privacidad periódicamente. Te notificaremos sobre cambios
                significativos publicando la nueva política en esta página y actualizando la fecha de "última actualización".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Contacto</h2>
              <p>
                Si tienes preguntas sobre esta Política de Privacidad, contáctanos en:
                <a href="mailto:privacidad@techhubupe.com" className="text-cyan-400 hover:text-cyan-300 ml-1">
                  privacidad@techhubupe.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}