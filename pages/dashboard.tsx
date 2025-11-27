import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fmtMoney, fmtPercent } from '@/lib/utils';

const DashboardPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState({
        products: 0,
        rawMaterials: 0,
        operationalExpenses: 0,
        averageMargin: 0,
    });

    useEffect(() => {
        // Demo API call
        const demoAPICall = async () => {
            try {
                // Create a demo user
                const createRes = await fetch('/api/v1/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Rafa',
                        email: `rafa.${Date.now()}@test.com`
                    }),
                });

                if (!createRes.ok) {
                    console.error('Failed to create demo user:', createRes.statusText);
                }

                // Fetch users
                const res = await fetch('/api/v1/users?limit=5&page=1');
                if (!res.ok) {
                    console.error('Failed to fetch users:', res.statusText);
                    return;
                }

                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await res.json();
                    setUsers(data.items || []);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        demoAPICall();
    }, []);

    const quickActions = [
        { label: 'Nuevo Producto', href: '/productos', icon: '📦' },
        { label: 'Nueva Venta', href: '/transacciones', icon: '💰' },
        { label: 'Nueva Compra', href: '/transacciones', icon: '🛒' },
    ];

    return (
        <>
            <Head>
                <title>Dashboard — Kosteo</title>
            </Head>
            <div className="fade-in">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="card">
                        <h3>Productos Registrados</h3>
                        <p className="value">{stats.products}</p>
                    </div>
                    <div className="card">
                        <h3>Materias Primas</h3>
                        <p className="value">{stats.rawMaterials}</p>
                    </div>
                    <div className="card">
                        <h3>Gastos Operativos (mes)</h3>
                        <p className="value">{fmtMoney(stats.operationalExpenses)}</p>
                    </div>
                    <div className="card">
                        <h3>Margen Bruto Promedio</h3>
                        <p className="value">{fmtPercent(stats.averageMargin)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 text-white">Acciones Rápidas</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {quickActions.map((action, index) => (
                                <Link href={action.href} key={index} className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-colors flex flex-col items-center justify-center text-center gap-2 text-slate-300 hover:text-indigo-400">
                                    <span className="text-2xl">{action.icon}</span>
                                    <span className="font-medium text-sm">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 text-white">Actividad Reciente</h2>
                        <div className="space-y-4">
                            <p className="text-slate-400 text-sm">No hay actividad reciente para mostrar.</p>
                        </div>
                    </div>
                </div>

                {users.length > 0 && (
                    <div className="card mt-8">
                        <h3 className="font-semibold mb-2 text-white">Demo API - Usuarios Recientes</h3>
                        <pre className="text-sm bg-slate-900/50 border border-slate-700 p-4 rounded overflow-auto text-slate-300">
                            {JSON.stringify(users, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </>
    );
};

export default DashboardPage;
