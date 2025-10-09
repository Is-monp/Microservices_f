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

  // Cargar microservicios del backend
  const fetchMicroservices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No se encontró el token de autenticación');

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
      console.error('Error al obtener microservicios:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMicroservices();
  }, []);

  // Crear microservicio (proceso de dos pasos)
  const handleCreateMicroservice = async (data: {
    name: string;
    type: string;
    description: string;
    code: string;
  }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No se encontró el token de autenticación.');
      return;
    }

    try {
      // Paso 1: subir el archivo Python como imagen
      const formData = new FormData();
      const pythonFile = new File([data.code], 'app.py', { type: 'text/x-python' });

      // El backend en Go espera el campo llamado "app"
      formData.append('app', pythonFile, 'app.py');
      formData.append('name', data.name);

      console.log('Enviando FormData a /new/image ...');
      for (const [key, value] of formData.entries()) {
        console.log('Campo en FormData:', key, value);
      }

      const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/new/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadText = await uploadResponse.text();
      console.log('Respuesta del backend (/new/image):', uploadText);

      if (!uploadResponse.ok) {
        throw new Error(`Error ${uploadResponse.status}: ${uploadText}`);
      }

      // Paso 2: crear el contenedor con más campos
      const containerPayload = {
        image: data.name,
        type: data.type,
        description: data.description,
      };

      const containerResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/new/container`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(containerPayload),
        }
      );

      const containerText = await containerResponse.text();
      if (!containerResponse.ok) {
        throw new Error(`Error ${containerResponse.status}: ${containerText}`);
      }

      alert('Contenedor creado correctamente.');
      setIsCreateModalOpen(false);
      await fetchMicroservices();
    } catch (error) {
      console.error('Error al crear microservicio:', error);
      alert('No se pudo crear el contenedor. Revisa los logs.');
    }
  };

  // Eliminar microservicio
  const handleDeleteMicroservice = async (id: string, name: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No se encontró el token de autenticación.');
      return;
    }

    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar el contenedor "${name}"?`
    );
    if (!confirmDelete) return;

    try {
      // Paso 1: detener contenedor antes de eliminar
      await fetch(`${import.meta.env.VITE_API_URL}/stop/container`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: name }),
      });

      // Paso 2: eliminar contenedor
      const removeResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/remove/container`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: name }),
        }
      );

      const removeText = await removeResponse.text();
      if (!removeResponse.ok) {
        throw new Error(`Error ${removeResponse.status}: ${removeText}`);
      }

      alert(`Contenedor "${name}" eliminado correctamente.`);
      await fetchMicroservices();
    } catch (error) {
      console.error('Error al eliminar contenedor:', error);
      alert('No se pudo eliminar el contenedor.');
    }
  };

  const handleViewStatus = (microservice: MicroserviceData) => {
    setSelectedMicroservice(microservice);
    setIsStatusModalOpen(true);
  };

  const handleToggleStatus = async (id: string, name: string, status: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No se encontró el token de autenticación.');
      return;
    }

    const endpoint =
      status === 'running'
        ? `${import.meta.env.VITE_API_URL}/stop/container`
        : `${import.meta.env.VITE_API_URL}/start/container`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: name }),
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${text}`);
      }

      await fetchMicroservices();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('No se pudo cambiar el estado del contenedor.');
    }
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
              onDelete={() =>
                handleDeleteMicroservice(microservice.id, microservice.name)
              }
              onViewStatus={() => handleViewStatus(microservice)}
              onToggleStatus={() =>
                handleToggleStatus(
                  microservice.id,
                  microservice.name,
                  microservice.status
                )
              }
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
        onSave={() => {}}
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
