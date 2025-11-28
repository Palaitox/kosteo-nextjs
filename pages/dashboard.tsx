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
            color: 'bg-blue-500',
            desc: 'Registrar inventario'
        },
        {
            label: 'Nueva Venta',
            href: '/transacciones',
            icon: TrendingUp,
            color: 'bg-emerald-500',
            desc: 'Registrar salida'
        },
        {
            label: 'Nueva Compra',
            href: '/transacciones',
            icon: ShoppingCart,
            color: 'bg-amber-500',
            desc: 'Registrar entrada'
        },
    ];

    return (
        <>
            <Head>
                <title>Dashboard — Kosteo</title>
            </Head>
            <div className="fade-in pb-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Resumen General</h1>
                    <p className="text-zinc-400 text-sm">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                {/* Main Stats Grid - Removed Inventory Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="card bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Package className="text-blue-500" size={24} />
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">Total</span>
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium mb-1">Productos</h3>
                        <p className="text-2xl font-bold text-white">{stats?.totalProducts || 0}</p>
                    </div>

                    <div className="card bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <TrendingUp className="text-emerald-500" size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                <ArrowUpRight size={12} />
                                <span>Ingresos</span>
                            </div>
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium mb-1">Ventas Totales</h3>
                        <p className="text-2xl font-bold text-white">{fmtMoney(stats?.totalVentasValue || 0)}</p>
                    </div>

                    <div className="card bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <ShoppingCart className="text-amber-500" size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                                <ArrowDownRight size={12} />
                                <span>Egresos</span>
                            </div>
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium mb-1">Compras Totales</h3>
                        <p className="text-2xl font-bold text-white">{fmtMoney(stats?.totalComprasValue || 0)}</p>
                    </div>
                </div>

                {/* Removed Chart Section, kept Quick Actions and Recent Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Quick Actions */}
                    <div className="card bg-zinc-900/50 border-zinc-800">
                        <h2 className="text-lg font-bold mb-6 text-white">Acciones Rápidas</h2>
                        <div className="space-y-4">
                            {quickActions.map((action, index) => (
                                <Link
                                    href={action.href}
                                    key={index}
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-zinc-800 transition-all group border border-transparent hover:border-zinc-700"
                                >
                                    <div className={`p-3 rounded-lg ${action.color} text-white shadow-lg shadow-${action.color}/20 group-hover:scale-110 transition-transform`}>
                                        <action.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-lg">{action.label}</h3>
                                        <p className="text-sm text-zinc-500">{action.desc}</p>
                                    </div>
                                    <ArrowRight size={20} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card bg-zinc-900/50 border-zinc-800">
                        <h2 className="text-lg font-bold mb-6 text-white">Actividad Reciente</h2>
                        <div className="space-y-5">
                            {recentActivity.map((item) => (
                                <div key={item.id} className="flex items-center justify-between pb-4 border-b border-zinc-800/50 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${item.type === 'VENTA' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                        <div>
                                            <p className="font-medium text-white">{item.product_name}</p>
                                            <p className="text-xs text-zinc-500">{new Date(item.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${item.type === 'VENTA' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {item.type === 'VENTA' ? '+' : '-'}{fmtMoney(item.total_price || item.total_cost || 0)}
                                        </p>
                                        <p className="text-xs text-zinc-500 capitalize">{item.status}</p>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <p className="text-zinc-500 text-sm text-center py-4">No hay actividad reciente</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
