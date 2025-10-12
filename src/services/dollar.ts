export interface DollarQuote {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

const DOLAR_API_URL = import.meta.env.VITE_DOLAR_API_URL || 'https://dolarapi.com/v1/dolares';

/**
 * Fetch all Argentine dollar quotes from DolarAPI
 */
export async function fetchDollarQuotes(): Promise<DollarQuote[]> {
  const res = await fetch(DOLAR_API_URL);
  if (!res.ok) throw new Error(`DolarAPI error ${res.status}`);
  const data = await res.json();
  return data as DollarQuote[];
}