import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB();

    const { method, query } = req;
    const { id } = query;

    if (typeof id !== 'string' || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }

    switch (method) {
        case 'GET':
            return handleGet(id, res);
        case 'PUT':
            return handlePut(id, req, res);
        case 'DELETE':
            return handleDelete(id, res);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
}

async function handleGet(id: string, res: NextApiResponse) {
    try {
        const product = await Product.findById(id).select({ __v: 0 }).exec();
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.json(product);
    } catch (e) {
        console.error('[API] GET /products/:id error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function handlePut(id: string, req: NextApiRequest, res: NextApiResponse) {
    try {
        const { name, sku, unit_cost, pvp, stock } = req.body;

        if (!name || !sku || unit_cost == null || pvp == null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updated = await Product.findByIdAndUpdate(
            id,
            { name, sku, unit_cost, pvp, stock },
            { new: true, runValidators: true }
        ).exec();

        if (!updated) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.json(updated);
    } catch (e: any) {
        if (e?.code === 11000) {
            return res.status(409).json({ message: 'SKU already exists' });
        }
        console.error('[API] PUT /products/:id error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function handleDelete(id: string, res: NextApiResponse) {
    try {
        const deleted = await Product.findByIdAndDelete(id).exec();
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(204).end();
    } catch (e) {
        console.error('[API] DELETE /products/:id error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
