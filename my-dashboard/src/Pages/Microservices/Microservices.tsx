import React, { useEffect, useState } from "react";
import { Plus, RefreshCcw, Loader2 } from "lucide-react";
import MicroserviceCard, {
  type MicroserviceData,
} from "../../components/MicroserviceCard/MicroserviceCard";
import CreateMicroserviceModal from "../../components/CreateMicroserviceModal/CreateMicroserviceModal";
import EditCodeModal from "../../components/EditCodeModal/EditCodeModal";
import MicroserviceStatusModal from "../../components/MicroserviceStatusModal/MicroserviceStatusModal";
import { authenticatedFetch } from "../../api/auth"; // ✅ usa el helper central
import "./Microservices.scss";

const Microservices: React.FC = () => {
  const [microservices, setMicroservices] = useState<MicroserviceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedMicroservice, setSelectedMicroservice] =
    useState<MicroserviceData | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_URL;

  // === Obtener lista de contenedores ===
  const fetchMicroservices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authenticatedFetch(`${API}/containers/list`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const containers = Array.isArray(data?.containers)
        ? data.containers
        : [];

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
          endpointUrl: `${API}/containers/${item.containerName}`,
        })
      );

      setMicroservices(mapped);
    } catch (err) {
      console.error("Error al obtener microservicios:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar microservicios"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMicroservices();
  }, []);

  // === Crear microservicio ===
  const handleCreateMicroservice = async (data: any) => {
    setLoadingAction("Creando microservicio...");
    try {
      const formData = new FormData();
      const pythonFile = new File([data.code], "app.py", {
        type: "text/x-python",
      });
      formData.append("app", pythonFile, "app.py");
      formData.append("name", data.name);

      const upload = await authenticatedFetch(`${API}/new/image`, {
        method: "POST",
        body: formData,
      });
      if (!upload.ok) throw new Error(await upload.text());

      const payload = {
        image: data.name,
        type: data.type,
        description: data.description,
      };

      const container = await authenticatedFetch(`${API}/new/container`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!container.ok) throw new Error(await container.text());
      alert("Microservicio creado correctamente.");
      setIsCreateModalOpen(false);
      await fetchMicroservices();
    } catch (e) {
      console.error(e);
      alert("No se pudo crear el microservicio.");
    } finally {
      setLoadingAction(null);
    }
  };

  // === Editar microservicio ===
  const handleEditMicroservice = async (updatedData: any) => {
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

      const res = await authenticatedFetch(`${API}/edit/container`, {
        method: "POST",
        body: formData,
      });

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

  // === Cambiar estado (start/stop) ===
  const handleToggleStatus = async (
    id: string,
    name: string,
    status: string
  ) => {
    const action = status === "running" ? "Deteniendo" : "Iniciando";
    setLoadingAction(`${action} microservicio...`);

    const endpoint =
      status === "running"
        ? `${API}/stop/container`
        : `${API}/start/container`;

    try {
      const res = await authenticatedFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: name }),
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchMicroservices();
    } catch (e) {
      console.error(e);
      alert("Error al cambiar estado del microservicio.");
    } finally {
      setLoadingAction(null);
    }
  };

  // === Eliminar microservicio ===
  const handleDeleteMicroservice = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`¿Eliminar "${name}"?`);
    if (!confirmDelete) return;

    setLoadingAction("Eliminando microservicio...");
    try {
      await authenticatedFetch(`${API}/stop/container`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: name }),
      });

      const remove = await authenticatedFetch(`${API}/remove/container`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: name }),
      });

      if (!remove.ok) throw new Error(await remove.text());
      await fetchMicroservices();
    } catch (e) {
      console.error(e);
      alert("Error al eliminar microservicio.");
    } finally {
      setLoadingAction(null);
    }
  };

  // === Render ===
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
        {microservices.length > 0 ? (
          microservices.map((m) => (
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

      {/* Modales */}
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
