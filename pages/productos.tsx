import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Package, Plus, Trash2, DollarSign, TrendingUp, Pencil, X } from 'lucide-react';
import { fmtMoney, fmtPercent } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    sku: string;
    unit_cost: number;
    pvp: number;
    stock: number;
}

const ProductosPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        unit_cost: 0,
        pvp: 0,
        stock: 0,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/v1/products');
            if (!res.ok) {
                console.error(`API error: ${res.status} ${res.statusText}`);
                setProducts([]);
                return;
            }
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('Expected JSON response but got:', contentType);
                setProducts([]);
                return;
            }
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/v1/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const errorText = await res.text();
                alert(`Error creando producto: ${errorText}`);
                return;
            }
            fetchProducts();
            setFormData({ name: '', sku: '', unit_cost: 0, pvp: 0, stock: 0 });
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error al crear producto');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/v1/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editingProduct.name,
                    sku: editingProduct.sku,
                    unit_cost: editingProduct.unit_cost,
                    pvp: editingProduct.pvp,
                    stock: editingProduct.stock,
                }),
            });
            if (!res.ok) {
                const errorText = await res.text();
                alert(`Error actualizando producto: ${errorText}`);
                return;
            }
            fetchProducts();
            setEditingProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error al actualizar producto');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            const res = await fetch(`/api/v1/products/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                alert('Error eliminando producto');
                return;
            }
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar producto');
        }
    };

    // Calculate summary stats
    const totalValue = products.reduce((sum, p) => sum + (p.unit_cost * p.stock), 0);
    const totalPvpValue = products.reduce((sum, p) => sum + (p.pvp * p.stock), 0);

    return (
        <>
            <Head>
                <title>Productos — Kosteo</title>
            </Head>
            <div className="fade-in">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package size={28} />
                        Productos
                    </h1>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="card">
                        <h3>Total Productos</h3>
                        <p className="value">{products.length}</p>
                    </div>
                    <div className="card">
                        <h3>Valor Inventario (Costo)</h3>
                        <p className="value">{fmtMoney(totalValue)}</p>
                    </div>
                    <div className="card">
                        <h3>Valor Inventario (PVP)</h3>
                        <p className="value">{fmtMoney(totalPvpValue)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Create Form */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Plus size={24} />
                            Agregar Producto
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        className="input"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>SKU</label>
                                    <input
                                        type="text"
                                        className="input"
                                        required
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Costo Unitario</label>
                                    <input
                                        type="number"
                                        className="input"
                                        required
                                        step="0.01"
                                        value={formData.unit_cost}
                                        onChange={(e) => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label>PVP</label>
                                    <input
                                        type="number"
                                        className="input"
                                        required
                                        step="0.01"
                                        value={formData.pvp}
                                        onChange={(e) => setFormData({ ...formData, pvp: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        className="input"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full flex items-center justify-center gap-2"
                                        disabled={loading}
                                    >
                                        <Plus size={18} />
                                        {loading ? 'Agregando...' : 'Agregar'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Products Table */}
                    <div className="card overflow-hidden p-0">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp size={24} />
                                Lista de Productos
                            </h2>
                        </div>
                        {products.length === 0 ? (
                            <div className="p-12 text-center">
                                <Package size={48} className="mx-auto text-zinc-600 mb-4" />
                                <p className="text-zinc-500 font-medium">No hay productos aún</p>
                                <p className="text-zinc-600 text-sm mt-1">Agrega tu primer producto usando el formulario</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>SKU</th>
                                            <th className="text-right">Costo</th>
                                            <th className="text-right">PVP</th>
                                            <th className="text-right">Stock</th>
                                            <th className="text-right">Margen</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((p) => {
                                            const margin = ((p.pvp - p.unit_cost) / p.pvp) * 100;
                                            return (
                                                <tr key={p.id}>
                                                    <td className="font-medium">{p.name}</td>
                                                    <td className="font-mono text-sm">{p.sku}</td>
                                                    <td className="text-right font-mono">{fmtMoney(p.unit_cost)}</td>
                                                    <td className="text-right font-mono">{fmtMoney(p.pvp)}</td>
                                                    <td className="text-right">{p.stock}</td>
                                                    <td className="text-right">
                                                        <span style={{
                                                            color: margin >= 30 ? '#22c55e' : margin >= 15 ? '#f59e0b' : '#ef4444'
                                                        }}>
                                                            {fmtPercent(margin / 100)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleEdit(p)}
                                                                className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                                                title="Editar"
                                                            >
                                                                <Pencil size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(p.id)}
                                                                className="text-red-400 hover:text-red-300 transition-colors p-1"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingProduct && (
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
                            onClick={() => setEditingProduct(null)}
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
                            Editar Producto
                        </h2>
                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>SKU</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={editingProduct.sku}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Costo Unitario</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    step="0.01"
                                    value={editingProduct.unit_cost}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, unit_cost: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <label>PVP</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    step="0.01"
                                    value={editingProduct.pvp}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, pvp: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    value={editingProduct.stock}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="md:col-span-2 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
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

export default ProductosPage;
