import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { storage } from '@/lib/storage';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Completa los campos');
            return;
        }

        // Simple localStorage-based auth (mock)
        storage.set('user', email);

        router.push('/dashboard');
    };

    return (
        <>
            <Head>
                <title>Iniciar sesión — Kosteo</title>
            </Head>
            <div
                className="k-container"
                style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}
            >
                <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
                    <h1 className="text-xl font-bold mb-2">Bienvenido a Kosteo</h1>
                    <p className="text-slate-600 mb-4">Ingresa con tu correo para continuar.</p>
                    <form onSubmit={handleSubmit}>
                        <label>Email</label>
                        <input
                            type="email"
                            className="input my-2"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Contraseña</label>
                        <input
                            type="password"
                            className="input my-2"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">
                            Iniciar sesión
                        </button>
                        <Link href="/" className="link" style={{ marginLeft: '0.75rem' }}>
                            Volver
                        </Link>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
