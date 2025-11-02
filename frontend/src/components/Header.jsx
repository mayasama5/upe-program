import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { useSystemSettings } from '../hooks/useSystemSettings';

export default function Header({ user, logout }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSavedClick = () => {
    navigate('/saved');
  };

  const handleLoginClick = () => {
    navigate('/');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showUserMenu]);

  const { settings } = useSystemSettings();
  const [techhubError, setTechhubError] = useState(false);

  return (
    <>
      {/* Top bar with logos */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 th-header-top-fixed">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          <div className="flex items-center justify-center justify-self-end">
            {settings.faculty_logo ? (
              <img src={settings.faculty_logo} alt="Facultad" className="logo-img logo-left" />
            ) : (
              <span className="text-gray-400 text-xs">Facultad</span>
            )}
          </div>

          <div className="flex items-center justify-center space-x-2">
            {settings.techhub_logo && !techhubError ? (
              <img
                src={settings.techhub_logo}
                alt="TechHub UPE"
                className="logo-img logo-center"
                onError={() => setTechhubError(true)}
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">TH</span>
                </div>
                <h1 className="text-2xl font-bold text-white">TechHub UPE</h1>
              </>
            )}
          </div>

          <div className="flex items-center justify-center">
            {settings.university_logo ? (
              <img src={settings.university_logo} alt="Universidad" className="logo-img logo-right" />
            ) : (
              <span className="text-gray-400 text-xs">Universidad</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation menu */}
  <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3 sticky top-0 z-50 th-header">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <nav className="flex-1">
            {/* Mobile: show hamburger to toggle nav; Desktop: always show centered nav */}
            <div className="flex items-center">
              {/* Hamburger for mobile */}
              <button
                aria-label="Toggle navigation"
                onClick={() => setMobileOpen(v => !v)}
                className="mr-3 md:hidden p-2 rounded bg-slate-800 border border-slate-700 text-gray-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              {/* horizontal nav: only visible on md+; on mobile we use the dropdown */}
              <div id="main-nav" className={`hidden md:flex w-full items-center justify-center gap-3 md:gap-6 overflow-x-auto`}>
                <Button
                  key="inicio-btn"
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-300 hover:text-cyan-400 px-3 md:px-4"
                >
                  Inicio
                </Button>
                <Button
                  key="cursos-btn"
                  variant="ghost"
                  onClick={() => navigate('/courses')}
                  className="text-gray-300 hover:text-cyan-400 px-3 md:px-4"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="whitespace-nowrap">Cursos</span>
                </Button>
                <Button
                  key="eventos-btn"
                  variant="ghost"
                  onClick={() => navigate('/events')}
                  className="text-gray-300 hover:text-cyan-400 px-3 md:px-4"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="whitespace-nowrap">Eventos</span>
                </Button>
                <Button
                  key="vacantes-btn"
                  variant="ghost"
                  onClick={() => navigate('/jobs')}
                  className="text-gray-300 hover:text-cyan-400 px-3 md:px-4"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span className="whitespace-nowrap">Vacantes</span>
                </Button>
              </div>

              {/* Mobile dropdown (absolute) */}
              {mobileOpen && (
                <div className="md:hidden absolute left-4 right-4 top-16 z-40 bg-slate-900 border border-slate-700 rounded-lg shadow-lg">
                  <div className="flex flex-col p-2">
                    <button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} className="text-left px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white rounded">Inicio</button>
                    <button onClick={() => { navigate('/courses'); setMobileOpen(false); }} className="text-left px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white rounded"><BookOpen className="w-4 h-4 inline mr-2"/>Cursos</button>
                    <button onClick={() => { navigate('/events'); setMobileOpen(false); }} className="text-left px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white rounded"><Calendar className="w-4 h-4 inline mr-2"/>Eventos</button>
                    <button onClick={() => { navigate('/jobs'); setMobileOpen(false); }} className="text-left px-4 py-2 text-gray-300 hover:bg-slate-800 hover:text-white rounded"><Briefcase className="w-4 h-4 inline mr-2"/>Vacantes</button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              /* Avatar with dropdown menu for authenticated users */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(prev => !prev)}
                  aria-haspopup="true"
                  aria-expanded={!!showUserMenu}
                  className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 hover:bg-slate-700 focus:outline-none"
                >
                  <img
                    src={user.picture || (user.email ? `https://www.gravatar.com/avatar/${encodeURIComponent(user.email)}?d=identicon` : 'https://via.placeholder.com/100?text=Sin+Foto')}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden md:inline text-white text-sm">Perfil</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded shadow-lg z-50">
                    <div className="p-3 border-b border-slate-700">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.picture || (user.email ? `https://www.gravatar.com/avatar/${encodeURIComponent(user.email)}?d=identicon` : 'https://via.placeholder.com/100?text=Sin+Foto')}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-white text-sm line-clamp-1">{user.name}</div>
                          <div className="text-gray-400 text-xs">
                            {user.role === 'admin' ? 'Administrador' : user.role === 'empresa' ? 'Empresa' : 'Estudiante'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col p-2">
                      {/* Solo mostrar Mi Perfil y Guardados si NO es admin */}
                      {user.role !== 'admin' && (
                        <>
                          <button onClick={handleProfileClick} className="text-left px-3 py-2 text-gray-200 hover:bg-slate-700 rounded">Mi Perfil</button>
                          <button onClick={handleSavedClick} className="text-left px-3 py-2 text-gray-200 hover:bg-slate-700 rounded">Guardados</button>
                        </>
                      )}
                      <button onClick={() => {
                        setShowUserMenu(false);
                        if (logout && typeof logout === 'function') {
                          logout();
                        } else {
                          console.error('Logout function is not available');
                        }
                      }} className="text-left px-3 py-2 text-red-400 hover:bg-slate-700 rounded">Salir</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login button for non-authenticated users */
              <Button
                onClick={handleLoginClick}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
