import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Package, CreditCard, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { storage } from '@/lib/storage';

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
    const router = useRouter();

    const isActive = (path: string) => {
        return router.pathname === path ? 'active' : '';
    };

    const handleLogout = () => {
        // Clear user data
        storage.remove('user');
        router.push('/login');
    };

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/productos', label: 'Productos', icon: Package },
        { href: '/transacciones', label: 'Transacciones', icon: CreditCard },
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="brand-text">
                    {isCollapsed ? 'K' : 'Kosteo'}
                </div>
            </div>
            <div className="sidebar-content">
                <nav>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={isActive(item.href)}
                            title={isCollapsed ? item.label : ''}
                        >
                            <item.icon />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
            <button
                onClick={handleLogout}
                className="sidebar-logout"
                title="Cerrar Sesión"
            >
                <LogOut size={20} />
                {!isCollapsed && <span>Salir</span>}
            </button>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </div>
        </aside>
    );
};

export default Sidebar;
