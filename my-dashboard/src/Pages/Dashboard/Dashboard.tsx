import React, { useEffect, useState } from 'react';
import { Server, Globe, Activity } from 'lucide-react';
import StatsCard from '../../components/StatsCard/StatsCard';
import MicroservicesTable from '../../components/MicroservicesTable/MicroservicesTable';
import ActivityChart from '../../components/ActivityChart/ActivityChart';
import './Dashboard.scss';

interface GraphicData {
  labels: string[];
  deployments: number[];
  errors: number[];
}

interface ContainerItem {
  containerName: string;
  status: boolean;
  description: string;
  updatedAt: string;
  type: string;
}

interface LastContainer {
  containerName: string;
  status: boolean;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [graphicData, setGraphicData] = useState<GraphicData>({
    labels: [],
    deployments: [],
    errors: [],
  });
  const [containers, setContainers] = useState<ContainerItem[]>([]);
  const [lastContainer, setLastContainer] = useState<LastContainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('accessToken');

  const fetchDashboardData = async () => {
    if (!token) {
      setError('No se encontró el token de autenticación');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // Ejecutar peticiones en paralelo
      const [graphicRes, lastRes, listRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/containers/graphic`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/containers/last`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/containers/list`, { headers }),
      ]);

      if (!graphicRes.ok || !lastRes.ok || !listRes.ok) {
        throw new Error('Error obteniendo datos del dashboard');
      }

      const graphicData = await graphicRes.json();
      const lastData = await lastRes.json();
      const listData = await listRes.json();

      setGraphicData(graphicData);
      setLastContainer(lastData);
      setContainers(listData.containers || []);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar el dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calcular métricas a partir de /list
  const totalMicroservices = containers.length;
  const activeMicroservices = containers.filter((c) => c.status).length;
  const healthyPercent =
    totalMicroservices > 0
      ? Math.round((activeMicroservices / totalMicroservices) * 100)
      : 0;

  // Obtener el contenedor actualizado más recientemente
  const latestContainer = containers.reduce((latest, current) => {
    return !latest || new Date(current.updatedAt) > new Date(latest.updatedAt)
      ? current
      : latest;
  }, null as ContainerItem | null);

  return (
    <div className="dashboard">
      {isLoading ? (
        <div className="dashboard__loading">
          <div className="spinner"></div>
          <p>Cargando datos del dashboard...</p>
        </div>
      ) : error ? (
        <div className="dashboard__error">{error}</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="dashboard__stats">
            <StatsCard
              title="Microservicios Totales"
              value={totalMicroservices.toString()}
              subtitle={`${activeMicroservices} activos actualmente`}
              color="yellow"
              icon={<Server className="stats-card__icon" />}
            />
            <StatsCard
              title="Última Actualización"
              value={
                latestContainer
                  ? new Date(latestContainer.updatedAt).toLocaleString('es-CO', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })
                  : '--'
              }
              subtitle={
                latestContainer
                  ? `Actualizado: ${latestContainer.containerName}`
                  : 'Sin registros recientes'
              }
              color="purple"
              icon={<Globe className="stats-card__icon" />}
            />
            <StatsCard
              title="Microservicios Saludables"
              value={`${healthyPercent}%`}
              subtitle={`${activeMicroservices} de ${totalMicroservices} activos`}
              color="green"
              icon={<Activity className="stats-card__icon" />}
            />
          </div>

          {/* Charts */}
          <div className="dashboard__charts">
            <div className="dashboard__chart-main">
              <ActivityChart
                labels={graphicData.labels}
                deployments={graphicData.deployments}
                errors={graphicData.errors}
              />
            </div>
          </div>

          {/* Table */}
          <div className="dashboard__table">
            <MicroservicesTable data={containers} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
