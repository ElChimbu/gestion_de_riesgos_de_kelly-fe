import { Operation, FixedOperation } from '../types/types';
import { buildApiUrl, API_CONFIG } from '../config/api';

export interface FixedOperationStats {
    winrate: number;
    totalOperations: number;
    wins: number;
    losses: number;
}

export const fixedOperationsService = {
    getAll: async (): Promise<FixedOperation[]> => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FIXED_OPERATIONS));
        if (!res.ok) throw new Error('Error al obtener operaciones de riesgo fijo');
        return res.json();
    },
    
    create: async (operation: Omit<FixedOperation, 'id'>): Promise<FixedOperation> => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FIXED_OPERATIONS), {
            method: 'POST',
            headers: API_CONFIG.DEFAULT_HEADERS,
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al crear operación de riesgo fijo');
        return res.json();
    },
    
    update: async (id: number, operation: Omit<FixedOperation, 'id'>): Promise<FixedOperation> => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.FIXED_OPERATIONS}/${id}`), {
            method: 'PUT',
            headers: API_CONFIG.DEFAULT_HEADERS,
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al actualizar operación de riesgo fijo');
        return res.json();
    },
    
    delete: async (id: number): Promise<boolean> => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.FIXED_OPERATIONS}/${id}`), {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar operación de riesgo fijo');
        return true;
    },
    
    reset: async (): Promise<void> => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FIXED_OPERATIONS), {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar todas las operaciones de riesgo fijo');
    },
    
    getStats: async (): Promise<FixedOperationStats> => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FIXED_OPERATIONS_STATS));
        if (!res.ok) throw new Error('Error al obtener estadísticas de operaciones fijas');
        return res.json();
    },
}; 