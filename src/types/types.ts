// src/types.ts

// Types for risk management operations
export interface Operation {
    id: number;
    result: 'Ganada' | 'Perdida';
    initialCapital: number;
    montoRb: number;
    finalCapital: number;
    kellyUsed: number;
}

export interface FixedOperation {
    id: number;
    result: 'Ganada' | 'Perdida';
    initialCapital: number;
    montoRb: number;
    finalCapital: number;
    riskPercentage: number;
    fechaHoraApertura?: string;
    fechaHoraCierre?: string;
    observaciones?: string;
    imagenUrl?: string;
}
