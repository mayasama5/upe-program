import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-12 px-4 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">TH</span>
              </div>
              <span className="text-white font-bold">TechHub UPE</span>
            </div>
            <p className="text-gray-400 text-sm">
              La plataforma educativa y laboral para estudiantes de Paraguay y Latinoamérica.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/courses" className="hover:text-cyan-400">Cursos</Link></li>
              <li><Link to="/events" className="hover:text-cyan-400">Eventos</Link></li>
              <li><Link to="/scholarships" className="hover:text-cyan-400">Becas</Link></li>
              <li><Link to="/certifications" className="hover:text-cyan-400">Certificaciones</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empleo</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/jobs" className="hover:text-cyan-400">Vacantes</Link></li>
              <li><Link to="/companies" className="hover:text-cyan-400">Empresas</Link></li>
              <li><Link to="/career-advice" className="hover:text-cyan-400">Consejos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/support" className="hover:text-cyan-400">Soporte</Link></li>
              <li><Link to="/terms" className="hover:text-cyan-400">Términos</Link></li>
              <li><Link to="/privacy" className="hover:text-cyan-400">Privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 TechHub UPE. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
