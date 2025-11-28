import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fmtMoney, fmtPercent } from '@/lib/utils';
import { Package, DollarSign, TrendingUp, Archive, ShoppingCart, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardStats {
    totalProducts: number;
    inventoryValueCost: number;
    inventoryValuePvp: number;
    totalVentasCount: number;
    totalVentasValue: number;
    totalComprasCount: number;
    totalComprasValue: number;
}

interface ActivityItem {
    id: string;
    type: 'VENTA' | 'COMPRA';
    product_name: string;
    total_price?: number;
    total_cost?: number;
    date: string;
    status: string;
}

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/v1/dashboard/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
                setRecentActivity(data.recentActivity);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            label: 'Nuevo Producto',
            href: '/productos',
            icon: Package,
            theme: 'blue',
            desc: 'Registrar inventario'
        },
        {
            label: 'Nueva Venta',
            href: '/transacciones',
            icon: TrendingUp,
            theme: 'emerald',
            desc: 'Registrar salida'
        },
        {
            label: 'Nueva Compra',
            href: '/transacciones',
            icon: ShoppingCart,
            theme: 'amber',
            desc: 'Registrar entrada'
        },
    ];

    const statCards = [
        {
            label: 'Productos',
            value: stats?.totalProducts || 0,
            icon: Package,
            iconTheme: 'stat-icon blue',
            tag: 'Total'
        },
        {
            label: 'Ventas Totales',
            value: fmtMoney(stats?.totalVentasValue || 0),
            icon: TrendingUp,
            iconTheme: 'stat-icon emerald',
            tag: 'Ingresos'
        },
        {
            label: 'Compras Totales',
            value: fmtMoney(stats?.totalComprasValue || 0),
            icon: ShoppingCart,
            iconTheme: 'stat-icon amber',
            tag: 'Egresos'
        }
    ];

    return (
        <>
            <Head>
                <title>Dashboard — Kosteo</title>
            </Head>
            <div className="fade-in pb-10">
                <div className="page-heading mb-8">
                    <h1>Resumen General</h1>
                    <p>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="stat-grid mb-12">
                    {statCards.map((card, index) => (
                        <div key={index} className="card stat-card">
                            <div className="flex items-start justify-between mb-5">
                                <div className={card.iconTheme}>
                                    <card.icon size={22} />
                                </div>
                                <span className="stat-tag">{card.tag}</span>
                            </div>
                            <p className="stat-label">{card.label}</p>
                            <p className="stat-value">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="quick-grid">
                    <div className="card quick-actions-card">
                        <h2>Acciones Rápidas</h2>
                        <div className="space-y-4">
                            {quickActions.map((action, index) => (
                                <Link href={action.href} key={index} className="quick-action">
                                    <div className={`quick-action__icon ${action.theme}`}>
                                        <action.icon size={22} />
                                    </div>
                                    <div className="quick-action__text">
                                        <h3>{action.label}</h3>
                                        <p>{action.desc}</p>
                                    </div>
                                    <ArrowRight size={20} className="quick-action__chevron" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="card activity-card">
                        <h2>Actividad Reciente</h2>
                        <div className="activity-list">
                            {recentActivity.map((item) => (
                                <div key={item.id} className="activity-item">
                                    <div className="activity-meta">
                                        <span className={`activity-dot ${item.type === 'VENTA' ? 'sale' : 'purchase'}`}></span>
                                        <div className="activity-info">
                                            <p>{item.product_name}</p>
                                            <span>{new Date(item.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="activity-amount">
                                        <strong>
                                            {item.type === 'VENTA' ? '+' : '-'}
                                            {fmtMoney(item.total_price || item.total_cost || 0)}
                                        </strong>
                                        <small>{item.status}</small>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-4">No hay actividad reciente</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
