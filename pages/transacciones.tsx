import React, { useState } from 'react';
import Head from 'next/head';
import { fmtMoney } from '@/lib/utils';
import { TrendingUp, TrendingDown, Plus, Eye, ShoppingCart, DollarSign, FileText } from 'lucide-react';

type TransactionType = 'COMPRA' | 'VENTA';

const TransaccionesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TransactionType>('VENTA');

    // Mock data for now
    const transactions = [
        { id: 1, type: 'VENTA', date: '2023-11-27', description: 'Venta de Computador', amount: 1500000, status: 'Completado' },
        { id: 2, type: 'COMPRA', date: '2023-11-26', description: 'Compra de Insumos', amount: 500000, status: 'Pagado' },
        { id: 3, type: 'VENTA', date: '2023-11-25', description: 'Servicio de Mantenimiento', amount: 200000, status: 'Completado' },
    ];

    const filteredTransactions = transactions.filter(t => t.type === activeTab);

    return (
        <>
            <Head>
                <title>Transacciones — Kosteo</title>
            </Head>
            <div className="fade-in">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileText size={28} />
                        Transacciones
                    </h1>
                    <button className="btn btn-primary flex items-center gap-2">
                        <Plus size={18} />
                        Nueva {activeTab === 'VENTA' ? 'Venta' : 'Compra'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-4">
                    <button
                        onClick={() => setActiveTab('VENTA')}
                        className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'VENTA' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <TrendingUp size={16} />
                        Ventas
                    </button>
                    <button
                        onClick={() => setActiveTab('COMPRA')}
                        className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'COMPRA' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <ShoppingCart size={16} />
                        Compras
                    </button>
                </div>

                {/* Stats Cards (Contextual) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="card">
                        <h3 className="flex items-center gap-2">
                            <DollarSign size={16} />
                            Total {activeTab === 'VENTA' ? 'Ventas' : 'Compras'} (Mes)
                        </h3>
                        <p className="value">{fmtMoney(activeTab === 'VENTA' ? 1700000 : 500000)}</p>
                    </div>
                    <div className="card">
                        <h3>Transacciones</h3>
                        <p className="value">{filteredTransactions.length}</p>
                    </div>
                    <div className="card">
                        <h3>Promedio</h3>
                        <p className="value">{fmtMoney(850000)}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th className="text-right">Monto</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id}>
                                        <td className="font-mono text-sm">{t.date}</td>
                                        <td className="font-medium">{t.description}</td>
                                        <td>
                                            <span className={`badge ${t.status === 'Completado' || t.status === 'Pagado' ? 'badge-success' : 'badge-warning'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="text-right font-mono">{fmtMoney(t.amount)}</td>
                                        <td className="text-center">
                                            <button className="text-zinc-400 hover:text-white inline-flex items-center gap-1">
                                                <Eye size={16} />
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredTransactions.length === 0 && (
                        <div className="p-12 text-center">
                            {activeTab === 'VENTA' ? (
                                <TrendingUp size={48} className="mx-auto text-zinc-600 mb-4" />
                            ) : (
                                <ShoppingCart size={48} className="mx-auto text-zinc-600 mb-4" />
                            )}
                            <p className="text-zinc-500 font-medium">
                                No hay {activeTab.toLowerCase()}s registradas aún.
                            </p>
                            <p className="text-zinc-600 text-sm mt-1">
                                Comienza agregando una nueva transacción
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TransaccionesPage;
