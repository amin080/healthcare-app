import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SettingsModal from './SettingsModal';
import './Layout.scss';

function Layout({ children, userRole, userName }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="layout">
            <Sidebar
                userRole={userRole}
                onSettingsClick={() => setIsSettingsOpen(true)}
            />

            <div className="layout-main">
                <TopBar userName={userName} userRole={userRole} />

                <div className="layout-content">
                    {children}
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}

export default Layout;
