import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="brand">
                    <span>Kosteo</span>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">v2.0</span>
                </div>
                <nav className="nav">
                    {/* Header links if needed */}
                </nav>
            </div>
        </header>
    );
};

export default Header;
