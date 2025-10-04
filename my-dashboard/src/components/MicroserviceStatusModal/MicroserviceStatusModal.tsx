import React from 'react';
import { X, Activity, Server, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import './MicroserviceStatusModal.scss';
import { type MicroserviceData } from '../MicroserviceCard/MicroserviceCard';

interface MicroserviceStatusModalProps {
  isOpen: boolean;
  microservice: MicroserviceData | null;
  onClose: () => void;
}

const MicroserviceStatusModal: React.FC<MicroserviceStatusModalProps> = ({
  isOpen,
  microservice,
  onClose,
}) => {
  if (!isOpen || !microservice) return null;

  const getStatusIcon = () => {
    switch (microservice.status) {
      case 'running':
        return <CheckCircle className="status-modal__status-icon status-modal__status-icon--success" />;
      case 'stopped':
        return <AlertCircle className="status-modal__status-icon status-modal__status-icon--warning" />;
      case 'error':
        return <XCircle className="status-modal__status-icon status-modal__status-icon--danger" />;
      default:
        return <Activity className="status-modal__status-icon" />;
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="status-modal" onClick={(e) => e.stopPropagation()}>
        <div className="status-modal__header">
          <div className="status-modal__title-section">
            <Server className="status-modal__icon" />
            <div>
              <h2 className="status-modal__title">{microservice.name}</h2>
              <p className="status-modal__subtitle">{microservice.type}</p>
            </div>
          </div>
          <button className="status-modal__close" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="status-modal__body">
          <div className="status-modal__section">
            <h3 className="status-modal__section-title">Estado Actual</h3>
            <div className="status-modal__status-card">
              {getStatusIcon()}
              <div className="status-modal__status-info">
                <span className="status-modal__status-label">Estado:</span>
                <span className="status-modal__status-value">{getStatusText()}</span>
              </div>
            </div>
          </div>

          <div className="status-modal__section">
            <h3 className="status-modal__section-title">Información</h3>
            <div className="status-modal__info-grid">
              <div className="status-modal__info-item">
                <span className="status-modal__info-label">Descripción:</span>
                <span className="status-modal__info-value">{microservice.description}</span>
              </div>
              <div className="status-modal__info-item">
                <span className="status-modal__info-label">Endpoints:</span>
                <span className="status-modal__info-value">{microservice.endpoints}</span>
              </div>
              <div className="status-modal__info-item">
                <span className="status-modal__info-label">Última actualización:</span>
                <span className="status-modal__info-value">{microservice.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="status-modal__footer">
          <button className="status-modal__btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MicroserviceStatusModal;
