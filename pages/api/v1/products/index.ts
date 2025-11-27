import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Product } from '@/models/Product';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB();

    const { method } = req;

    switch (method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            return handlePost(req, res);
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const products = await Product.find({}).select({ __v: 0 }).exec();
        return res.json(products);
    } catch (e) {
        console.error('[API] GET /products error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { name, sku, unit_cost, pvp, stock } = req.body;

        if (!name || !sku || unit_cost == null || pvp == null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const created = await Product.create({ name, sku, unit_cost, pvp, stock });
        return res.status(201).json(created);
    } catch (e: any) {
        if (e?.code === 11000) {
            return res.status(409).json({ message: 'SKU already exists' });
        }
        console.error('[API] POST /products error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
