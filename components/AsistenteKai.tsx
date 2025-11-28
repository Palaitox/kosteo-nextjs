import React, { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { Sparkles, SendHorizontal, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    text: string;
}

interface AsistenteKaiProps {
    isCollapsed: boolean;
}

const initialMessage: Message = {
    role: 'assistant',
    text: 'Hola, soy Kai. Puedo ayudarte con métricas del inventario, transacciones recientes y también con información externa para tomar decisiones.',
};

const AsistenteKai: React.FC<AsistenteKaiProps> = ({ isCollapsed }) => {
    const [messages, setMessages] = useState<Message[]>([initialMessage]);
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = question.trim().length > 0 && !loading;

    const lastExchanges = useMemo(() => {
        // Keep UI tight by only showing last 3 items
        return messages.slice(-3);
    }, [messages]);

    const handleAskKai = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!question.trim()) {
            return;
        }

        const payload = question.trim();
        setMessages((prev) => [...prev, { role: 'user', text: payload }]);
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
                throw new Error('No pude obtener una respuesta en este momento. Intenta nuevamente.');
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }]);
        } catch (err: any) {
            console.error('Asistente Kai error:', err);
            setError(err?.message || 'Error desconocido');
        } finally {
            setQuestion('');
            setLoading(false);
        }
    };

    return (
        <div className={`kai-card ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="kai-header">
                <div className="kai-avatar">
                    <Sparkles size={18} />
                </div>
                {!isCollapsed && (
                    <>
                        <div>
                            <p className="kai-title">Asistente Kai</p>
                            <p className="kai-subtitle">Pregúntame sobre tu negocio</p>
                        </div>
                        <span className="kai-badge">AI</span>
                    </>
                )}
            </div>

            {!isCollapsed && (
                <>
                    <div className="kai-body">
                        {lastExchanges.map((message, index) => (
                            <div key={`${message.role}-${index}`} className={`kai-message ${message.role}`}>
                                <span>{message.text}</span>
                            </div>
                        ))}
                        {error && <p className="kai-error">{error}</p>}
                    </div>

                    <form className="kai-input" onSubmit={handleAskKai}>
                        <input
                            type="text"
                            placeholder="Pregunta rápida…"
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                        />
                        <button type="submit" disabled={!canSubmit} aria-label="Enviar pregunta">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <SendHorizontal size={16} />}
                        </button>
                    </form>

                    <Link className="kai-open-link" href="/asistente-kai">
                        Abrir vista completa
                    </Link>
                </>
            )}

            {isCollapsed && (
                <p className="kai-collapsed-hint">Kai</p>
            )}
        </div>
    );
};

export default AsistenteKai;
