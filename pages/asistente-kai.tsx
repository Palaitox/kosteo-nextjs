import React, { FormEvent, useMemo, useState } from 'react';
import Head from 'next/head';
import { Sparkles, SendHorizontal, Loader2, Database, Globe2, Lightbulb, Zap, ShieldCheck } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    text: string;
}

const defaultAssistantMessage: Message = {
    role: 'assistant',
    text: 'Hola, soy Kai. Puedo analizar tu inventario, ventas y compras recientes junto con información externa para ayudarte a decidir mejor. ¿Qué necesitas hoy?',
};

const quickPrompts = [
    '¿Cómo va el stock de mis productos más vendidos?',
    'Resume las ventas y compras de esta semana.',
    '¿Qué insumos debería reordenar pronto?',
    'Dame ideas para promociones usando datos del mercado.',
];

const signalCards = [
    {
        icon: Database,
        title: 'Contexto interno',
        desc: 'Inventario actualizado, ventas y compras recientes.',
    },
    {
        icon: Globe2,
        title: 'Señales externas',
        desc: 'Conecta APIs de mercado y noticias relevantes.',
    },
    {
        icon: ShieldCheck,
        title: 'Privacidad',
        desc: 'Tu información se mantiene segura dentro de Kosteo.',
    },
];

const KaiPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([defaultAssistantMessage]);
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = question.trim().length > 0 && !loading;

    const handlePromptClick = (prompt: string) => {
        setQuestion(prompt);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!question.trim()) {
            return;
        }

        const payload = question.trim();
        setMessages((prev) => [...prev, { role: 'user', text: payload }]);
        setQuestion('');
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/v1/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: payload }),
            });

            if (!response.ok) {
                throw new Error('No pude obtener una respuesta ahora mismo. Inténtalo otra vez.');
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }]);
        } catch (err: any) {
            console.error('[Kai page] error', err);
            setError(err?.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const lastMessages = useMemo(() => messages.slice(0), [messages]);

    return (
        <>
            <Head>
                <title>Asistente Kai — Kosteo</title>
            </Head>
            <div className="fade-in kai-shell">
                <div className="kai-primary-panel">
                    <header className="kai-header">
                        <div>
                            <h1>Asistente Kai</h1>
                            <p>Tu copiloto financiero conectado a Kosteo y la web.</p>
                        </div>
                        <button
                            className="ghost-btn"
                            type="button"
                            onClick={() => {
                                setMessages([defaultAssistantMessage]);
                                setError(null);
                            }}
                            disabled={loading}
                        >
                            Reiniciar sesión
                        </button>
                    </header>

                    <div className="kai-chat-stage">
                        <div className="kai-chat-board">
                            {lastMessages.map((message, index) => (
                                <article key={`${message.role}-${index}`} className={`kai-bubble ${message.role}`}>
                                    <header>
                                        {message.role === 'assistant' ? <Sparkles size={14} /> : <Lightbulb size={14} />}
                                        <span>{message.role === 'assistant' ? 'Kai' : 'Tú'}</span>
                                    </header>
                                    <p>{message.text}</p>
                                </article>
                            ))}
                            {error && <p className="kai-error-banner">{error}</p>}
                            {loading && (
                                <div className="kai-thinking">
                                    <Loader2 className="animate-spin" size={18} />
                                    Kai está pensando…
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="kai-composer">
                            <textarea
                                placeholder="Pregúntale algo a Kai..."
                                value={question}
                                onChange={(event) => setQuestion(event.target.value)}
                            />
                            <button type="submit" disabled={!canSubmit} aria-label="Enviar">
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <SendHorizontal size={18} />}
                            </button>
                        </form>
                    </div>
                </div>

                <aside className="kai-info-panel">
                    <section className="kai-welcome-card">
                        <div className="avatar">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <p className="eyebrow">Bienvenido a KAI</p>
                            <h2>Tu copiloto financiero</h2>
                            <p className="muted">Conectado a tus datos de negocio y a señales externas para darte análisis claros.</p>
                        </div>
                    </section>

                    <section className="kai-prompt-card">
                        <p className="eyebrow">Prueba preguntando:</p>
                        <div className="prompt-list">
                            {quickPrompts.map((prompt) => (
                                <button key={prompt} type="button" onClick={() => handlePromptClick(prompt)}>
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="kai-signals-card">
                        <p className="eyebrow">Señales activas</p>
                        <div className="signal-grid">
                            {signalCards.map((card) => (
                                <div key={card.title} className="signal-card">
                                    <card.icon size={18} />
                                    <div>
                                        <p>{card.title}</p>
                                        <span>{card.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="kai-roadmap-card">
                        <p className="eyebrow">Próximamente</p>
                        <h3>Acciones ejecutables</h3>
                        <ul>
                            <li><Zap size={14} /> Generar órdenes de compra</li>
                            <li><Zap size={14} /> Programar alertas de stock</li>
                            <li><Zap size={14} /> Compartir reportes automáticos</li>
                        </ul>
                    </section>
                </aside>
            </div>
        </>
    );
};

export default KaiPage;
