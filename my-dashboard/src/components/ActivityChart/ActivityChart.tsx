import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ActivityChart.scss';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ActivityChartProps {
  labels: string[];
  deployments: number[];
  errors: number[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({
  labels,
  deployments,
  errors,
}) => {
  // Si no hay datos, mostrar mensaje vacío
  if (!labels?.length) {
    return (
      <div className="activity-chart">
        <div className="activity-chart__header">
          <h2 className="activity-chart__title">Actividad de Microservicios</h2>
          <div className="activity-chart__period">Últimos 30 días</div>
        </div>
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#9ca3af',
            fontSize: '0.95rem',
          }}
        >
          Sin datos de actividad recientes.
        </div>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Despliegues',
        data: deployments,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#8b5cf6',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Errores',
        data: errors,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#ef4444',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#d1d5db',
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        borderColor: '#6b7280',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(107, 114, 128, 0.2)', drawBorder: false },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: { color: 'rgba(107, 114, 128, 0.2)', drawBorder: false },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
        },
        beginAtZero: true,
      },
    },
    elements: {
      point: { hoverBorderWidth: 2 },
    },
  };

  return (
    <div className="activity-chart">
      <div className="activity-chart__header">
        <h2 className="activity-chart__title">Actividad de Microservicios</h2>
        <div className="activity-chart__period">Últimos 30 días</div>
      </div>

      <div className="activity-chart__chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ActivityChart;
