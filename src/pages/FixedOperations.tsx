import React, { useState, useEffect, useCallback } from 'react';
import "../tailwind.css";
import { FixedOperation } from "../types/types";
import { fixedOperationsService, FixedOperationStats } from '../services/fixed-operations.service';

interface FixedOperationForm extends Omit<FixedOperation, 'id'> {}

const FixedOperations: React.FC = () => {
    const [initialCapital, setInitialCapital] = useState<number>(2000);
    const [fixedRiskPercentage] = useState<number>(2); // Siempre 2%
    const [rbRatio, setRbRatio] = useState<number>(1.5);
    
    const [operations, setOperations] = useState<FixedOperation[]>([]);
    const [stats, setStats] = useState<FixedOperationStats | null>(null);
    const [currentCapital, setCurrentCapital] = useState<number>(initialCapital);
    
    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<FixedOperationForm | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper seguro para toFixed
    const safeFixed = (value: number | undefined | null, digits = 2) => {
        if (typeof value !== 'number' || isNaN(value)) return '0.00';
        return value.toFixed(digits);
    };

    // Cargar operaciones y estadísticas
    useEffect(() => {
        setLoading(true);
        Promise.all([
            fixedOperationsService.getAll(),
            fixedOperationsService.getStats()
        ])
        .then(([ops, statsData]) => {
            setOperations(ops);
            setStats(statsData);
            if (ops.length > 0) {
                setCurrentCapital(ops[ops.length - 1].finalCapital);
            } else {
                setCurrentCapital(initialCapital);
            }
        })
        .catch(() => setError('Error al cargar operaciones'))
        .finally(() => setLoading(false));
    }, []);

    const addFixedOperation = useCallback(async (isWin: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const lastCapital = operations.length > 0 ? operations[operations.length - 1].finalCapital : initialCapital;
            const riskAmount = (fixedRiskPercentage / 100) * lastCapital;
            
            let montoRb = 0;
            let finalCapital = 0;
            
            if (isWin) {
                montoRb = riskAmount * rbRatio;
                finalCapital = lastCapital + montoRb;
            } else {
                montoRb = -riskAmount;
                finalCapital = lastCapital + montoRb;
            }

            const newOp = await fixedOperationsService.create({
                result: isWin ? 'Ganada' : 'Perdida',
                initialCapital: lastCapital,
                montoRb,
                finalCapital,
                riskPercentage: fixedRiskPercentage
            });
            
            setOperations((prevOps) => [...prevOps, newOp]);
            setCurrentCapital(finalCapital);
            
            // Recargar estadísticas
            const newStats = await fixedOperationsService.getStats();
            setStats(newStats);
        } catch {
            setError('Error al crear operación');
        } finally {
            setLoading(false);
        }
    }, [operations, initialCapital, fixedRiskPercentage, rbRatio]);

    const handleDelete = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await fixedOperationsService.delete(id);
            setOperations((ops) => ops.filter((op) => op.id !== id));
            
            // Recargar estadísticas
            const newStats = await fixedOperationsService.getStats();
            setStats(newStats);
        } catch {
            setError('Error al eliminar operación');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (op: FixedOperation) => {
        setEditId(op.id);
        setEditForm({
            result: op.result,
            initialCapital: op.initialCapital,
            montoRb: op.montoRb,
            finalCapital: op.finalCapital,
            riskPercentage: op.riskPercentage,
        });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editForm) return;
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: name === 'result' ? value : Number(value),
        });
    };

    const handleEditSave = async (id: number) => {
        if (!editForm) return;
        setLoading(true);
        setError(null);
        try {
            const updated = await fixedOperationsService.update(id, editForm);
            setOperations((ops) =>
                ops.map((op) =>
                    op.id === id ? { ...updated } : op
                )
            );
            setEditId(null);
            setEditForm(null);

            // Recargar estadísticas
            const newStats = await fixedOperationsService.getStats();
            setStats(newStats);
        } catch {
            setError('Error al actualizar operación');
        } finally {
            setLoading(false);
        }
    };

    const handleEditCancel = () => {
        setEditId(null);
        setEditForm(null);
    };

    const resetData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await fixedOperationsService.reset();
            setOperations([]);
            setCurrentCapital(initialCapital);
            setStats(null);
        } catch {
            setError('Error al reiniciar operaciones');
        } finally {
            setLoading(false);
        }
    }, [initialCapital]);

    // Calcular progreso hacia 100 operaciones
    const progressTo100 = operations.length;
    const progressPercentage = Math.min((progressTo100 / 100) * 100, 100);

    // Calcular el monto de riesgo sugerido para la próxima operación
    const nextBaseCapital = operations.length > 0 ? operations[operations.length - 1].finalCapital : initialCapital;
    const nextRiskAmount = (fixedRiskPercentage / 100) * nextBaseCapital;

    return (
        <div className="min-h-screen bg-neutral-900 p-4 font-sans">
            <div className="max-w-6xl mx-auto bg-neutral-800 p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
                    📊 Registro de Operaciones - Riesgo Fijo (2%)
                </h1>

                {/* Navegación */}
                <div className="flex justify-center mb-6">
                    <a 
                        href="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        📈 Volver a Gestión Kelly
                    </a>
                </div>

                {loading && <div className="text-center text-blue-300">Cargando...</div>}
                {error && <div className="text-center text-red-400">{error}</div>}

                {/* Configuración */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 bg-neutral-800 p-6 rounded-lg">
                    <div>
                        <label className="block mb-1 font-medium text-white">Capital Inicial ($)</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-white placeholder-gray-400"
                            value={initialCapital}
                            onChange={(e) => setInitialCapital(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-white">% Riesgo Fijo</label>
                        <div className="bg-black border border-white p-2 rounded font-bold text-white">
                            {fixedRiskPercentage}% (Fijo)
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-white">Ratio R/B</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-white placeholder-gray-400"
                            value={rbRatio}
                            onChange={(e) => setRbRatio(Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* Progreso hacia 100 operaciones */}
                <div className="mb-6 bg-neutral-900 p-4 rounded-lg border border-white">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white">Progreso hacia 100 operaciones:</span>
                        <span className="font-bold text-white">{progressTo100}/100</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-4">
                        <div 
                            className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Estadísticas */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-neutral-800 p-6 rounded-lg shadow-inner">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{safeFixed(Number(stats.winrate))}%</div>
                            <div className="text-sm text-white">Winrate Real</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-700">{stats.wins}</div>
                            <div className="text-sm text-green-600">Operaciones Ganadas</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-700">{stats.losses}</div>
                            <div className="text-sm text-red-600">Operaciones Perdidas</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{operations.length}</div>
                            <div className="text-sm text-white">Total Operaciones</div>
                        </div>
                    </div>
                )}

                {/* Capital actual y margen a arriesgar */}
                <div className="mb-6">
                    <div className="bg-neutral-900 border border-white rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
                            <div className="text-white font-semibold text-lg flex-1">
                                <span>🏦 Capital Inicial:</span>
                                <span className="ml-2 text-white font-bold">${safeFixed(initialCapital)}</span>
                            </div>
                            <div className="text-white font-semibold text-lg flex-1">
                                <span>💰 Capital Actual:</span>
                                <span className="ml-2 text-white font-bold">${safeFixed(currentCapital)}</span>
                            </div>
                            <div className="text-white font-semibold text-lg flex-1">
                                <span>💡 Margen a arriesgar próxima operación:</span>
                                <span className="ml-2 text-white font-bold">${safeFixed(nextRiskAmount)} ({safeFixed(fixedRiskPercentage)}%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                        onClick={() => addFixedOperation(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Operación Ganada
                    </button>
                    <button
                        onClick={() => addFixedOperation(false)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Operación Perdida
                    </button>
                    <button
                        onClick={resetData}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Reiniciar
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto bg-neutral-900 p-4 rounded-lg shadow-inner">
                    {operations.length === 0 ? (
                        <p className="text-center text-white">No hay operaciones aún.</p>
                    ) : (
                        <table className="min-w-full text-sm table-auto border border-neutral-700 rounded-lg">
                            <thead className="bg-neutral-800">
                                <tr>
                                    <th className="px-4 py-2 text-gray-200">#</th>
                                    <th className="px-4 py-2 text-white">Resultado</th>
                                    <th className="px-4 py-2 text-white">Capital Inicial</th>
                                    <th className="px-4 py-2 text-white">PNL (%)</th>
                                    <th className="px-4 py-2 text-white">Capital Final</th>
                                    <th className="px-4 py-2 text-white">% Riesgo</th>
                                    <th className="px-4 py-2 text-center text-white" style={{ minWidth: 140 }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {operations.map((op) => (
                                    <tr key={op.id} className={op.result === 'Ganada' ? 'bg-green-900/30' : 'bg-red-900/30'}>
                                        <td className="px-4 py-2 text-center text-white">{op.id}</td>
                                        {editId === op.id ? (
                                            <>
                                                <td className="px-4 py-2 text-center">
                                                    <select
                                                        name="result"
                                                        value={editForm?.result || ''}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1"
                                                    >
                                                        <option value="Ganada">Ganada</option>
                                                        <option value="Perdida">Perdida</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <input
                                                        name="initialCapital"
                                                        type="number"
                                                        value={editForm?.initialCapital || 0}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-24"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <input
                                                        name="montoRb"
                                                        type="number"
                                                        value={editForm?.montoRb || 0}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-24"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <input
                                                        name="finalCapital"
                                                        type="number"
                                                        value={editForm?.finalCapital || 0}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-24"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <input
                                                        name="riskPercentage"
                                                        type="number"
                                                        value={editForm?.riskPercentage || 0}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-16"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center" style={{ minWidth: 140 }}>
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => handleEditSave(op.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">Guardar</button>
                                                        <button onClick={handleEditCancel} className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded">Cancelar</button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-2 text-center text-white">{op.result}</td>
                                                <td className="px-4 py-2 text-center text-white">${safeFixed(op.initialCapital)}</td>
                                                <td className={`px-4 py-2 text-center font-semibold ${op.montoRb >= 0 ? 'text-green-700' : 'text-red-700'}`}>{op.initialCapital !== 0 ? `${op.montoRb >= 0 ? '+' : ''}${safeFixed((op.montoRb / op.initialCapital) * 100)}%` : '0.00%'}</td>
                                                <td className="px-4 py-2 text-center font-semibold text-white">${safeFixed(op.finalCapital)}</td>
                                                <td className="px-4 py-2 text-center text-white">{safeFixed(op.riskPercentage)}%</td>
                                                <td className="px-4 py-2 text-center" style={{ minWidth: 140 }}>
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => handleEdit(op)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                                                        <button onClick={() => handleDelete(op.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FixedOperations; 