import React from 'react';
import './TopBar.scss';

function TopBar({ userName, userRole }) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2) || 'U';
    };

    return (
        <div className="topbar">
            <div className="topbar-left">
                <div className="greeting">
                    <h2>{getGreeting()}, {userName}!</h2>
                    <p>Here's a summary of your dashboard.</p>
                </div>
            </div>

            <div className="topbar-right">
                <button className="notification-btn">
                    <span>🔔</span>
                    <span className="badge">3</span>
                </button>

                <div className="user-profile">
                    <div className="avatar">
                        {getInitials(userName)}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{userName}</div>
                        <div className="user-role">{userRole}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
