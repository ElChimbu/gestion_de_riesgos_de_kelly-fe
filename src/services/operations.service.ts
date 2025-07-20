// src/services/operations.service.ts
import { Operation } from '../types/types';
import { buildApiUrl, API_CONFIG } from '../config/api';

export const operationsService = {
    getAll: async (): Promise<Operation[]> => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.OPERATIONS));
        if (!res.ok) throw new Error('Error al obtener operaciones');
        return res.json();
    },
    create: async (operation: Omit<Operation, 'id'>): Promise<Operation> => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.OPERATIONS), {
            method: 'POST',
            headers: API_CONFIG.DEFAULT_HEADERS,
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al crear operación');
        return res.json();
    },
    update: async (id: number, operation: Omit<Operation, 'id'>): Promise<Operation> => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.OPERATIONS}/${id}`), {
            method: 'PUT',
            headers: API_CONFIG.DEFAULT_HEADERS,
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al actualizar operación');
        return res.json();
    },
    delete: async (id: number): Promise<boolean> => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.OPERATIONS}/${id}`), {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar operación');
        return true;
    },
    reset: async (): Promise<void> => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.OPERATIONS), {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar todas las operaciones');
    },
}; 