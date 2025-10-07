// 1. App.tsx - Configuración principal del router
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';
import Microservices from './Pages/Microservices/Microservices';
import Settings from './Pages/Settings/Settings';
import Layout from './components/Layout/Layout';
import AuthContainer from './Pages/AuthContainer/AuthContainer';
import './main.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Ruta principal con Layout */}
          <Route path="/" element={<Layout/>}>
            {/* Dashboard como página principal */}
            <Route index element={<Dashboard />} />

            {/* Rutas de navegación */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="microservices" element={<Microservices />} />
            <Route path="settings" element={<Settings />} />

            {/* Redirección para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;