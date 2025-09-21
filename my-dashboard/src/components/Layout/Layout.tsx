import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './Layout.scss';

const Layout: React.FC = () => {
    return (
        <div className="layout">
        <Sidebar />
        <div className="layout__content">
            <Header />
            <main className="layout__main">
            <Outlet />
            </main>
        </div>
        </div>
    );
};

export default Layout;