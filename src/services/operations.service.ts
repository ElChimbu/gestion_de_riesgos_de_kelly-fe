// src/services/operations.service.ts
import { Operation } from '../types/types';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from '../config/api';

export const operationsService = {
    getAll: async (): Promise<Operation[]> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.OPERATIONS), {
            headers,
        });
        if (!res.ok) throw new Error('Error al obtener operaciones');
        return res.json();
    },
    create: async (operation: Omit<Operation, 'id'>): Promise<Operation> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.OPERATIONS), {
            method: 'POST',
            headers,
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al crear operación');
        return res.json();
    },
    update: async (id: number, operation: Omit<Operation, 'id'>): Promise<Operation> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.OPERATIONS}/${id}`), {
            method: 'PUT',
            headers,
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al actualizar operación');
        return res.json();
    },
    delete: async (id: number): Promise<boolean> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.OPERATIONS}/${id}`), {
            method: 'DELETE',
            headers,
        });
        if (!res.ok) throw new Error('Error al eliminar operación');
        return true;
    },
    reset: async (): Promise<void> => {
        const headers = await getAuthHeaders();
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.OPERATIONS), {
            method: 'DELETE',
            headers,
        });
        if (!res.ok) throw new Error('Error al eliminar todas las operaciones');
    },
};