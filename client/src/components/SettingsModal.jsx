import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './SettingsModal.scss';

function SettingsModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    if (!isOpen) return null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="settings-modal" onClick={handleBackdropClick}>
            <div className="settings-modal-backdrop" />

            <div className="settings-modal-content">
                <div className="modal-header">
                    <h2>Settings</h2>
                    <button className="close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <div className="setting-item">
                        <div className="setting-label">
                            <h4>Theme</h4>
                        </div>
                        <div className="setting-description">
                            Choose your preferred color scheme
                        </div>

                        <div className="theme-options">
                            <div
                                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                                onClick={() => theme === 'dark' && toggleTheme()}
                            >
                                <div className="theme-icon">☀️</div>
                                <div className="theme-name">Light</div>
                            </div>

                            <div
                                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                                onClick={() => theme === 'light' && toggleTheme()}
                            >
                                <div className="theme-icon">🌙</div>
                                <div className="theme-name">Dark</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-logout" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
