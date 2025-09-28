import { Operation, FixedOperation } from '../types/types';
import { buildApiUrl, getAuthHeaders } from '../config/api';

export interface FixedOperationStats {
    winrate: number;
    totalOperations: number;
    wins: number;
    losses: number;
}

export const fixedOperationsService = {
    getAll: async (): Promise<FixedOperation[]> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl('/fixed-operations'), {
            headers,
        });
        if (!res.ok) throw new Error('Error al obtener operaciones de riesgo fijo');
        return res.json();
    },
    
    create: async (operation: Omit<FixedOperation, 'id'>): Promise<FixedOperation> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl('/fixed-operations'), {
            method: 'POST',
            headers,
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al crear operación de riesgo fijo');
        return res.json();
    },
    
    update: async (id: number, operation: Omit<FixedOperation, 'id'>): Promise<FixedOperation> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl(`/fixed-operations/${id}`), {
            method: 'PUT',
            headers,
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al actualizar operación de riesgo fijo');
        return res.json();
    },
    
    delete: async (id: number): Promise<boolean> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl(`/fixed-operations/${id}`), {
            method: 'DELETE',
            headers,
        });
        if (!res.ok) throw new Error('Error al eliminar operación de riesgo fijo');
        return true;
    },
    
    reset: async (): Promise<void> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl('/fixed-operations'), {
            method: 'DELETE',
            headers,
        });
        if (!res.ok) throw new Error('Error al eliminar todas las operaciones de riesgo fijo');
    },
    
    getStats: async (): Promise<FixedOperationStats> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl('/fixed-operations/stats'), {
            headers,
        });
        if (!res.ok) throw new Error('Error al obtener estadísticas de operaciones fijas');
        return res.json();
    },
}; 