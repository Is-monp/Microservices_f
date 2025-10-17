import React, { useEffect, useState } from "react";
import { Plus, RefreshCcw, Loader2 } from "lucide-react";
import MicroserviceCard, {
  type MicroserviceData,
} from "../../components/MicroserviceCard/MicroserviceCard";
import CreateMicroserviceModal from "../../components/CreateMicroserviceModal/CreateMicroserviceModal";
import EditCodeModal from "../../components/EditCodeModal/EditCodeModal";
import MicroserviceStatusModal from "../../components/MicroserviceStatusModal/MicroserviceStatusModal";
import "./Microservices.scss";

const Microservices: React.FC = () => {
  const [microservices, setMicroservices] = useState<MicroserviceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedMicroservice, setSelectedMicroservice] =
    useState<MicroserviceData | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // NUEVO

  const fetchMicroservices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No se encontró el token de autenticación");

      const API_URL = `${import.meta.env.VITE_API_URL}/containers/list`;

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      const data = await response.json();
      const containers = Array.isArray(data?.containers) ? data.containers : [];

      const mapped: MicroserviceData[] = containers.map(
        (item: any, i: number) => ({
          id: (i + 1).toString(),
          name: item.containerName,
          type: item.type || "Desconocido",
          status: item.status ? "running" : "stopped",
          description: item.description || "Sin descripción",
          code: "",
          lastUpdated: new Date(item.updatedAt).toLocaleString("es-CO", {
            dateStyle: "short",
            timeStyle: "short",
          }),
          endpointUrl: `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/${
            item.containerName
          }`,
        })
      );

      setMicroservices(mapped);
    } catch (err) {
      console.error("Error al obtener microservicios:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMicroservices();
  }, []);

  // Crear microservicio
  const handleCreateMicroservice = async (data: any) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("No se encontró el token.");

    setLoadingAction("Creando microservicio...");
    try {
      const formData = new FormData();
      const pythonFile = new File([data.code], "app.py", {
        type: "text/x-python",
      });
      formData.append("app", pythonFile, "app.py");
      formData.append("name", data.name);

      const upload = await fetch(`${import.meta.env.VITE_API_URL}/new/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!upload.ok) throw new Error(await upload.text());

      const payload = {
        image: data.name,
        type: data.type,
        description: data.description,
      };

      const container = await fetch(
        `${import.meta.env.VITE_API_URL}/new/container`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!container.ok) throw new Error(await container.text());
      alert("Microservicio creado correctamente.");
      setIsCreateModalOpen(false);
      await fetchMicroservices();
    } catch (e) {
      console.error("Error:", e);
      alert("No se pudo crear el microservicio.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Editar microservicio
  const handleEditMicroservice = async (updatedData: any) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("No se encontró el token.");

    setLoadingAction("Actualizando microservicio...");
    try {
      const formData = new FormData();
      const pythonFile = new File([updatedData.code], "app.py", {
        type: "text/x-python",
      });
      formData.append("app", pythonFile, "app.py");
      formData.append("name", updatedData.name);
      formData.append("type", updatedData.type);
      formData.append("description", updatedData.description);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/edit/container`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error(await res.text());
      alert("Microservicio actualizado correctamente.");
      setIsEditModalOpen(false);
      await fetchMicroservices();
    } catch (e) {
      console.error(e);
      alert("Error al actualizar microservicio.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Cambiar estado (start/stop)
  const handleToggleStatus = async (
    id: string,
    name: string,
    status: string
  ) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("No se encontró el token.");

    const action = status === "running" ? "Deteniendo" : "Iniciando";
    setLoadingAction(`${action} microservicio...`);

    const endpoint =
      status === "running"
        ? `${import.meta.env.VITE_API_URL}/stop/container`
        : `${import.meta.env.VITE_API_URL}/start/container`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: name }),
      });

      if (!res.ok) throw new Error(await res.text());
      await fetchMicroservices();
    } catch (e) {
      console.error(e);
      alert("Error al cambiar estado.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Eliminar
  const handleDeleteMicroservice = async (id: string, name: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("No se encontró el token.");

    const confirmDelete = window.confirm(`¿Eliminar "${name}"?`);
    if (!confirmDelete) return;

    setLoadingAction("Eliminando microservicio...");
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/stop/container`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: name }),
      });

      const remove = await fetch(
        `${import.meta.env.VITE_API_URL}/remove/container`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: name }),
        }
      );

      if (!remove.ok) throw new Error(await remove.text());
      await fetchMicroservices();
    } catch (e) {
      console.error(e);
      alert("Error al eliminar.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="microservices-page">
      {loadingAction && (
        <div className="loading-overlay">
          <Loader2 className="spinner" />
          <p>{loadingAction}</p>
        </div>
      )}

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
          {isLoading ? " Cargando..." : " Actualizar"}
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#ffe6e6",
            color: "red",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "15px",
            border: "1px solid red",
          }}
        >
          {error}
        </div>
      )}

      <div className="microservices-page__grid">
        {microservices.length > 0
          ? microservices.map((m) => (
              <MicroserviceCard
                key={m.id}
                microservice={m}
                onDelete={() => handleDeleteMicroservice(m.id, m.name)}
                onViewStatus={() => {
                  setSelectedMicroservice(m);
                  setIsStatusModalOpen(true);
                }}
                onToggleStatus={() =>
                  handleToggleStatus(m.id, m.name, m.status)
                }
                onEdit={() => {
                  setSelectedMicroservice(m);
                  setIsEditModalOpen(true);
                }}
              />
            ))
          : !isLoading && (
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
        microserviceName={selectedMicroservice?.name || ""}
        currentCode={selectedMicroservice?.code || ""}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMicroservice(null);
        }}
        onSave={async (newCode) => {
          if (!selectedMicroservice) return;
          await handleEditMicroservice({
            name: selectedMicroservice.name,
            type: selectedMicroservice.type,
            description: selectedMicroservice.description,
            code: newCode,
          });
        }}
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
