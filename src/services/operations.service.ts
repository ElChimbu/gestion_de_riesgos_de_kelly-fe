// src/services/operations.service.ts
import { Operation } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL;

export const operationsService = {
    getAll: async (): Promise<Operation[]> => {
        const res = await fetch(`${API_URL}/operations`);
        if (!res.ok) throw new Error('Error al obtener operaciones');
        return res.json();
    },
    create: async (operation: Omit<Operation, 'id'>): Promise<Operation> => {
        const res = await fetch(`${API_URL}/operations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al crear operación');
        return res.json();
    },
    update: async (id: number, operation: Omit<Operation, 'id'>): Promise<Operation> => {
        const res = await fetch(`${API_URL}/operations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(operation),
        });
        if (!res.ok) throw new Error('Error al actualizar operación');
        return res.json();
    },
    delete: async (id: number): Promise<boolean> => {
        const res = await fetch(`${API_URL}/operations/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar operación');
        return true;
    },
    reset: async (): Promise<void> => {
        const res = await fetch(`${API_URL}/operations`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar todas las operaciones');
    },
}; 