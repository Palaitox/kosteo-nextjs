import React, { useState } from 'react';
import Head from 'next/head';
import { fmtMoney } from '@/lib/utils';

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
                    <h1 className="text-2xl font-bold">Transacciones</h1>
                    <button className="btn btn-primary">
                        + Nueva {activeTab === 'VENTA' ? 'Venta' : 'Compra'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-4">
                    <button
                        onClick={() => setActiveTab('VENTA')}
                        className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors ${activeTab === 'VENTA' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Ventas
                    </button>
                    <button
                        onClick={() => setActiveTab('COMPRA')}
                        className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors ${activeTab === 'COMPRA' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Compras
                    </button>
                </div>

                {/* Stats Cards (Contextual) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="card">
                        <h3>Total {activeTab === 'VENTA' ? 'Ventas' : 'Compras'} (Mes)</h3>
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
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th className="text-right">Monto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((t) => (
                                <tr key={t.id}>
                                    <td>{t.date}</td>
                                    <td className="font-medium">{t.description}</td>
                                    <td>
                                        <span className="badge text-xs">
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="text-right font-mono">{fmtMoney(t.amount)}</td>
                                    <td>
                                        <button className="text-zinc-400 hover:text-white">Ver</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTransactions.length === 0 && (
                        <div className="p-8 text-center text-zinc-500">
                            No hay {activeTab.toLowerCase()}s registradas aún.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TransaccionesPage;
