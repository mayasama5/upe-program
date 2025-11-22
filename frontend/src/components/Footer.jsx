import React from 'react';
import { Link } from 'react-router-dom';
import techHubLogo from '../images/LOGO_TECH_HUB(1).png';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 mt-6 sm:mt-8">
      <div className="max-w-6xl mx-auto">
        {/* Logo y descripción - Separado en móvil */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center th-footer-logo-row">
            <img src={techHubLogo} alt="TechHub UPE" className="logo-img logo-footer" />
          </div>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md">
            La plataforma educativa y laboral para estudiantes de Paraguay y Latinoamérica.
          </p>
        </div>

        {/* Grid: 1 columna en móvil, 3 en pantallas pequeñas en adelante */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Recursos */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-3 md:mb-4 text-sm sm:text-sm md:text-base">Recursos</h4>
            <ul className="space-y-2 sm:space-y-1.5 md:space-y-2 text-gray-400 text-xs sm:text-xs md:text-sm">
              <li><Link to="/courses" className="hover:text-cyan-400 transition-colors inline-block">Cursos</Link></li>
              <li><Link to="/events" className="hover:text-cyan-400 transition-colors inline-block">Eventos</Link></li>
              <li><Link to="/scholarships" className="hover:text-cyan-400 transition-colors inline-block">Becas</Link></li>
              <li><Link to="/certifications" className="hover:text-cyan-400 transition-colors inline-block">Certificaciones</Link></li>
            </ul>
          </div>

          {/* Empleo */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-3 md:mb-4 text-sm sm:text-sm md:text-base">Empleo</h4>
            <ul className="space-y-2 sm:space-y-1.5 md:space-y-2 text-gray-400 text-xs sm:text-xs md:text-sm">
              <li><Link to="/jobs" className="hover:text-cyan-400 transition-colors inline-block">Vacantes</Link></li>
              <li><Link to="/companies" className="hover:text-cyan-400 transition-colors inline-block">Empresas</Link></li>
              <li><Link to="/career-advice" className="hover:text-cyan-400 transition-colors inline-block">Consejos</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-3 md:mb-4 text-sm sm:text-sm md:text-base">Contacto</h4>
            <ul className="space-y-2 sm:space-y-1.5 md:space-y-2 text-gray-400 text-xs sm:text-xs md:text-sm">
              <li>
                <a href="mailto:contacto@techhupbupe.com" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1 flex-wrap">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="break-words">contacto@techhupbupe.com</span>
                </a>
              </li>
              <li><Link to="/support" className="hover:text-cyan-400 transition-colors inline-block">Soporte</Link></li>
              <li><Link to="/terms" className="hover:text-cyan-400 transition-colors inline-block">Términos</Link></li>
              <li><Link to="/privacy" className="hover:text-cyan-400 transition-colors inline-block">Privacidad</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2024 TechHub UPE. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
