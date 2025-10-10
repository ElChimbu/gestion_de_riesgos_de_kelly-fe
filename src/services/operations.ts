export interface Operation {
  id: string | number;
  type: 'fixed' | 'kelly' | string;
  result: 'win' | 'loss' | string;
  amount: number;
  date: string; // ISO string
  kellyPercent?: number; // optional for kelly ops
}

export type OperationsResponse =
  | Operation[]
  | { operations: Operation[]; meta?: { initialCapital?: number } };

import { API_CONFIG, getAuthHeaders } from '../config/api';

const API_BASE = API_CONFIG.ENDPOINTS.OPERATIONS;

const handleUnauthorized = () => {
  // Redirigir al login si no autenticado o token expirado
  try {
    // usar location para forzar redirección completa
    window.location.href = '/login';
  } catch (e) {
    console.error('Redirect failed', e);
  }
};

const check401 = (status: number) => {
  if (status === 401) handleUnauthorized();
};

export async function fetchOperations(): Promise<OperationsResponse> {
  const url = API_BASE;
  const headers = await getAuthHeaders();
  const res = await fetch(url, { method: 'GET', headers, credentials: 'include' as RequestCredentials });
  if (res.status === 401) check401(res.status);
  if (!res.ok) throw new Error(`Fetch error ${res.status}`);
  const data = await res.json();
  return data as OperationsResponse;
}

export async function createOperation(payload: Partial<Operation>): Promise<any> {
  const url = API_BASE;
  const headers = await getAuthHeaders();
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    credentials: 'include' as RequestCredentials,
  });
  if (res.status === 401) check401(res.status);
  if (!res.ok) throw new Error(`Create error ${res.status}`);
  return res.json();
}

export async function updateOperation(id: string | number, payload: Partial<Operation>): Promise<any> {
  const url = `${API_BASE}/${id}`;
  const headers = await getAuthHeaders();
  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
    credentials: 'include' as RequestCredentials,
  });
  if (res.status === 401) check401(res.status);
  if (!res.ok) throw new Error(`Update error ${res.status}`);
  return res.json();
}

export async function deleteOperation(id: string | number): Promise<any> {
  const url = `${API_BASE}/${id}`;
  const headers = await getAuthHeaders();
  const res = await fetch(url, { method: 'DELETE', headers, credentials: 'include' as RequestCredentials });
  if (res.status === 401) check401(res.status);
  if (!res.ok) throw new Error(`Delete error ${res.status}`);
  return res.json();
}

export async function deleteAllOperations(): Promise<any> {
  const url = API_BASE;
  const headers = await getAuthHeaders();
  const res = await fetch(url, { method: 'DELETE', headers, credentials: 'include' as RequestCredentials });
  if (res.status === 401) check401(res.status);
  if (!res.ok) throw new Error(`Delete all error ${res.status}`);
  return res.json();
}

export async function fetchOperationsStats(): Promise<any> {
  const url = API_BASE.replace(/\/operations$/, '/operations/stats');
  const headers = await getAuthHeaders();
  const res = await fetch(url, { method: 'GET', headers, credentials: 'include' as RequestCredentials });
  if (res.status === 401) check401(res.status);
  if (!res.ok) throw new Error(`Stats fetch error ${res.status}`);
  return res.json();
}
