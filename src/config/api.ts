// src/config/api.ts

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
 * Configuración para diferentes entornos
 */
export const ENV_CONFIG = {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    apiUrl: API_CONFIG.BASE_URL,
} as const; 