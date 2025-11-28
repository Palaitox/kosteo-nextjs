import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { fmtMoney } from '@/lib/utils';
import { TrendingUp, ShoppingCart, DollarSign, FileText, Plus, Pencil, Trash2, X } from 'lucide-react';

type TransactionType = 'COMPRA' | 'VENTA';

interface Compra {
    id: string;
    supplier: string;
    product_name: string;
    quantity: number;
    unit_cost: number;
    total_cost: number;
    date: string;
    status: 'Pendiente' | 'Completado' | 'Cancelado';
}

interface Venta {
    id: string;
    client: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    date: string;
    status: 'Pendiente' | 'Completado' | 'Cancelado';
}

const TransaccionesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TransactionType>('VENTA');

    // Data states
    const [compras, setCompras] = useState<Compra[]>([]);
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(false);

    // Edit/Create states for Compra
    const [editingCompra, setEditingCompra] = useState<Compra | null>(null);
    const [compraForm, setCompraForm] = useState({
        supplier: '',
        product_name: '',
        quantity: 0,
        unit_cost: 0,
        status: 'Pendiente' as 'Pendiente' | 'Completado' | 'Cancelado'
    });

    // Edit/Create states for Venta
    const [editingVenta, setEditingVenta] = useState<Venta | null>(null);
    const [ventaForm, setVentaForm] = useState({
        client: '',
        product_name: '',
        quantity: 0,
        unit_price: 0,
        status: 'Completado' as 'Pendiente' | 'Completado' | 'Cancelado'
    });

    useEffect(() => {
        if (activeTab === 'COMPRA') {
            fetchCompras();
        } else {
            fetchVentas();
        }
    }, [activeTab]);

    // --- COMPRAS HANDLERS ---
    const fetchCompras = async () => {
        try {
            const res = await fetch('/api/v1/compras');
            if (res.ok) {
                const data = await res.json();
                setCompras(data);
            }
        } catch (error) {
            console.error('Error fetching compras:', error);
        }
    };

    const handleCreateCompra = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/v1/compras', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(compraForm),
            });
            if (res.ok) {
                fetchCompras();
                setCompraForm({
                    supplier: '',
                    product_name: '',
                    quantity: 0,
                    unit_cost: 0,
                    status: 'Pendiente'
                });
            } else {
                alert('Error creando compra');
            }
        } catch (error) {
            console.error('Error creating compra:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCompra = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCompra) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/v1/compras/${editingCompra.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    supplier: editingCompra.supplier,
                    product_name: editingCompra.product_name,
                    quantity: editingCompra.quantity,
                    unit_cost: editingCompra.unit_cost,
                    status: editingCompra.status
                }),
            });
            if (res.ok) {
                fetchCompras();
                setEditingCompra(null);
            } else {
                alert('Error actualizando compra');
            }
        } catch (error) {
            console.error('Error updating compra:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCompra = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta compra?')) return;
        try {
            const res = await fetch(`/api/v1/compras/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCompras();
            } else {
                alert('Error eliminando compra');
            }
        } catch (error) {
            console.error('Error deleting compra:', error);
        }
    };

    // --- VENTAS HANDLERS ---
    const fetchVentas = async () => {
        try {
            const res = await fetch('/api/v1/ventas');
            if (res.ok) {
                const data = await res.json();
                setVentas(data);
            }
        } catch (error) {
            console.error('Error fetching ventas:', error);
        }
    };

    const handleCreateVenta = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/v1/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ventaForm),
            });
            if (res.ok) {
                fetchVentas();
                setVentaForm({
                    client: '',
                    product_name: '',
                    quantity: 0,
                    unit_price: 0,
                    status: 'Completado'
                });
            } else {
                alert('Error creando venta');
            }
        } catch (error) {
            console.error('Error creating venta:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateVenta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVenta) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/v1/ventas/${editingVenta.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client: editingVenta.client,
                    product_name: editingVenta.product_name,
                    quantity: editingVenta.quantity,
                    unit_price: editingVenta.unit_price,
                    status: editingVenta.status
                }),
            });
            if (res.ok) {
                fetchVentas();
                setEditingVenta(null);
            } else {
                alert('Error actualizando venta');
            }
        } catch (error) {
            console.error('Error updating venta:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVenta = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta venta?')) return;
        try {
            const res = await fetch(`/api/v1/ventas/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchVentas();
            } else {
                alert('Error eliminando venta');
            }
        } catch (error) {
            console.error('Error deleting venta:', error);
        }
    };

    // Calculate stats
    const totalCompras = compras.reduce((sum, c) => sum + c.total_cost, 0);
    const totalVentas = ventas.reduce((sum, v) => sum + v.total_price, 0);

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

                {activeTab === 'COMPRA' ? (
                    <div className="grid grid-cols-1 gap-8">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="card">
                                <h3 className="flex items-center gap-2">
                                    <DollarSign size={16} />
                                    Total Compras
                                </h3>
                                <p className="value">{fmtMoney(totalCompras)}</p>
                            </div>
                            <div className="card">
                                <h3>Transacciones</h3>
                                <p className="value">{compras.length}</p>
                            </div>
                        </div>

                        {/* Create Form */}
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Plus size={24} />
                                Nueva Compra
                            </h2>
                            <form onSubmit={handleCreateCompra}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label>Proveedor</label>
                                        <input
                                            type="text"
                                            className="input"
                                            required
                                            value={compraForm.supplier}
                                            onChange={(e) => setCompraForm({ ...compraForm, supplier: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Producto</label>
                                        <input
                                            type="text"
                                            className="input"
                                            required
                                            value={compraForm.product_name}
                                            onChange={(e) => setCompraForm({ ...compraForm, product_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Cantidad</label>
                                        <input
                                            type="number"
                                            className="input"
                                            required
                                            min="1"
                                            value={compraForm.quantity}
                                            onChange={(e) => setCompraForm({ ...compraForm, quantity: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <label>Costo Unitario</label>
                                        <input
                                            type="number"
                                            className="input"
                                            required
                                            step="0.01"
                                            value={compraForm.unit_cost}
                                            onChange={(e) => setCompraForm({ ...compraForm, unit_cost: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <label>Estado</label>
                                        <select
                                            className="input"
                                            value={compraForm.status}
                                            onChange={(e) => setCompraForm({ ...compraForm, status: e.target.value as any })}
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Completado">Completado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                                            disabled={loading}
                                        >
                                            <Plus size={18} />
                                            {loading ? 'Guardando...' : 'Registrar Compra'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="card overflow-hidden p-0">
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Proveedor</th>
                                            <th>Producto</th>
                                            <th className="text-right">Cant.</th>
                                            <th className="text-right">Costo Unit.</th>
                                            <th className="text-right">Total</th>
                                            <th>Estado</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {compras.map((c) => (
                                            <tr key={c.id}>
                                                <td className="font-mono text-sm">
                                                    {new Date(c.date).toLocaleDateString()}
                                                </td>
                                                <td className="font-medium">{c.supplier}</td>
                                                <td>{c.product_name}</td>
                                                <td className="text-right">{c.quantity}</td>
                                                <td className="text-right font-mono">{fmtMoney(c.unit_cost)}</td>
                                                <td className="text-right font-mono font-bold">{fmtMoney(c.total_cost)}</td>
                                                <td>
                                                    <span className={`badge ${c.status === 'Completado' ? 'badge-success' :
                                                            c.status === 'Cancelado' ? 'badge-error' : 'badge-warning'
                                                        }`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => setEditingCompra(c)}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                                            title="Editar"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCompra(c.id)}
                                                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {compras.length === 0 && (
                                <div className="p-12 text-center">
                                    <ShoppingCart size={48} className="mx-auto text-zinc-600 mb-4" />
                                    <p className="text-zinc-500 font-medium">No hay compras registradas</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {/* VENTAS SECTION */}
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="card">
                                <h3 className="flex items-center gap-2">
                                    <DollarSign size={16} />
                                    Total Ventas
                                </h3>
                                <p className="value">{fmtMoney(totalVentas)}</p>
                            </div>
                            <div className="card">
                                <h3>Transacciones</h3>
                                <p className="value">{ventas.length}</p>
                            </div>
                        </div>

                        {/* Create Form */}
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Plus size={24} />
                                Nueva Venta
                            </h2>
                            <form onSubmit={handleCreateVenta}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label>Cliente</label>
                                        <input
                                            type="text"
                                            className="input"
                                            required
                                            value={ventaForm.client}
                                            onChange={(e) => setVentaForm({ ...ventaForm, client: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Producto</label>
                                        <input
                                            type="text"
                                            className="input"
                                            required
                                            value={ventaForm.product_name}
                                            onChange={(e) => setVentaForm({ ...ventaForm, product_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Cantidad</label>
                                        <input
                                            type="number"
                                            className="input"
                                            required
                                            min="1"
                                            value={ventaForm.quantity}
                                            onChange={(e) => setVentaForm({ ...ventaForm, quantity: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <label>Precio Unitario</label>
                                        <input
                                            type="number"
                                            className="input"
                                            required
                                            step="0.01"
                                            value={ventaForm.unit_price}
                                            onChange={(e) => setVentaForm({ ...ventaForm, unit_price: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <label>Estado</label>
                                        <select
                                            className="input"
                                            value={ventaForm.status}
                                            onChange={(e) => setVentaForm({ ...ventaForm, status: e.target.value as any })}
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Completado">Completado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                                            disabled={loading}
                                        >
                                            <Plus size={18} />
                                            {loading ? 'Guardando...' : 'Registrar Venta'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="card overflow-hidden p-0">
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Cliente</th>
                                            <th>Producto</th>
                                            <th className="text-right">Cant.</th>
                                            <th className="text-right">Precio Unit.</th>
                                            <th className="text-right">Total</th>
                                            <th>Estado</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ventas.map((v) => (
                                            <tr key={v.id}>
                                                <td className="font-mono text-sm">
                                                    {new Date(v.date).toLocaleDateString()}
                                                </td>
                                                <td className="font-medium">{v.client}</td>
                                                <td>{v.product_name}</td>
                                                <td className="text-right">{v.quantity}</td>
                                                <td className="text-right font-mono">{fmtMoney(v.unit_price)}</td>
                                                <td className="text-right font-mono font-bold">{fmtMoney(v.total_price)}</td>
                                                <td>
                                                    <span className={`badge ${v.status === 'Completado' ? 'badge-success' :
                                                            v.status === 'Cancelado' ? 'badge-error' : 'badge-warning'
                                                        }`}>
                                                        {v.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => setEditingVenta(v)}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                                            title="Editar"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteVenta(v.id)}
                                                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {ventas.length === 0 && (
                                <div className="p-12 text-center">
                                    <TrendingUp size={48} className="mx-auto text-zinc-600 mb-4" />
                                    <p className="text-zinc-500 font-medium">No hay ventas registradas</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal Compra */}
            {editingCompra && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div className="card" style={{ maxWidth: '600px', width: '100%', position: 'relative' }}>
                        <button
                            onClick={() => setEditingCompra(null)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '0.5rem'
                            }}
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Pencil size={24} />
                            Editar Compra
                        </h2>
                        <form onSubmit={handleUpdateCompra} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label>Proveedor</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={editingCompra.supplier}
                                    onChange={(e) => setEditingCompra({ ...editingCompra, supplier: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Producto</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={editingCompra.product_name}
                                    onChange={(e) => setEditingCompra({ ...editingCompra, product_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Cantidad</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    min="1"
                                    value={editingCompra.quantity}
                                    onChange={(e) => setEditingCompra({ ...editingCompra, quantity: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <label>Costo Unitario</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    step="0.01"
                                    value={editingCompra.unit_cost}
                                    onChange={(e) => setEditingCompra({ ...editingCompra, unit_cost: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label>Estado</label>
                                <select
                                    className="input"
                                    value={editingCompra.status}
                                    onChange={(e) => setEditingCompra({ ...editingCompra, status: e.target.value as any })}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Completado">Completado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingCompra(null)}
                                    className="btn flex-1"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1"
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal Venta */}
            {editingVenta && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div className="card" style={{ maxWidth: '600px', width: '100%', position: 'relative' }}>
                        <button
                            onClick={() => setEditingVenta(null)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '0.5rem'
                            }}
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Pencil size={24} />
                            Editar Venta
                        </h2>
                        <form onSubmit={handleUpdateVenta} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label>Cliente</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={editingVenta.client}
                                    onChange={(e) => setEditingVenta({ ...editingVenta, client: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Producto</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={editingVenta.product_name}
                                    onChange={(e) => setEditingVenta({ ...editingVenta, product_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Cantidad</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    min="1"
                                    value={editingVenta.quantity}
                                    onChange={(e) => setEditingVenta({ ...editingVenta, quantity: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <label>Precio Unitario</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    step="0.01"
                                    value={editingVenta.unit_price}
                                    onChange={(e) => setEditingVenta({ ...editingVenta, unit_price: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label>Estado</label>
                                <select
                                    className="input"
                                    value={editingVenta.status}
                                    onChange={(e) => setEditingVenta({ ...editingVenta, status: e.target.value as any })}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Completado">Completado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingVenta(null)}
                                    className="btn flex-1"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1"
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransaccionesPage;
