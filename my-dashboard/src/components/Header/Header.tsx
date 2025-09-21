import React from 'react';
import './Header.scss';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header__content">
                <div className="header__welcome">
                <h1 className="header__title">Hola, Isabella</h1>
                <p className="header__subtitle">Gestiona y monitorea tus microservicios</p>
                </div>
                
                <div className="header__actions">
                    <div className="header__avatar">
                        <span>I</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;