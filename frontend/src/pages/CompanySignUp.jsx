import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Building, ArrowLeft } from 'lucide-react';
import techHubLogo from '../images/LOGO_TECH_HUB(1).png';
import facultadLogo from '../images/logo_upe_infor_1(1).png';
import upeLogo from '../images/icon_upe-300x300.png';

const CompanySignUp = () => {
  const navigate = useNavigate();

  // Store the role when user lands on this page
  React.useEffect(() => {
    sessionStorage.setItem('intended_role', 'empresa');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header: top logos bar + action row */}
      <div className="fixed top-0 left-0 right-0 z-50">
  <div className="bg-slate-800 border-b border-slate-700 th-header-top-fixed">
          <div className="max-w-7xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4">
            <div className="flex items-center justify-center">
              <img src={upeLogo} alt="Universidad Privada del Este" className="logo-img logo-left" />
            </div>
            <div className="flex items-center justify-center">
              <img src={techHubLogo} alt="TechHub UPE" className="logo-img logo-center" />
            </div>
            <div className="flex items-center justify-center">
              <img src={facultadLogo} alt="Facultad de Ciencias de la Informática" className="logo-img logo-right" />
            </div>
          </div>
        </div>
  <header className="bg-slate-900 border-b border-orange-500/20 px-4 py-3 th-header">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">Registro de Empresa</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-cyan-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </header>
      </div>

      {/* Content - Two Column Layout */}
  <div className="pt-24 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
        
            {/* RIGHT SIDE - Information */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Header Section */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Registro de Empresa
                </h1>
                <p className="text-gray-400 text-lg">
                  Registra tu empresa y encuentra el mejor talento de Ciudad del Este.
                </p>
              </div>

              {/* Benefits Section */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">¿Qué incluye tu cuenta empresarial?</CardTitle>
                </CardHeader>
                <div className="px-6 pb-6">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">Publicación de vacantes</h4>
                        <p className="text-gray-400 text-sm">Publica ofertas laborales y prácticas profesionales</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">Acceso a talento calificado</h4>
                        <p className="text-gray-400 text-sm">Busca perfiles profesionales y estudiantes destacados</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">Eventos de reclutamiento</h4>
                        <p className="text-gray-400 text-sm">Organiza eventos virtuales y presenciales</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">Perfil corporativo</h4>
                        <p className="text-gray-400 text-sm">Muestra la cultura y beneficios de tu empresa</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              {/* Additional Info Below Form */}
              <div className="text-center mt-6 text-gray-400 text-sm">
                <p>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-orange-400 hover:text-orange-300 underline"
                  >
                    Inicia sesión aquí
                  </button>
                </p>
                <p className="mt-2">
                  ¿Eres estudiante?{' '}
                  <button
                    onClick={() => navigate('/registro-estudiante')}
                    className="text-orange-400 hover:text-orange-300 underline"
                  >
                    Regístrate como estudiante
                  </button>
                </p>
              </div>
            </div>
            
            {/* LEFT SIDE - Registration Form */}
            <div className="flex flex-col justify-center">
              <Card className="bg-slate-800 border-slate-700 shadow-xl w-full">
                <CardHeader>
                  <CardTitle className="text-white">Registro de Empresa</CardTitle>
                  <CardDescription className="text-gray-400">
                    Crea tu cuenta empresarial para comenzar
                  </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6">
                  <p className="text-gray-400 text-center">
                    El formulario de registro estará disponible próximamente.
                  </p>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySignUp;