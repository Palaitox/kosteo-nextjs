import React, { useState, useEffect } from 'react';
import Head from 'next/head';

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
        }
    };

    const handleDelete = async (id: string) => {
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

    return (
        <>
            <Head>
                <title>Productos — Kosteo</title>
            </Head>
            <div>
                <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>

                <div className="card mb-4">
                    <h3 className="font-semibold mb-2">Agregar Producto</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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
                                onChange={(e) => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) })}
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
                                onChange={(e) => setFormData({ ...formData, pvp: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div>
                            <label>Stock</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="btn btn-primary">
                                Agregar
                            </button>
                        </div>
                    </form>
                </div>

                <div className="card">
                    <h3 className="font-semibold mb-2">Lista de Productos</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>SKU</th>
                                <th>Costo</th>
                                <th>PVP</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.sku}</td>
                                    <td>${product.unit_cost.toFixed(2)}</td>
                                    <td>${product.pvp.toFixed(2)}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && (
                        <p className="text-center text-slate-500 py-4">No hay productos registrados</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductosPage;
