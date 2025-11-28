import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { storage } from '@/lib/storage';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        // Basic email validation before API call
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }

        setLoading(true);

        try {
            // Check if user exists
            const searchRes = await fetch(`/api/v1/users?q=${encodeURIComponent(email)}&limit=1`);

            if (!searchRes.ok) {
                setError('Error al conectar con el servidor');
                setLoading(false);
                return;
            }

            const searchData = await searchRes.json();
            let user = searchData.items?.[0];

            // If user doesn't exist, create it
            if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
                const createRes = await fetch('/api/v1/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: email.split('@')[0],
                        email: email,
                    }),
                });

                if (!createRes.ok) {
                    const errorData = await createRes.json();
                    setError(errorData.message || 'Error al crear usuario');
                    setLoading(false);
                    return;
                }

                user = await createRes.json();
            }

            // Store user info in localStorage
            storage.set('user', {
                id: user.id,
                name: user.name,
                email: user.email,
            });

            router.push('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            setError('Error al iniciar sesión. Por favor intenta de nuevo.');
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Iniciar sesión — Kosteo</title>
            </Head>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '2rem'
            }}>
                <div className="card" style={{
                    maxWidth: '480px',
                    width: '100%',
                    padding: '3rem'
                }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        color: 'var(--text)'
                    }}>
                        Bienvenido a Kosteo
                    </h1>
                    <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '2rem',
                        fontSize: '1rem'
                    }}>
                        Ingresa con tu correo para continuar.
                    </p>

                    {error && (
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius)',
                            color: '#ef4444',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ marginBottom: '0.5rem' }}>Email</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="tu@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ marginBottom: '0.5rem' }}>Contraseña</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', marginBottom: '1rem' }}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <Link
                                href="/"
                                style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    transition: 'color 0.2s'
                                }}
                            >
                                ← Volver
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
