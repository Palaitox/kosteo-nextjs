import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const LandingPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Kosteo — Landing</title>
                <meta name="description" content="Calcula tus costos en tiempo real y toma decisiones con datos" />
            </Head>
            <section className="k-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 className="text-3xl font-bold mb-2">Kosteo</h1>
                <p className="text-slate-600 mb-6">
                    Calcula tus costos en tiempo real y toma decisiones con datos.
                </p>
                <Link href="/login" className="btn btn-primary">
                    Comenzar
                </Link>
            </section>
        </>
    );
};

export default LandingPage;
