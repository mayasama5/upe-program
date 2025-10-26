import React, { useEffect, useState } from 'react';
import { useClerkAuth } from '../hooks/useClerkAuth';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Header from '../components/Header';
import { supabase } from '../lib/supabaseClient';

export default function CareerAdvice() {
  const { user, loading } = useClerkAuth();
  const [advice, setAdvice] = useState([]);
  const [adviceLoading, setAdviceLoading] = useState(true);

  useEffect(() => {
    async function fetchAdvice() {
      setAdviceLoading(true);
      const { data, error } = await supabase
        .from('career_advice')
        .select('*');
      if (error) {
        console.error('Error fetching career advice:', error);
        setAdvice([]);
      } else {
        setAdvice(data || []);
      }
      setAdviceLoading(false);
    }
    fetchAdvice();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-white">Cargando...</div></div>;
  }
  if (!user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={null} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Consejos Profesionales</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Guías y recursos para impulsar tu carrera profesional
          </p>
        </div>

  {adviceLoading ? (
          <div className="text-center text-gray-400">Cargando consejos...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {advice.map((item) => (
              <Card key={item.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                  {item.content}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}