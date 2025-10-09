import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';
import Microservices from './Pages/Microservices/Microservices';
import Settings from './Pages/Settings/Settings';
import Layout from './components/Layout/Layout';
import AuthContainer from './Pages/AuthContainer/AuthContainer';
import './main.scss';

// 🔒 Componente para proteger rutas
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/auth" replace />;
};

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>

          {/* 🔹 Ruta de login / registro */}
          <Route path="/auth" element={<AuthContainer />} />

          {/* 🔹 Rutas protegidas dentro del Layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Dashboard como página principal */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="microservices" element={<Microservices />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 🔹 Redirección global (si no hay ruta válida) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
