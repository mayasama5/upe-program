import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import Header from '../components/Header';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={null} logout={null} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Términos y Condiciones</h1>
          <p className="text-gray-400">Última actualización: Octubre 2025</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Aceptación de Términos</h2>
              <p>
                Al acceder y utilizar TechHub UPE, aceptas cumplir con estos términos y condiciones.
                Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Uso de la Plataforma</h2>
              <p className="mb-2">
                TechHub UPE es una plataforma educativa y laboral que conecta estudiantes con oportunidades de aprendizaje y empleo.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Debes ser mayor de 18 años o contar con autorización de tus padres/tutores</li>
                <li>Debes proporcionar información veraz y actualizada</li>
                <li>Eres responsable de mantener la confidencialidad de tu cuenta</li>
                <li>No debes usar la plataforma para actividades ilegales o no autorizadas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Contenido del Usuario</h2>
              <p>
                Al publicar contenido en TechHub UPE, mantienes la propiedad de tus derechos, pero nos otorgas
                una licencia para usar, mostrar y distribuir ese contenido en nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Propiedad Intelectual</h2>
              <p>
                Todo el contenido de TechHub UPE, incluyendo texto, gráficos, logos y software,
                está protegido por derechos de autor y otras leyes de propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Limitación de Responsabilidad</h2>
              <p>
                TechHub UPE actúa como intermediario entre estudiantes y proveedores de contenido/empleadores.
                No somos responsables por el contenido de terceros ni por las relaciones que se establezcan
                a través de nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                Los cambios serán efectivos inmediatamente después de su publicación en la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Contacto</h2>
              <p>
                Para preguntas sobre estos términos, contáctanos en:
                <a href="mailto:legal@techhubupe.com" className="text-cyan-400 hover:text-cyan-300 ml-1">
                  legal@techhubupe.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}