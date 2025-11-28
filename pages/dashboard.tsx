import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fmtMoney, fmtPercent } from '@/lib/utils';
import { Package, DollarSign, TrendingUp, Archive } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    sku: string;
    unit_cost: number;
    pvp: number;
    stock: number;
}

const DashboardPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        inventoryValue: 0,
        pvpValue: 0,
        averageMargin: 0,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/v1/products');
            if (!res.ok) {
                console.error(`API error: ${res.status} ${res.statusText}`);
                return;
            }
            const data = await res.json();
            setProducts(data);

            // Calculate stats
            const totalProducts = data.length;
            const inventoryValue = data.reduce((sum: number, p: Product) => sum + (p.unit_cost * p.stock), 0);
            const pvpValue = data.reduce((sum: number, p: Product) => sum + (p.pvp * p.stock), 0);
            const margins = data
                .filter((p: Product) => p.pvp > 0)
                .map((p: Product) => ((p.pvp - p.unit_cost) / p.pvp) * 100);
            const averageMargin = margins.length > 0
                ? margins.reduce((sum: number, m: number) => sum + m, 0) / margins.length
                : 0;

            setStats({
                totalProducts,
                inventoryValue,
                pvpValue,
                averageMargin,
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const quickActions = [
        { label: 'Nuevo Producto', href: '/productos', icon: Package },
        { label: 'Ver Productos', href: '/productos', icon: Archive },
        { label: 'Transacciones', href: '/transacciones', icon: DollarSign },
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
                        <p className="value">{stats.totalProducts}</p>
                    </div>
                    <div className="card">
                        <h3>Valor Inventario (Costo)</h3>
                        <p className="value">{fmtMoney(stats.inventoryValue)}</p>
                    </div>
                    <div className="card">
                        <h3>Valor Inventario (PVP)</h3>
                        <p className="value">{fmtMoney(stats.pvpValue)}</p>
                    </div>
                    <div className="card">
                        <h3>Margen Bruto Promedio</h3>
                        <p className="value">{fmtPercent(stats.averageMargin / 100)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-6 text-white">Acciones Rápidas</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {quickActions.map((action, index) => (
                                <Link
                                    href={action.href}
                                    key={index}
                                    className="p-5 bg-gradient-to-br from-surface-active to-surface-hover border border-border rounded-xl hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center gap-3 group hover:scale-105"
                                >
                                    <div className="p-3 bg-surface rounded-lg group-hover:bg-surface-active transition-colors">
                                        <action.icon size={28} className="text-primary" />
                                    </div>
                                    <span className="font-semibold text-sm text-white">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <TrendingUp size={20} />
                            Productos Recientes
                        </h2>
                        <div className="space-y-3">
                            {products.slice(0, 5).map((product) => (
                                <div
                                    key={product.id}
                                    className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                                >
                                    <div>
                                        <p className="font-medium text-white">{product.name}</p>
                                        <p className="text-xs text-slate-400">SKU: {product.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-mono text-slate-300">{fmtMoney(product.pvp)}</p>
                                        <p className="text-xs text-slate-500">Stock: {product.stock}</p>
                                    </div>
                                </div>
                            ))}
                            {products.length === 0 && (
                                <p className="text-slate-400 text-sm text-center py-4">
                                    No hay productos registrados aún.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
