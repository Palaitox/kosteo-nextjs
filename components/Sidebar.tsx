import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar: React.FC = () => {
    const router = useRouter();

    const isActive = (path: string) => {
        return router.pathname === path ? 'active' : '';
    };

    const navItems = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/productos', label: 'Productos' },
        { href: '/transacciones', label: 'Transacciones' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="brand-text">Kosteo</div>
                <div className="text-xs text-zinc-500 mt-1">Gestión Inteligente</div>
            </div>
            <div className="sidebar-content">
                <nav>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={isActive(item.href)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
