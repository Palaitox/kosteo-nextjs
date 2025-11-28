import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Venta } from '@/models/Venta';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB();

    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            return handlePost(req, res);
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const ventas = await Venta.find({}).sort({ date: -1 });
        return res.status(200).json(ventas);
    } catch (error) {
        console.error('Error fetching ventas:', error);
        return res.status(500).json({ message: 'Error fetching ventas' });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { client, product_name, quantity, unit_price, status } = req.body;

        // Basic validation
        if (!client || !product_name || !quantity || !unit_price) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const total_price = Number(quantity) * Number(unit_price);

        const venta = await Venta.create({
            client,
            product_name,
            quantity,
            unit_price,
            total_price,
            status: status || 'Completado',
            date: new Date()
        });

        return res.status(201).json(venta);
    } catch (error) {
        console.error('Error creating venta:', error);
        return res.status(500).json({ message: 'Error creating venta' });
    }
}
