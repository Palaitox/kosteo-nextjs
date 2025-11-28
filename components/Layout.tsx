import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Pages that don't need header/sidebar
    const noLayoutPages = ['/', '/login'];
    const showLayout = !noLayoutPages.includes(router.pathname);

    if (!showLayout) {
        return <>{children}</>;
    }

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className={`layout-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
            <main className="main-layout">
                <div className="k-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
