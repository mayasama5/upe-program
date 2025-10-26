import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { esES } from '@clerk/localizations';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
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

      {/* Content */}
      <div className="max-w-md mx-auto pt-24">
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl mb-2">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Accede a tu cuenta de TechHub UPE
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Clerk SignIn Component */}
        <div className="flex justify-center">
          <SignIn
            localization={esES}
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-slate-800 border-slate-700 shadow-xl",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                formButtonPrimary: "bg-cyan-500 hover:bg-cyan-600 text-black font-semibold",
                formFieldLabel: "text-white",
                formFieldInput: "bg-slate-700 border-slate-600 text-white",
                footerActionLink: "text-cyan-400 hover:text-cyan-300",
                identityPreviewText: "text-white",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
                dividerLine: "bg-slate-600",
                dividerText: "text-gray-400",
                socialButtonsBlockButton: "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                socialButtonsBlockButtonText: "text-white font-medium",
                formFieldSuccessText: "text-green-400",
                formFieldErrorText: "text-red-400",
                alertText: "text-gray-300",
                formFieldAction: "text-cyan-400 hover:text-cyan-300",
                otpCodeFieldInput: "bg-slate-700 border-slate-600 text-white"
              }
            }}
            redirectUrl={`${window.location.origin}/dashboard`}
            afterSignInUrl={`${window.location.origin}/dashboard`}
            signUpUrl="/registro-estudiante"
          />
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate('/registro-estudiante')}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              Regístrate como estudiante
            </button>
          </p>
          <p className="mt-2">
            ¿Eres una empresa?{' '}
            <button
              onClick={() => navigate('/registro-empresa')}
              className="text-orange-400 hover:text-orange-300 underline"
            >
              Regístrate como empresa
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;