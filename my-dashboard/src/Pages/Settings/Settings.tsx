import React from 'react';
import { User, Mail, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Settings.scss';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      // Aquí puedes agregar la lógica de logout (limpiar tokens, etc.)
      navigate('/auth');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-page__container">
        <div className="settings-page__header">
          <div className="settings-page__avatar">
            <User />
          </div>
          <div className="settings-page__user">
            <h1 className="settings-page__name">Juan Pérez</h1>
            <p className="settings-page__email">juan.perez@example.com</p>
          </div>
        </div>

        <div className="settings-page__section">
          <h2 className="settings-page__section-title">Información Personal</h2>
          
          <div className="settings-field">
            <label className="settings-field__label">Nombre</label>
            <div className="settings-field__value">Juan Pérez</div>
          </div>

          <div className="settings-field">
            <label className="settings-field__label">Email</label>
            <div className="settings-field__value">juan.perez@example.com</div>
          </div>
        </div>

        <button className="settings-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;