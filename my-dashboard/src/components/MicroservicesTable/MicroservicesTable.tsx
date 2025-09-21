import React from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import './MicroservicesTable.scss';

interface Microservice {
    name: string;
    type: string;
    status: 'Activo' | 'Inactivo';
    endpoints: number;
    lastUpdated: string;
}

const MicroservicesTable: React.FC = () => {
    const microservices: Microservice[] = [
        { name: 'user-service', type: 'REST API', status: 'Activo', endpoints: 8, lastUpdated: '2 min ago' },
        { name: 'payment-service', type: 'GraphQL', status: 'Activo', endpoints: 12, lastUpdated: '5 min ago' },
        { name: 'notification-service', type: 'WebSocket', status: 'Inactivo', endpoints: 4, lastUpdated: '1 hour ago' },
        { name: 'auth-service', type: 'REST API', status: 'Activo', endpoints: 6, lastUpdated: '30 min ago' }
    ];

    return (
        <div className="microservices-table">
        <div className="microservices-table__header">
            <h2 className="microservices-table__title">Microservicios Registrados</h2>
            <button className="microservices-table__add-btn">
            <Plus className="microservices-table__add-icon" />
            Nuevo Microservicio
            </button>
        </div>
        
        <div className="microservices-table__container">
            <table className="microservices-table__table">
            <thead>
                <tr className="microservices-table__header-row">
                <th className="microservices-table__header-cell">Nombre</th>
                <th className="microservices-table__header-cell">Tipo</th>
                <th className="microservices-table__header-cell">Estado</th>
                <th className="microservices-table__header-cell">Endpoints</th>
                <th className="microservices-table__header-cell">Última Actualización</th>
                <th className="microservices-table__header-cell microservices-table__header-cell--actions">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {microservices.map((service, index) => (
                <tr key={index} className="microservices-table__row">
                    <td className="microservices-table__cell microservices-table__cell--name">{service.name}</td>
                    <td className="microservices-table__cell">{service.type}</td>
                    <td className="microservices-table__cell">
                    <span className={`microservices-table__status microservices-table__status--${service.status.toLowerCase()}`}>
                        {service.status}
                    </span>
                    </td>
                    <td className="microservices-table__cell">{service.endpoints}</td>
                    <td className="microservices-table__cell microservices-table__cell--time">{service.lastUpdated}</td>
                    <td className="microservices-table__cell">
                    <div className="microservices-table__actions">
                        <button className="microservices-table__action-btn microservices-table__action-btn--view">
                        <Eye className="microservices-table__action-icon" />
                        </button>
                        <button className="microservices-table__action-btn microservices-table__action-btn--edit">
                        <Edit className="microservices-table__action-icon" />
                        </button>
                        <button className="microservices-table__action-btn microservices-table__action-btn--delete">
                        <Trash2 className="microservices-table__action-icon" />
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default MicroservicesTable;