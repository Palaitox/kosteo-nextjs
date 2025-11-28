import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { Venta } from '@/models/Venta';

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
        const venta = await Venta.findById(id);
        if (!venta) {
            return res.status(404).json({ message: 'Venta not found' });
        }
        return res.status(200).json(venta);
    } catch (error) {
        console.error('Error fetching venta:', error);
        return res.status(500).json({ message: 'Error fetching venta' });
    }
}

async function handlePut(id: string, req: NextApiRequest, res: NextApiResponse) {
    try {
        const { client, product_name, quantity, unit_price, status } = req.body;

        // Calculate total price if quantity or unit_price are present
        let updateData: any = { ...req.body };

        if (quantity !== undefined && unit_price !== undefined) {
            updateData.total_price = Number(quantity) * Number(unit_price);
        } else if (quantity !== undefined) {
            // If only quantity changes, we need current unit_price to recalc total
            const current = await Venta.findById(id);
            if (current) {
                updateData.total_price = Number(quantity) * current.unit_price;
            }
        } else if (unit_price !== undefined) {
            // If only unit_price changes
            const current = await Venta.findById(id);
            if (current) {
                updateData.total_price = current.quantity * Number(unit_price);
            }
        }

        const venta = await Venta.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!venta) {
            return res.status(404).json({ message: 'Venta not found' });
        }

        return res.status(200).json(venta);
    } catch (error) {
        console.error('Error updating venta:', error);
        return res.status(500).json({ message: 'Error updating venta' });
    }
}

async function handleDelete(id: string, res: NextApiResponse) {
    try {
        const venta = await Venta.findByIdAndDelete(id);
        if (!venta) {
            return res.status(404).json({ message: 'Venta not found' });
        }
        return res.status(200).json({ message: 'Venta deleted successfully' });
    } catch (error) {
        console.error('Error deleting venta:', error);
        return res.status(500).json({ message: 'Error deleting venta' });
    }
}
