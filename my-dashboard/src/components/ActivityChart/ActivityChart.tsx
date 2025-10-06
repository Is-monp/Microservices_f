import React, { useRef } from 'react';
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

const ActivityChart: React.FC = () => {
const chartRef = useRef<ChartJS<'line'>>(null);

  // Datos de ejemplo para los últimos 30 días
const generateActivityData = () => {
    const labels = [];
    const deployments = [];
    const errors = [];
    
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        labels.push(date.toLocaleDateString('es', { 
            month: 'short', 
            day: 'numeric' 
    }));
      // Generar datos simulados
      deployments.push(Math.floor(Math.random() * 15) + 5);
      errors.push(Math.floor(Math.random() * 20) + 1);
    }
    
    return { labels, deployments, errors };
};

    const { labels, deployments, errors } = generateActivityData();

    const chartData = {
        labels,
        datasets: [
        {
            label: 'Activo',
            data: deployments,
            borderColor: '#B483EE',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#B483EE',
            pointBorderColor: '#B483EE',
            pointRadius: 4,
            pointHoverRadius: 6,
        },
        {
            label: 'Detenido',
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
            font: {
                size: 12,
            },
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
            grid: {
            color: 'rgba(107, 114, 128, 0.2)',
            drawBorder: false,
            },
            ticks: {
            color: '#9ca3af',
            font: {
                size: 11,
            },
            maxTicksLimit: 8,
            },
        },
        y: {
            grid: {
            color: 'rgba(107, 114, 128, 0.2)',
            drawBorder: false,
            },
            ticks: {
            color: '#9ca3af',
            font: {
                size: 11,
            },
            },
            beginAtZero: true,
        },
        },
        elements: {
        point: {
            hoverBorderWidth: 2,
        },
    },
    };

    return (
    <div className="activity-chart">
        <div className="activity-chart__header">
            <h2 className="activity-chart__title">Actividad de Microservicios</h2>
            <div className="activity-chart__period">Últimos 30 días</div>
        </div>
        
        <div className="activity-chart__chart-container">
            <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>
        </div>
    );
};

export default ActivityChart;