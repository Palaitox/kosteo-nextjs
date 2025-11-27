import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import mongoose from 'mongoose';

function isValidId(id: string): boolean {
    return mongoose.isValidObjectId(id);
}

function sanitizeStr(s: any): string {
    return String(s || '').trim();
}

type ErrorResponse = { message: string };
type UserResponse = any;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserResponse | ErrorResponse>
) {
    await connectDB();

    const { method, query } = req;
    const { id } = query;

    if (typeof id !== 'string' || !isValidId(id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }

    switch (method) {
        case 'GET':
            return handleGet(id, req, res);
        case 'PUT':
            return handlePut(id, req, res);
        case 'PATCH':
            return handlePatch(id, req, res);
        case 'DELETE':
            return handleDelete(id, req, res);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
            return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
}

// GET /api/v1/users/:id - Get a single user
async function handleGet(
    id: string,
    req: NextApiRequest,
    res: NextApiResponse<UserResponse | ErrorResponse>
) {
    try {
        const user = await User.findById(id).select({ __v: 0 }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    } catch (e) {
        console.error('[API] GET /users/:id error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// PUT /api/v1/users/:id - Full update
async function handlePut(
    id: string,
    req: NextApiRequest,
    res: NextApiResponse<UserResponse | ErrorResponse>
) {
    try {
        const name = sanitizeStr(req.body?.name);
        const email = sanitizeStr(req.body?.email).toLowerCase();

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const updated = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true, runValidators: true, context: 'query' }
        ).select({ __v: 0 });

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(updated);
    } catch (e: any) {
        if (e?.code === 11000) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error('[API] PUT /users/:id error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// PATCH /api/v1/users/:id - Partial update
async function handlePatch(
    id: string,
    req: NextApiRequest,
    res: NextApiResponse<UserResponse | ErrorResponse>
) {
    try {
        const updates: any = {};

        if (typeof req.body?.name === 'string') {
            const name = req.body.name.trim();
            if (!name) {
                return res.status(400).json({ message: 'Name cannot be empty' });
            }
            updates.name = name;
        }

        if (typeof req.body?.email === 'string') {
            const email = req.body.email.trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }
            updates.email = email;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No updatable fields provided' });
        }

        const updated = await User.findOneAndUpdate(
            { _id: id },
            { $set: updates },
            { new: true, runValidators: true, context: 'query' }
        ).select({ __v: 0 });

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(updated);
    } catch (e: any) {
        if (e?.code === 11000) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error('[API] PATCH /users/:id error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// DELETE /api/v1/users/:id
async function handleDelete(
    id: string,
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse | {}>
) {
    try {
        const deleted = await User.findByIdAndDelete(id).exec();
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(204).end();
    } catch (e) {
        console.error('[API] DELETE /users/:id error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
