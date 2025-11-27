/**
 * Safe localStorage wrapper for Next.js (client-side only)
 */

export const storage = {
    get: (key: string, defaultValue: any = null) => {
        if (typeof window === 'undefined') return defaultValue;
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return defaultValue;
            try {
                return JSON.parse(item);
            } catch {
                return item;
            }
        } catch (error) {
            console.error(`Error reading ${key} from localStorage`, error);
            return defaultValue;
        }
    },

    set: (key: string, value: any) => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage`, error);
        }
    },

    remove: (key: string) => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key} from localStorage`, error);
        }
    },

    clear: () => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage', error);
        }
    }
};
