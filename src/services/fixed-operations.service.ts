import { Operation, FixedOperation } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL;

export interface FixedOperationStats {
    winrate: number;
    totalOperations: number;
    wins: number;
    losses: number;
}

export const fixedOperationsService = {
    getAll: async (): Promise<FixedOperation[]> => {
        const res = await fetch(`${API_URL}/fixed-operations`);
        if (!res.ok) throw new Error('Error al obtener operaciones de riesgo fijo');
        return res.json();
    },
    
    create: async (operation: Omit<FixedOperation, 'id'>): Promise<FixedOperation> => {
        const res = await fetch(`${API_URL}/fixed-operations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al crear operación de riesgo fijo');
        return res.json();
    },
    
    update: async (id: number, operation: Omit<FixedOperation, 'id'>): Promise<FixedOperation> => {
        const res = await fetch(`${API_URL}/fixed-operations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al actualizar operación de riesgo fijo');
        return res.json();
    },
    
    delete: async (id: number): Promise<boolean> => {
        const res = await fetch(`${API_URL}/fixed-operations/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar operación de riesgo fijo');
        return true;
    },
    
    reset: async (): Promise<void> => {
        const res = await fetch(`${API_URL}/fixed-operations`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar todas las operaciones de riesgo fijo');
    },
    
    getStats: async (): Promise<FixedOperationStats> => {
        const res = await fetch(`${API_URL}/fixed-operations/stats`);
        if (!res.ok) throw new Error('Error al obtener estadísticas de operaciones fijas');
        return res.json();
    },
}; 