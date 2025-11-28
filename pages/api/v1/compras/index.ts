import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Compra } from '@/models/Compra';

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
        const compras = await Compra.find({}).sort({ date: -1 });
        return res.status(200).json(compras);
    } catch (error) {
        console.error('Error fetching compras:', error);
        return res.status(500).json({ message: 'Error fetching compras' });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { supplier, product_name, quantity, unit_cost, status } = req.body;

        // Basic validation
        if (!supplier || !product_name || !quantity || !unit_cost) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const total_cost = Number(quantity) * Number(unit_cost);

        const compra = await Compra.create({
            supplier,
            product_name,
            quantity,
            unit_cost,
            total_cost,
            status: status || 'Pendiente',
            date: new Date()
        });

        return res.status(201).json(compra);
    } catch (error) {
        console.error('Error creating compra:', error);
        return res.status(500).json({ message: 'Error creating compra' });
    }
}
