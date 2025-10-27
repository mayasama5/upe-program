import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  FileText,
  Download,
  FileSpreadsheet,
  FileDown,
  Users,
  BookOpen,
  Calendar,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { exportToPDF, exportToExcel, exportToCSV } from '../../utils/exportUtils';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export default function ReportsPanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState({});

  const reportTypes = [
    {
      id: 'users',
      title: 'Reporte de Usuarios',
      description: 'Lista completa de usuarios registrados con detalles',
      icon: Users,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      endpoint: '/api/admin/reports/users'
    },
    {
      id: 'courses',
      title: 'Reporte de Cursos',
      description: 'Estadísticas y detalles de todos los cursos',
      icon: BookOpen,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      endpoint: '/api/admin/reports/courses'
    },
    {
      id: 'events',
      title: 'Reporte de Eventos',
      description: 'Historial completo de eventos organizados',
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      endpoint: '/api/admin/reports/events'
    },
    {
      id: 'jobs',
      title: 'Reporte de Vacantes',
      description: 'Vacantes publicadas y estadísticas de aplicaciones',
      icon: Briefcase,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      endpoint: '/api/admin/reports/jobs'
    },
    {
      id: 'activity',
      title: 'Reporte de Actividad',
      description: 'Métricas de uso y engagement de usuarios',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      endpoint: '/api/admin/reports/activity'
    }
  ];

  const fetchReportData = async (reportType) => {
    try {
      const response = await axios.get(`${BACKEND_URL}${reportType.endpoint}`, {
        withCredentials: true
      });

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching report data:', error);
      throw error;
    }
  };

  const handleExport = async (reportType, format) => {
    const loadingKey = `${reportType.id}-${format}`;
    setLoading({ ...loading, [loadingKey]: true });

    try {
      const data = await fetchReportData(reportType);

      if (!data || data.length === 0) {
        toast({
          title: 'Sin datos',
          description: 'No hay datos disponibles para exportar',
          variant: 'destructive'
        });
        return;
      }

      const filename = `${reportType.id}_${new Date().toISOString().split('T')[0]}`;

      switch (format) {
        case 'pdf':
          const columns = Object.keys(data[0]);
          exportToPDF(data, reportType.title, columns);
          break;
        case 'excel':
          exportToExcel(data, filename);
          break;
        case 'csv':
          exportToCSV(data, filename);
          break;
        default:
          break;
      }

      toast({
        title: 'Reporte generado',
        description: `${reportType.title} exportado como ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al generar el reporte',
        variant: 'destructive'
      });
    } finally {
      setLoading({ ...loading, [loadingKey]: false });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Centro de Reportes</CardTitle>
          <CardDescription className="text-gray-400">
            Genera y exporta reportes detallados del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.id} className="bg-slate-900 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${report.bgColor}`}>
                        <Icon className={`w-6 h-6 ${report.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{report.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">{report.description}</p>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleExport(report, 'excel')}
                            disabled={loading[`${report.id}-excel`]}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                          >
                            {loading[`${report.id}-excel`] ? (
                              <span className="flex items-center">
                                <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2" />
                                Generando...
                              </span>
                            ) : (
                              <>
                                <FileSpreadsheet className="w-3 h-3 mr-1" />
                                Excel
                              </>
                            )}
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleExport(report, 'csv')}
                            disabled={loading[`${report.id}-csv`]}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                          >
                            {loading[`${report.id}-csv`] ? (
                              <span className="flex items-center">
                                <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2" />
                                Generando...
                              </span>
                            ) : (
                              <>
                                <FileDown className="w-3 h-3 mr-1" />
                                CSV
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reportes programados */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Reportes Programados</CardTitle>
          <CardDescription className="text-gray-400">
            Genera reportes automáticos en intervalos específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div>
                <p className="text-white font-medium">Reporte Semanal de Usuarios</p>
                <p className="text-sm text-gray-400">Cada lunes a las 8:00 AM</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Activo</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div>
                <p className="text-white font-medium">Reporte Mensual de Actividad</p>
                <p className="text-sm text-gray-400">Primer día del mes</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Activo</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div>
                <p className="text-white font-medium">Resumen Trimestral</p>
                <p className="text-sm text-gray-400">Cada 3 meses</p>
              </div>
              <Badge className="bg-gray-500/20 text-gray-400">Pausado</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
