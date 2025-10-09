import React, { useEffect, useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Settings.scss';

interface UserInfo {
  name: string;
  email: string;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      navigate('/auth');
    }
  };

  if (!user) {
    return (
      <div className="settings-page">
        <div className="settings-page__container">
          <p>Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-page__container">
        <div className="settings-page__header">
          <div className="settings-page__avatar">
            <User />
          </div>
          <div className="settings-page__user">
            <h1 className="settings-page__name">{user.name}</h1>
            <p className="settings-page__email">{user.email}</p>
          </div>
        </div>

        <div className="settings-page__section">
          <h2 className="settings-page__section-title">Información Personal</h2>

          <div className="settings-field">
            <label className="settings-field__label">Usuario</label>
            <div className="settings-field__value">{user.name}</div>
          </div>

          <div className="settings-field">
            <label className="settings-field__label">Email</label>
            <div className="settings-field__value">{user.email}</div>
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
