import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { AlertCircle, Settings, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Maintenance() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-blue-500 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12 text-center">
            {/* Icon with animation */}
            <div className="mb-6 sm:mb-8 relative inline-block">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-4 sm:p-5 md:p-6">
                <Settings className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>

            {/* Alert badge */}
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              <span className="text-yellow-400 text-xs sm:text-sm font-medium">Mantenimiento Programado</span>
            </div>

            {/* Main heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
              Estamos Mejorando
              <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text mt-1 sm:mt-2">
                TechHub UPE
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed px-2">
              Nuestro sistema está temporalmente fuera de servicio mientras realizamos
              mejoras importantes para brindarte una mejor experiencia.
            </p>

            {/* Estimated time */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 p-3 sm:p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-400">Tiempo estimado</p>
                <p className="text-sm sm:text-base text-white font-semibold">2-4 horas</p>
              </div>
            </div>

            {/* Features being worked on */}
            <div className="mb-6 sm:mb-8 text-left bg-slate-900/30 rounded-lg p-4 sm:p-5 md:p-6 border border-slate-700/50">
              <h3 className="text-white text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                En qué estamos trabajando:
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-xs sm:text-sm md:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                  <span>Optimización del rendimiento del sistema</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                  <span>Nuevas funcionalidades para estudiantes y empresas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                  <span>Mejoras en la seguridad y privacidad</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                  <span>Actualización de la base de datos</span>
                </li>
              </ul>
            </div>

            {/* Contact info */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-cyan-400 text-xs sm:text-sm break-words">
                ¿Tienes preguntas urgentes? Contáctanos en{' '}
                <a href="mailto:soporte@techhubupe.com" className="font-semibold underline hover:text-cyan-300 break-all">
                  soporte@techhubupe.com
                </a>
              </p>
            </div>

            {/* Back button */}
            <Button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Volver al Inicio
            </Button>

            {/* Footer note */}
            <p className="text-gray-500 text-[10px] sm:text-xs mt-4 sm:mt-6 px-2">
              Última actualización: {new Date().toLocaleString('es-ES', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>
          </CardContent>
        </Card>

        {/* Progress indicator */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-1.5 sm:gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-pulse delay-150"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
}
