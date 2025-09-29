// src/config/api.ts

import { auth } from './firebase';

/**
 * Configuración centralizada de la API
 * Maneja las variables de entorno y proporciona URLs consistentes
 */

export const API_CONFIG = {
    // Endpoints completos desde variables de entorno
    ENDPOINTS: {
        OPERATIONS: import.meta.env.VITE_OPERATIONS_ENDPOINT || '/api/operations',
        FIXED_OPERATIONS: import.meta.env.VITE_FIXED_OPERATIONS_ENDPOINT || '/api/fixed-operations',
        FIXED_OPERATIONS_STATS: import.meta.env.VITE_FIXED_OPERATIONS_STATS_ENDPOINT || '/api/fixed-operations/stats',
        UPLOAD: import.meta.env.VITE_UPLOAD_ENDPOINT || '/api/upload',
    },

    // Headers por defecto
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
    },
} as const;

/**
 * Obtiene la URL completa para un endpoint
 */
export const buildApiUrl = (endpoint: string): string => {
    return endpoint;
};

/**
 * Obtiene los headers de autenticación con el token de Firebase
 */
export const getAuthHeaders = async (): Promise<HeadersInit> => {
    const user = auth.currentUser;
    const headers: HeadersInit = {
        ...API_CONFIG.DEFAULT_HEADERS,
    };

    if (user) {
        try {
            const token = await user.getIdToken();
            headers['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            console.error('Error getting auth token:', error);
        }
    }

    return headers;
};

/**
 * Configuración para diferentes entornos
 */
export const ENV_CONFIG = {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    endpoints: API_CONFIG.ENDPOINTS,
} as const;