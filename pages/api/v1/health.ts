import type { NextApiRequest, NextApiResponse } from 'next';

type HealthResponse = {
    ok: boolean;
    ts: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HealthResponse>
) {
    return res.json({
        ok: true,
        ts: new Date().toISOString()
    });
}
