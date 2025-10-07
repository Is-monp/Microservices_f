import React from 'react';
import { Server, Circle, Play, Pause, Edit, Trash2, Info } from 'lucide-react';
import './MicroserviceCard.scss';

export interface MicroserviceData {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'stopped' | 'error';
  description: string;
  code: string;
  lastUpdated: string;
  endpointUrl: string;
}

interface MicroserviceCardProps {
  microservice: MicroserviceData;
  onEdit: (microservice: MicroserviceData) => void;
  onDelete: (id: string) => void;
  onViewStatus: (microservice: MicroserviceData) => void;
  onToggleStatus: (id: string) => void;
}

const MicroserviceCard: React.FC<MicroserviceCardProps> = ({
  microservice,
  onEdit,
  onDelete,
  onViewStatus,
  onToggleStatus,
}) => {
  const getStatusColor = () => {
    switch (microservice.status) {
      case 'running':
        return 'success';
      case 'stopped':
        return 'warning';
      case 'error':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (microservice.status) {
      case 'running':
        return 'Activo';
      case 'stopped':
        return 'Detenido';
      case 'error':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="microservice-card">
      <div className="microservice-card__header">
        <div className="microservice-card__main">
          <div className="microservice-card__icon">
            <Server />
          </div>
          <div className="microservice-card__info">
            <h3 className="microservice-card__name">{microservice.name}</h3>
            <p className="microservice-card__type">{microservice.type}</p>
          </div>
        </div>
        <div className={`microservice-card__status microservice-card__status--${getStatusColor()}`}>
          <Circle className="microservice-card__status-dot" />
          <span>{getStatusText()}</span>
        </div>
      </div>

      <div className="microservice-card__body">
        <p className="microservice-card__description">{microservice.description}</p>

        <div className="microservice-card__metrics">
          <div className="microservice-card__metric">
            <span className="microservice-card__time">Actualizado {microservice.lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="microservice-card__actions">
        <button
          className="microservice-card__icon-btn"
          onClick={() => onToggleStatus(microservice.id)}
          title={microservice.status === 'running' ? 'Detener' : 'Iniciar'}
        >
          {microservice.status === 'running' ? <Pause /> : <Play />}
        </button>
        <button
          className="microservice-card__icon-btn"
          onClick={() => onViewStatus(microservice)}
          title="Ver Estado"
        >
          <Info />
        </button>
        <button
          className="microservice-card__icon-btn"
          onClick={() => onEdit(microservice)}
          title="Editar"
        >
          <Edit />
        </button>
        <button
          className="microservice-card__icon-btn microservice-card__icon-btn--delete"
          onClick={() => onDelete(microservice.id)}
          title="Eliminar"
        >
          <Trash2 />
        </button>
      </div>
    </div>
  );
};

export default MicroserviceCard;