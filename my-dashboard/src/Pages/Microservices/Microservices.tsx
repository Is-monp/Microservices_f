import React, { useEffect, useState } from 'react';
import { Plus, RefreshCcw } from 'lucide-react';
import MicroserviceCard, { type MicroserviceData } from '../../components/MicroserviceCard/MicroserviceCard';
import CreateMicroserviceModal from '../../components/CreateMicroserviceModal/CreateMicroserviceModal';
import EditCodeModal from '../../components/EditCodeModal/EditCodeModal';
import MicroserviceStatusModal from '../../components/MicroserviceStatusModal/MicroserviceStatusModal';
import './Microservices.scss';

const Microservices: React.FC = () => {
  const [microservices, setMicroservices] = useState<MicroserviceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedMicroservice, setSelectedMicroservice] = useState<MicroserviceData | null>(null);

  // 🔹 Cargar datos desde el backend
  const fetchMicroservices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const API_URL = `${import.meta.env.VITE_API_URL}/containers/list`;

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Datos recibidos:', data);

      // Transformar los datos a tu estructura interna
      const mappedMicroservices: MicroserviceData[] = data.containers.map(
        (item: any, index: number) => ({
          id: (index + 1).toString(),
          name: item.containerName,
          type: item.type || 'Desconocido',
          status: item.status ? 'running' : 'stopped',
          description: item.description || 'Sin descripción',
          code: '',
          lastUpdated: new Date(item.updatedAt).toLocaleString('es-CO', {
            dateStyle: 'short',
            timeStyle: 'short',
          }),
          endpointUrl: `${import.meta.env.VITE_API_URL}/containers/${item.containerName}`,
        })
      );

      setMicroservices(mappedMicroservices);
    } catch (err) {
      console.error('💥 Error al obtener microservicios:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMicroservices();
  }, []);

  // 🔹 Crear microservicio local (solo visual)
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
      lastUpdated: 'hace un momento',
      endpointUrl: `${import.meta.env.VITE_API_URL}/containers/${data.name}`,
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
        </button>

        <button
          className="microservices-page__refresh-btn"
          onClick={fetchMicroservices}
          disabled={isLoading}
        >
          <RefreshCcw size={18} />
          {isLoading ? ' Cargando...' : ' Actualizar'}
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#ffe6e6',
            color: 'red',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '15px',
            border: '1px solid red',
          }}
        >
          {error}
        </div>
      )}

      <div className="microservices-page__grid">
        {microservices.length > 0 ? (
          microservices.map((microservice) => (
            <MicroserviceCard
              key={microservice.id}
              microservice={microservice}
              onEdit={handleEditMicroservice}
              onDelete={handleDeleteMicroservice}
              onViewStatus={handleViewStatus}
              onToggleStatus={handleToggleStatus}
            />
          ))
        ) : (
          !isLoading && (
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
          )
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
