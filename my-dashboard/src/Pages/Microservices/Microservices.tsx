import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import MicroserviceCard, { type MicroserviceData } from '../../components/MicroserviceCard/MicroserviceCard';
import CreateMicroserviceModal from '../../components/CreateMicroserviceModal/CreateMicroserviceModal';
import EditCodeModal from '../../components/EditCodeModal/EditCodeModal';
import MicroserviceStatusModal from '../../components/MicroserviceStatusModal/MicroserviceStatusModal';
import './Microservices.scss';

const Microservices: React.FC = () => {
  const [microservices, setMicroservices] = useState<MicroserviceData[]>([
    {
      id: '1',
      name: 'user-service',
      type: 'REST API',
      status: 'running',
      description: 'Servicio de gestión de usuarios con autenticación',
      code: `const express = require('express');\nconst app = express();\n\napp.get('/users', (req, res) => {\n  res.json({ users: [] });\n});\n\napp.listen(3000);`,
      endpoints: 8,
      lastUpdated: 'hace 2 min',
    },
    {
      id: '2',
      name: 'payment-service',
      type: 'GraphQL',
      status: 'running',
      description: 'Servicio de procesamiento de pagos',
      code: `const { ApolloServer, gql } = require('apollo-server');\n\nconst server = new ApolloServer({});\nserver.listen();`,
      endpoints: 12,
      lastUpdated: 'hace 5 min',
    },
    {
      id: '3',
      name: 'notification-service',
      type: 'WebSocket',
      status: 'stopped',
      description: 'Servicio de notificaciones en tiempo real',
      code: `const WebSocket = require('ws');\nconst wss = new WebSocket.Server({ port: 8080 });`,
      endpoints: 4,
      lastUpdated: 'hace 1 hora',
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedMicroservice, setSelectedMicroservice] = useState<MicroserviceData | null>(null);

  const handleCreateMicroservice = (data: {
    name: string;
    type: string;
    description: string;
    code: string;
  }) => {
    const newMicroservice: MicroserviceData = {
      id: Date.now().toString(),
      name: data.name,
      type: data.type,
      status: 'stopped',
      description: data.description,
      code: data.code,
      endpoints: 0,
      lastUpdated: 'hace un momento',
    };

    setMicroservices([...microservices, newMicroservice]);
  };

  const handleEditMicroservice = (microservice: MicroserviceData) => {
    setSelectedMicroservice(microservice);
    setIsEditModalOpen(true);
  };

  const handleSaveCode = (code: string) => {
    if (selectedMicroservice) {
      setMicroservices(
        microservices.map((ms) =>
          ms.id === selectedMicroservice.id
            ? { ...ms, code, lastUpdated: 'hace un momento' }
            : ms
        )
      );
    }
  };

  const handleDeleteMicroservice = (id: string) => {
    const microservice = microservices.find((ms) => ms.id === id);
    if (microservice) {
      const confirmDelete = window.confirm(
        `¿Estás seguro de que quieres eliminar "${microservice.name}"?`
      );
      if (confirmDelete) {
        setMicroservices(microservices.filter((ms) => ms.id !== id));
      }
    }
  };

  const handleViewStatus = (microservice: MicroserviceData) => {
    setSelectedMicroservice(microservice);
    setIsStatusModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setMicroservices(
      microservices.map((ms) =>
        ms.id === id
          ? {
              ...ms,
              status: ms.status === 'running' ? 'stopped' : 'running',
              lastUpdated: 'hace un momento',
            }
          : ms
      )
    );
  };

  return (
    <div className="microservices-page">
      <div className="microservices-page__header">
        <button
          className="microservices-page__create-btn"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="microservices-page__create-icon" />
          Nuevo Microservicio
        </button>
      </div>

      <div className="microservices-page__grid">
        {microservices.map((microservice) => (
          <MicroserviceCard
            key={microservice.id}
            microservice={microservice}
            onEdit={handleEditMicroservice}
            onDelete={handleDeleteMicroservice}
            onViewStatus={handleViewStatus}
            onToggleStatus={handleToggleStatus}
          />
        ))}

        {microservices.length === 0 && (
          <div className="microservices-page__empty">
            <p className="microservices-page__empty-text">
              No hay microservicios creados
            </p>
            <button
              className="microservices-page__empty-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Crear primer microservicio
            </button>
          </div>
        )}
      </div>

      <CreateMicroserviceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateMicroservice={handleCreateMicroservice}
      />

      <EditCodeModal
        isOpen={isEditModalOpen}
        microserviceName={selectedMicroservice?.name || ''}
        currentCode={selectedMicroservice?.code || ''}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMicroservice(null);
        }}
        onSave={handleSaveCode}
      />

      <MicroserviceStatusModal
        isOpen={isStatusModalOpen}
        microservice={selectedMicroservice}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedMicroservice(null);
        }}
      />
    </div>
  );
};

export default Microservices;