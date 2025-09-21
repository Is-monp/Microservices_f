import React from 'react';
import { Server, Globe, Activity, Eye } from 'lucide-react';
import StatsCard from '../../components/StatsCard/StatsCard';
import MicroservicesTable from '../../components/MicroservicesTable/MicroservicesTable';
import ActivityChart from '../../components/ActivityChart/ActivityChart';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="dashboard__stats">
        <StatsCard
          title="Microservicios Activos"
          value="12"
          subtitle="3 nuevos esta semana"
          color="yellow"
          icon={<Server className="stats-card__icon" />}
        />
        <StatsCard
          title="Total Endpoints"
          value="48"
          subtitle="8 endpoints nuevos"
          color="purple"
          icon={<Globe className="stats-card__icon" />}
        />
        <StatsCard
          title="Servicios Saludables"
          value="11"
          subtitle="92% de disponibilidad"
          color="green"
          icon={<Activity className="stats-card__icon" />}
        />
        <StatsCard
          title="Latencia Promedio"
          value="45ms"
          subtitle="15ms mejor que ayer"
          color="blue"
          icon={<Eye className="stats-card__icon" />}
        />
      </div>

      {/* Charts and System Status */}
      <div className="dashboard__charts">
        <div className="dashboard__chart-main">
          <ActivityChart />
        </div>
      </div>

      {/* Microservices Table */}
      <div className="dashboard__table">
        <MicroservicesTable />
      </div>
    </div>
  );
};

export default Dashboard;