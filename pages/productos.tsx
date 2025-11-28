import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Package, Plus, Trash2, DollarSign, TrendingUp } from 'lucide-react';
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Package size={28} />
                        Gestión de Productos
                    </h2>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

                <div className="card mb-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-white text-lg">
                        <Plus size={20} />
                        Agregar Producto
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label>Nombre</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>SKU</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Costo Unitario</label>
                            <input
                                type="number"
                                step="0.01"
                                className="input"
                                value={formData.unit_cost}
                                onChange={(e) => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) || 0 })}
                                required
                            />
                        </div>
                        <div>
                            <label>Precio de Venta</label>
                            <input
                                type="number"
                                step="0.01"
                                className="input"
                                value={formData.pvp}
                                onChange={(e) => setFormData({ ...formData, pvp: parseFloat(e.target.value) || 0 })}
                                required
                            />
                        </div>
                        <div>
                            <label>Stock</label>
                            <input
                                type="number"
                                className="input"
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
                    </form>
                </div>

                <div className="card overflow-hidden p-0">
                    <div className="p-6 border-b border-zinc-800">
                        <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                            <TrendingUp size={20} />
                            Lista de Productos
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>SKU</th>
                                    <th className="text-right">Costo</th>
                                    <th className="text-right">PVP</th>
                                    <th className="text-right">Margen</th>
                                    <th className="text-right">Stock</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const margin = product.pvp > 0
                                        ? ((product.pvp - product.unit_cost) / product.pvp) * 100
                                        : 0;
                                    return (
                                        <tr key={product.id}>
                                            <td className="font-medium">{product.name}</td>
                                            <td className="text-zinc-400 font-mono text-sm">{product.sku}</td>
                                            <td className="text-right font-mono">{fmtMoney(product.unit_cost)}</td>
                                            <td className="text-right font-mono">{fmtMoney(product.pvp)}</td>
                                            <td className="text-right">
                                                <span className={`${margin >= 30 ? 'text-green-400' : margin >= 15 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {fmtPercent(margin / 100)}
                                                </span>
                                            </td>
                                            <td className="text-right">{product.stock}</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {products.length === 0 && (
                        <div className="p-12 text-center">
                            <Package size={48} className="mx-auto text-zinc-600 mb-4" />
                            <p className="text-zinc-500 font-medium">No hay productos registrados</p>
                            <p className="text-zinc-600 text-sm mt-1">Comienza agregando tu primer producto arriba</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductosPage;
