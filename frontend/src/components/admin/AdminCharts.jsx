import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Componente de gráfico de línea para crecimiento de usuarios
export function UserGrowthChart({ data }) {
  const chartData = {
    labels: data.map(d => `${d.month}/${d.year}`),
    datasets: [
      {
        label: 'Nuevos Usuarios',
        data: data.map(d => d.count),
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgb(156, 163, 175)'
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(156, 163, 175)'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      }
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Crecimiento de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de gráfico de barras para actividad por categoría
export function CategoryActivityChart({ data }) {
  const chartData = {
    labels: ['Cursos', 'Eventos', 'Vacantes'],
    datasets: [
      {
        label: 'Interacciones',
        data: [data.courses || 0, data.events || 0, data.jobs || 0],
        backgroundColor: [
          'rgba(6, 182, 212, 0.7)',
          'rgba(168, 85, 247, 0.7)',
          'rgba(251, 146, 60, 0.7)'
        ],
        borderColor: [
          'rgb(6, 182, 212)',
          'rgb(168, 85, 247)',
          'rgb(251, 146, 60)'
        ],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(156, 163, 175)'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)'
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Actividad por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de gráfico de dona para distribución de usuarios por rol
export function UsersByRoleChart({ data }) {
  const chartData = {
    labels: data.map(d => d.role === 'estudiante' ? 'Estudiantes' : d.role === 'empresa' ? 'Empresas' : 'Admin'),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: [
          'rgba(6, 182, 212, 0.7)',
          'rgba(251, 146, 60, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
          'rgb(6, 182, 212)',
          'rgb(251, 146, 60)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(156, 163, 175)',
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Usuarios por Rol</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
