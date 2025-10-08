import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Server,
    Settings as SettingsIcon,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import './Sidebar.scss';

interface MenuItem {
    path: string;
    icon: React.ReactElement;
    label: string;
}

interface SidebarProps {
    onToggle?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);
                if (onToggle) {
                    onToggle(true);
                }
            } else {
                // En pantallas grandes, mantener expandido por defecto
                setIsCollapsed(false);
                if (onToggle) {
                    onToggle(false);
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [onToggle]);

    const menuItems: MenuItem[] = [
        {
            path: '/dashboard',
            icon: <LayoutDashboard size={22} />,
            label: 'Dashboard'
        },
        {
            path: '/microservices',
            icon: <Server size={22} />,
            label: 'Microservicios'
        },
        {
            path: '/settings',
            icon: <SettingsIcon size={22} />,
            label: 'Configuración'
        }
    ];

    const toggleSidebar = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (onToggle) {
            onToggle(newCollapsedState);
        }
    };

    return (
        <>
            {/* Sidebar */}
            <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
                {/* Header */}
                <div className="sidebar__header">
                    {!isCollapsed ? (
                        <div className="sidebar__logo">
                            <div className="logo-icon">M</div>
                            <span className="logo-text">MicroManager</span>
                        </div>
                    ) : (
                        <div className="logo-icon">M</div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="sidebar__nav">
                    <ul className="sidebar__nav-list">
                        {menuItems.map((item) => (
                            <li key={item.path} className="sidebar__nav-item">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`
                                    }
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <span className="sidebar__nav-icon">{item.icon}</span>
                                    <span className="sidebar__nav-text">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Toggle Button - Inside Sidebar at Bottom */}
                <button 
                    className="sidebar__toggle" 
                    onClick={toggleSidebar}
                    aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </aside>
        </>
    );
};

export default Sidebar;