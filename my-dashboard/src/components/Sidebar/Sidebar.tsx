// components/Sidebar/Sidebar.tsx
import React from 'react';
import { Server, Activity, Globe, Settings, LogOut } from 'lucide-react';
import './Sidebar.scss';

interface MenuItem {
    icon: React.ReactElement;
    label: string;
    active: boolean;
}

const Sidebar: React.FC = () => {
    const menuItems: MenuItem[] = [
        { icon: <Server className="sidebar__menu-icon" />, label: 'Dashboard', active: true },
        { icon: <Activity className="sidebar__menu-icon" />, label: 'Microservicios', active: false },
        { icon: <Globe className="sidebar__menu-icon" />, label: 'Endpoints', active: false },
        { icon: <Settings className="sidebar__menu-icon" />, label: 'Configuración', active: false },
    ];

    return (
        <div className="sidebar">
        {/* Logo */}
        <div className="sidebar__header">
            <div className="sidebar__logo">
            <Server className="sidebar__logo-icon" />
            </div>
            <span className="sidebar__brand">MicroManager</span>
        </div>

        {/* Menu Items */}
        <nav className="sidebar__nav">
            {menuItems.map((item, index) => (
            <div
                key={index}
                className={`sidebar__menu-item ${item.active ? 'sidebar__menu-item--active' : ''}`}
            >
                {item.icon}
                <span className="sidebar__menu-label">{item.label}</span>
            </div>
            ))}
        </nav>

        {/* Bottom Menu */}
        <div className="sidebar__footer">
            <div className="sidebar__menu-item">
            <LogOut className="sidebar__menu-icon" />
            <span className="sidebar__menu-label">Cerrar Sesión</span>
            </div>
        </div>
        </div>
    );
};

export default Sidebar;