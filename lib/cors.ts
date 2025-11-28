import type { NextApiRequest, NextApiResponse } from 'next';

const DEFAULT_METHODS = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';
const DEFAULT_HEADERS = 'Content-Type, Authorization, X-Requested-With';

export function applyCors(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', process.env.CORS_METHODS || DEFAULT_METHODS);
    res.setHeader('Access-Control-Allow-Headers', process.env.CORS_HEADERS || DEFAULT_HEADERS);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }

    return false;
}
