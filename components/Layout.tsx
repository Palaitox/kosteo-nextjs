import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();

    // Pages that don't need header/sidebar
    const noLayoutPages = ['/', '/login'];
    const showLayout = !noLayoutPages.includes(router.pathname);

    if (!showLayout) {
        return <>{children}</>;
    }

    return (
        <>
            <Sidebar />
            <main className="main-layout">
                <div className="k-container">
                    {children}
                </div>
            </main>
        </>
    );
};

export default Layout;
