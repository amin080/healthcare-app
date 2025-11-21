import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import logo from '../assets/logo.png';

function Sidebar({ userRole, onSettingsClick }) {
    const navigate = useNavigate();
    const location = useLocation();

    const getNavItems = () => {
        switch (userRole) {
            case 'finance':
                return [
                    { path: '/finance', label: 'Dashboard', icon: '📊' },
                ];
            case 'doctor':
                return [
                    { path: '/doctor', label: 'Dashboard', icon: '🏥' },
                ];
            case 'patient':
                return [
                    { path: '/patient', label: 'Dashboard', icon: '🗓️' },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <img src={logo} alt="Kayan Healthcare" />
                    <div className="brand-name">
                        Kayan
                        <span className="brand-sub">Healthcare</span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <a
                        key={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item" onClick={onSettingsClick}>
                    <span className="nav-icon">⚙️</span>
                    <span className="nav-label">Settings</span>
                </button>

                <button className="nav-item">
                    <span className="nav-icon">❓</span>
                    <span className="nav-label">Help</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
