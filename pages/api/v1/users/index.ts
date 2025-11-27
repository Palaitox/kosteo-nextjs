import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import mongoose from 'mongoose';

// Helper functions
function isValidId(id: string): boolean {
    return mongoose.isValidObjectId(id);
}

function sanitizeStr(s: any): string {
    return String(s || '').trim();
}

function buildRegex(q: string): RegExp {
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(safe, 'i');
}

type ErrorResponse = { message: string };
type UserResponse = any;
type UsersListResponse = {
    page: number;
    limit: number;
    total: number;
    items: any[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserResponse | UsersListResponse | ErrorResponse>
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

// GET /api/v1/users - List users with pagination and search
async function handleGet(
    req: NextApiRequest,
    res: NextApiResponse<UsersListResponse | ErrorResponse>
) {
    try {
        const { q } = req.query;
        let { page = '1', limit = '20' } = req.query;

        const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));

        const filter: any = {};
        if (q && typeof q === 'string') {
            const rx = buildRegex(q);
            filter.$or = [{ name: rx }, { email: rx }];
        }

        const [items, total] = await Promise.all([
            User.find(filter)
                .select({ __v: 0 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .exec(),
            User.countDocuments(filter).exec(),
        ]);

        return res.json({
            page: pageNum,
            limit: limitNum,
            total,
            items,
        });
    } catch (e) {
        console.error('[API] GET /users error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// POST /api/v1/users - Create a new user
async function handlePost(
    req: NextApiRequest,
    res: NextApiResponse<UserResponse | ErrorResponse>
) {
    try {
        const name = sanitizeStr(req.body?.name);
        const email = sanitizeStr(req.body?.email).toLowerCase();

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const created = await User.create({ name, email });
        return res.status(201).json(created);
    } catch (e: any) {
        if (e?.code === 11000) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error('[API] POST /users error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
