// src/config/api.ts

import { auth } from './firebase';

/**
 * Configuración centralizada de la API
 * Maneja las variables de entorno y proporciona URLs consistentes
 */

export const API_CONFIG = {
    // URL base de la API
    BASE_URL: (() => {
        const envUrl = import.meta.env.VITE_API_URL;
        
        if (envUrl) {
            // Asegurar que no termine en slash
            const cleanUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
            return cleanUrl;
        }
        // Fallback para desarrollo local
        return '/api';
    })(),
    
    // Endpoints de operaciones normales
    ENDPOINTS: {
        OPERATIONS: '/operations',
        FIXED_OPERATIONS: '/fixed-operations',
        FIXED_OPERATIONS_STATS: '/fixed-operations/stats',
        UPLOAD: '/upload',
    },
    
    // Headers por defecto
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
    },
} as const;

/**
 * Construye una URL completa para un endpoint
 */
export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
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
    apiUrl: API_CONFIG.BASE_URL,
} as const; 