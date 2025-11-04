import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { UserCheck, ArrowLeft } from 'lucide-react';

const StudentSignUp = () => {
  const navigate = useNavigate();

  // Store the role when user lands on this page
  React.useEffect(() => {
    sessionStorage.setItem('intended_role', 'estudiante');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">TH</span>
            </div>
            <h1 className="text-xl font-bold text-white">TechHub UPE</h1>
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

      {/* Content - Two Column Layout */}
      <div className="pt-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            

            {/* RIGHT SIDE - Information */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Header Section */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Registro de Estudiante
                </h1>
                <p className="text-gray-400 text-lg">
                  Crea tu cuenta para acceder a cursos gratuitos, eventos, becas y oportunidades laborales
                </p>
              </div>

              {/* Benefits Section */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">¿Qué incluye tu cuenta de estudiante?</CardTitle>
                </CardHeader>
                <div className="px-6 pb-6">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">Acceso ilimitado a cursos</h4>
                        <p className="text-gray-400 text-sm">Miles de cursos gratuitos en tecnología, diseño, negocios y más</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">Eventos y capacitaciones</h4>
                        <p className="text-gray-400 text-sm">Webinars, conferencias y eventos de networking</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">Oportunidades laborales</h4>
                        <p className="text-gray-400 text-sm">Vacantes, prácticas y becas de estudio</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">Perfil profesional</h4>
                        <p className="text-gray-400 text-sm">Crea tu portfolio y conecta con empresas</p>
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
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Inicia sesión aquí
                  </button>
                </p>
                <p className="mt-2">
                  ¿Eres una empresa?{' '}
                  <button
                    onClick={() => navigate('/registro-empresa')}
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Regístrate como empresa
                  </button>
                </p>
              </div>
            </div>
            {/* LEFT SIDE - Registration Form */}
            <div className="flex flex-col justify-center">
              <Card className="bg-slate-800 border-slate-700 shadow-xl w-full">
                <CardHeader>
                  <CardTitle className="text-white">Registro de Estudiante</CardTitle>
                  <CardDescription className="text-gray-400">
                    Crea tu cuenta de estudiante para comenzar
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

export default StudentSignUp;