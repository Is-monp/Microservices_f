// Dashboard.tsx
import React from 'react';
import { Search, Bell, Server, Globe, Activity, Eye } from 'lucide-react';
import Sidebar from './components/Sidebar/Sidebar';
import StatsCard from './components/StatsCard/StatsCard';
import MicroservicesTable from './components/MicroservicesTable/MicroservicesTable';
import ActivityChart from './components/ActivityChart/ActivityChart';
import SystemStatus from './components/SystemStatus/SystemStatus';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      
      <div className="dashboard__content">
        {/* Header */}
        <header className="dashboard__header">
          <div className="dashboard__header-content">
            <div className="dashboard__welcome">
              <h1 className="dashboard__title">Hola, Isabella</h1>
              <p className="dashboard__subtitle">Gestiona y monitorea tus microservicios</p>
            </div>
            
            <div className="dashboard__header-actions">
              <div className="dashboard__search">
                <Search className="dashboard__search-icon" />
                <input 
                  type="text" 
                  placeholder="Buscar microservicios..." 
                  className="dashboard__search-input"
                />
              </div>
              
              <button className="dashboard__notification-btn">
                <Bell className="dashboard__notification-icon" />
                <span className="dashboard__notification-badge"></span>
              </button>
              
              <div className="dashboard__avatar">
                <span>D</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard__main">
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;