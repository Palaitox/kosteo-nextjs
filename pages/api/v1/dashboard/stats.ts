import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Product } from '@/models/Product';
import { Venta } from '@/models/Venta';
import { Compra } from '@/models/Compra';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB();

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        // 1. Product Stats
        const products = await Product.find({});
        const totalProducts = products.length;
        const inventoryValueCost = products.reduce((sum, p) => sum + (p.unit_cost * p.stock), 0);
        const inventoryValuePvp = products.reduce((sum, p) => sum + (p.pvp * p.stock), 0);

        // 2. Sales (Ventas) Stats
        const ventas = await Venta.find({});
        const totalVentasCount = ventas.length;
        const totalVentasValue = ventas.reduce((sum, v) => sum + v.total_price, 0);

        // 3. Purchases (Compras) Stats
        const compras = await Compra.find({});
        const totalComprasCount = compras.length;
        const totalComprasValue = compras.reduce((sum, c) => sum + c.total_cost, 0);

        // 4. Chart Data (Last 6 months)
        // We need to aggregate sales and purchases by month
        const chartData = getLast6MonthsData(ventas, compras);

        // 5. Recent Activity (Combined)
        const recentActivity = [
            ...ventas.map(v => ({ ...v.toJSON(), type: 'VENTA' })),
            ...compras.map(c => ({ ...c.toJSON(), type: 'COMPRA' }))
        ]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

        return res.status(200).json({
            stats: {
                totalProducts,
                inventoryValueCost,
                inventoryValuePvp,
                totalVentasCount,
                totalVentasValue,
                totalComprasCount,
                totalComprasValue
            },
            chartData,
            recentActivity
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
}

function getLast6MonthsData(ventas: any[], compras: any[]) {
    const months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear();
        const key = `${monthName} ${year}`; // For display

        // Filter for this month
        const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

        const monthVentas = ventas.filter(v => {
            const date = new Date(v.date);
            return date >= startOfMonth && date <= endOfMonth;
        }).reduce((sum, v) => sum + v.total_price, 0);

        const monthCompras = compras.filter(c => {
            const date = new Date(c.date);
            return date >= startOfMonth && date <= endOfMonth;
        }).reduce((sum, c) => sum + c.total_cost, 0);

        months.push({
            name: monthName,
            ventas: monthVentas,
            compras: monthCompras
        });
    }
    return months;
}
