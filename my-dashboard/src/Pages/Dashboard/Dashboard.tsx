import React, { useEffect, useState } from 'react';
import { Server, Globe, Activity } from 'lucide-react';
import StatsCard from '../../components/StatsCard/StatsCard';
import MicroservicesTable from '../../components/MicroservicesTable/MicroservicesTable';
import ActivityChart from '../../components/ActivityChart/ActivityChart';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const [graphicData, setGraphicData] = useState<{ labels: string[]; deployments: number[]; errors: number[] }>({
    labels: [],
    deployments: [],
    errors: [],
  });
  const [lastContainer, setLastContainer] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // containers/graphic
        const resGraphic = await fetch(`${import.meta.env.VITE_API_URL}/containers/graphic`, { headers });
        const graphic = await resGraphic.json();
        setGraphicData(graphic);

        //containers/last
        const resLast = await fetch(`${import.meta.env.VITE_API_URL}/containers/last`, { headers });
        const last = await resLast.json();
        setLastContainer(last);

        // containers/history
        const resHistory = await fetch(`${import.meta.env.VITE_API_URL}/containers/history`, { headers });
        const hist = await resHistory.json();
        setHistory(hist.containers || []);
      } catch (err) {
        console.error('Error al cargar datos del Dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchAll();
  }, [token]);

  const activeCount = history.filter((c) => c.status === true).length;
  const totalCount = history.length;

  return (
    <div className="dashboard">
      {isLoading ? (
        <p style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>Cargando datos del Dashboard...</p>
      ) : (
        <>
          {/* Stats */}
          <div className="dashboard__stats">
            <StatsCard
              title="Microservicios Creados"
              value={totalCount.toString()}
              subtitle={`${activeCount} activos`}
              color="yellow"
              icon={<Server className="stats-card__icon" />}
            />

            <StatsCard
              title="Última Actualización"
              value={
                lastContainer
                  ? new Date(lastContainer.createdAt).toLocaleString('es-CO', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })
                  : '-'
              }
              subtitle={lastContainer?.containerName || 'Sin registros'}
              color="purple"
              icon={<Globe className="stats-card__icon" />}
            />

            <StatsCard
              title="Microservicios Activos"
              value={`${((activeCount / (totalCount || 1)) * 100).toFixed(0)}%`}
              subtitle={`${activeCount} activos de ${totalCount}`}
              color="green"
              icon={<Activity className="stats-card__icon" />}
            />
          </div>

          {/* Chart */}
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
            <MicroservicesTable data={history} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
