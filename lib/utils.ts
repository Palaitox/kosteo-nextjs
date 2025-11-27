/**
 * Common utility functions
 */

// Format number as currency (COP/USD based on locale, default to USD style for now as per original app)
export function fmtMoney(amount: number | string): string {
    const num = Number(amount || 0);
    return '$' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Format percentage
export function fmtPercent(amount: number | string): string {
    const num = Number(amount || 0);
    return num.toFixed(1) + '%';
}

// Format date
export function fmtDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
}

// Generate random ID (for frontend-only items if needed)
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

// Capitalize first letter
export function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
