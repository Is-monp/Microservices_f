// components/SystemStatus.tsx
import React from 'react';
import '../SystemStatus/SystemStatus.scss';

interface SystemMetric {
    label: string;
    value: number;
    color: 'green' | 'yellow' | 'blue' | 'red';
}

const SystemStatus: React.FC = () => {
    const metrics: SystemMetric[] = [
        { label: 'CPU Usage', value: 65, color: 'green' },
        { label: 'Memory', value: 78, color: 'yellow' },
        { label: 'Network', value: 42, color: 'blue' }
    ];

    return (
        <div className="system-status">
        <h2 className="system-status__title">Estado del Sistema</h2>
        <div className="system-status__metrics">
            {metrics.map((metric, index) => (
            <div key={index} className="system-status__metric">
                <div className="system-status__metric-header">
                <span className="system-status__metric-label">{metric.label}</span>
                <span className={`system-status__metric-value system-status__metric-value--${metric.color}`}>
                    {metric.value}%
                </span>
                </div>
                <div className="system-status__progress-bar">
                <div 
                    className={`system-status__progress system-status__progress--${metric.color}`}
                    style={{ width: `${metric.value}%` }}
                />
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default SystemStatus;