import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { Product } from '@/models/Product';
import { Venta } from '@/models/Venta';
import { Compra } from '@/models/Compra';

interface AssistantResponse {
    answer: string;
}

const MAX_RECORDS = 5;

export default async function handler(req: NextApiRequest, res: NextApiResponse<AssistantResponse | { error: string }>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { question } = req.body as { question?: string };

    if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Pregunta inválida' });
    }

    await connectDB();

    try {
        const [products, ventas, compras] = await Promise.all([
            Product.find().sort({ updatedAt: -1 }).limit(MAX_RECORDS).lean(),
            Venta.find().sort({ createdAt: -1 }).limit(MAX_RECORDS).lean(),
            Compra.find().sort({ createdAt: -1 }).limit(MAX_RECORDS).lean(),
        ]);

        const inventorySummary = products
            .map((product) => `${product.name} — stock: ${product.stock} uds, PVP ${product.pvp}`)
            .join('\n');

        const ventasSummary = ventas
            .map((venta) => `${venta.product_name}: ${venta.total_price} (${venta.status})`)
            .join('\n');

        const comprasSummary = compras
            .map((compra) => `${compra.product_name}: ${compra.total_cost} (${compra.status})`)
            .join('\n');

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Falta configurar OPENAI_API_KEY en el servidor.' });
        }

        const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

        const systemPrompt = `Eres Asistente Kai, copiloto financiero de Kosteo. Usas datos de inventario, ventas y compras recientes para responder de forma breve, clara y con recomendaciones accionables. Siempre razona paso a paso y ofrece ideas prácticas cuando sea posible.`;

        const contextBlock = `Inventario reciente:\n${inventorySummary || 'Sin productos registrados.'}\n\nVentas recientes:\n${ventasSummary || 'Sin ventas registradas.'}\n\nCompras recientes:\n${comprasSummary || 'Sin compras registradas.'}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                temperature: 0.2,
                messages: [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user',
                        content: `Pregunta del usuario: ${question}\n\nContexto estructurado:\n${contextBlock}`,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Assistant API] OpenAI error', errorText);
            throw new Error('El proveedor de IA no respondió correctamente.');
        }

        const completion = await response.json();
        const aiAnswer = completion?.choices?.[0]?.message?.content?.trim();

        return res.status(200).json({
            answer:
                aiAnswer ||
                'No pude generar una respuesta con la información disponible. Intenta reformular tu pregunta o verifica la conexión con el proveedor de IA.',
        });
    } catch (error) {
        console.error('[Assistant API] error', error);
        return res.status(500).json({ error: 'Error al procesar la solicitud de Kai' });
    }
}
