import { storage } from './storage';

export type PlanType = 'BASIC' | 'PLUS' | 'PREMIUM';

export const PLANS = {
    BASIC: {
        name: 'Básico',
        price: 0,
        features: ['Dashboard', 'Productos', 'Compras', 'Costeo'],
        level: 0
    },
    PLUS: {
        name: 'Plus',
        price: 29,
        features: ['Todo lo de Básico', 'Ventas', 'Reportes P&L'],
        level: 1
    },
    PREMIUM: {
        name: 'Premium',
        price: 59,
        features: ['Todo lo de Plus', 'Indicadores', 'Presupuestos', 'Exportar Datos'],
        level: 2
    }
};

export function getCurrentPlan(): PlanType {
    return storage.get('plan', 'BASIC') as PlanType;
}

export function hasAccess(requiredPlan: PlanType): boolean {
    const current = getCurrentPlan();
    const currentLevel = PLANS[current]?.level || 0;
    const requiredLevel = PLANS[requiredPlan]?.level || 0;

    return currentLevel >= requiredLevel;
}

export function setPlan(plan: PlanType) {
    storage.set('plan', plan);
    // Dispatch event for components to react
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('plan-changed'));
    }
}
