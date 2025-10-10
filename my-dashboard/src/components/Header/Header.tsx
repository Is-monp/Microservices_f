import React, { useEffect, useState } from 'react';
import './Header.scss';

const Header: React.FC = () => {
  const [userName, setUserName] = useState<string>('Usuario');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          // Capitalizar el nombre
          const formattedName =
            parsed.name.charAt(0).toUpperCase() + parsed.name.slice(1).toLowerCase();
          setUserName(formattedName);
        }
      }
    } catch (error) {
      console.error('Error al leer usuario:', error);
    }
  }, []);

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__welcome">
          <h1 className="header__title">Hola, {userName}</h1>
          <p className="header__subtitle">Gestiona y monitorea tus microservicios</p>
        </div>

        <div className="header__actions">
          <div className="header__avatar">
            <span>{userName.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
