import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Server, 
    BarChart3, 
    Settings as SettingsIcon,
} from 'lucide-react';
import './Sidebar.scss';

interface MenuItem {
    path: string;
    icon: React.ReactElement;
    label: string;
}

const Sidebar: React.FC = () => {
    const menuItems: MenuItem[] = [
        { 
            path: '/dashboard', 
            icon: <LayoutDashboard size={20} />, 
            label: 'Dashboard' 
        },
        { 
            path: '/microservices', 
            icon: <Server size={20} />, 
            label: 'Microservicios'
        },
        { 
            path: '/analytics', 
            icon: <BarChart3 size={20} />, 
            label: 'Analytics' 
        },
        { 
            path: '/settings', 
            icon: <SettingsIcon size={20} />, 
            label: 'Configuración' 
        }
    ];

    return (
        <aside className="sidebar">
            {/* Header */}
            <div className="sidebar__header">
                <div className="sidebar__logo">
                    <div className="logo-icon">M</div>
                    <span className="logo-text">MicroManager</span>
                </div>
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
                            >
                                <span className="sidebar__nav-icon">{item.icon}</span>
                                <span className="sidebar__nav-text">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;