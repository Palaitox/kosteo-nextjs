import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { Compra } from '@/models/Compra';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB();

    const { id } = req.query;

    if (!id || typeof id !== 'string' || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    switch (req.method) {
        case 'GET':
            return handleGet(id, res);
        case 'PUT':
            return handlePut(id, req, res);
        case 'DELETE':
            return handleDelete(id, res);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}

async function handleGet(id: string, res: NextApiResponse) {
    try {
        const compra = await Compra.findById(id);
        if (!compra) {
            return res.status(404).json({ message: 'Compra not found' });
        }
        return res.status(200).json(compra);
    } catch (error) {
        console.error('Error fetching compra:', error);
        return res.status(500).json({ message: 'Error fetching compra' });
    }
}

async function handlePut(id: string, req: NextApiRequest, res: NextApiResponse) {
    try {
        const { supplier, product_name, quantity, unit_cost, status } = req.body;

        // Calculate total cost if quantity or unit_cost are present
        let updateData: any = { ...req.body };

        if (quantity !== undefined && unit_cost !== undefined) {
            updateData.total_cost = Number(quantity) * Number(unit_cost);
        } else if (quantity !== undefined) {
            // If only quantity changes, we need current unit_cost to recalc total
            const current = await Compra.findById(id);
            if (current) {
                updateData.total_cost = Number(quantity) * current.unit_cost;
            }
        } else if (unit_cost !== undefined) {
            // If only unit_cost changes
            const current = await Compra.findById(id);
            if (current) {
                updateData.total_cost = current.quantity * Number(unit_cost);
            }
        }

        const compra = await Compra.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!compra) {
            return res.status(404).json({ message: 'Compra not found' });
        }

        return res.status(200).json(compra);
    } catch (error) {
        console.error('Error updating compra:', error);
        return res.status(500).json({ message: 'Error updating compra' });
    }
}

async function handleDelete(id: string, res: NextApiResponse) {
    try {
        const compra = await Compra.findByIdAndDelete(id);
        if (!compra) {
            return res.status(404).json({ message: 'Compra not found' });
        }
        return res.status(200).json({ message: 'Compra deleted successfully' });
    } catch (error) {
        console.error('Error deleting compra:', error);
        return res.status(500).json({ message: 'Error deleting compra' });
    }
}
