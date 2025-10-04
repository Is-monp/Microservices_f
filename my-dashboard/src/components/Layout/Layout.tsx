import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './Layout.scss';

const Layout: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="layout">
        <Sidebar onToggle={setIsSidebarCollapsed} />
        <div className={`layout__content ${isSidebarCollapsed ? 'layout__content--expanded' : ''}`}>
            <Header />
            <main className="layout__main">
            <Outlet />
            </main>
        </div>
        </div>
    );
};

export default Layout;