import React, { useState, useEffect, useMemo, useCallback } from 'react';
import "../tailwind.css";
import { Operation } from "../types/types";
import { operationsService } from '../services/operations.service';

interface OperationForm extends Omit<Operation, 'id'> {}

const initialFormState: OperationForm = {
    result: 'Ganada',
    initialCapital: 0,
    montoRb: 0,
    finalCapital: 0,
    kellyUsed: 0,
};

let globalId = 1;

const Home: React.FC = () => {
    const [initialCapital, setInitialCapital] = useState<number>(2000);
    const [fixedRiskPercentage, setFixedRiskPercentage] = useState<number>(2);
    const [rbRatio, setRbRatio] = useState<number>(1.5);
    const [winRate, setWinRate] = useState<number>(30);
    const [useKelly, setUseKelly] = useState<boolean>(true);

    const [operations, setOperations] = useState<Operation[]>([]);
    const [currentCapital, setCurrentCapital] = useState<number>(initialCapital);
    const [maxCapital, setMaxCapital] = useState<number>(initialCapital);
    const [minCapital, setMinCapital] = useState<number>(initialCapital);
    const [maxDrawdown, setMaxDrawdown] = useState<number>(0);

    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<OperationForm | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const kellyPercentage = useMemo<number>(() => {
        const p = winRate / 100;
        const b = rbRatio;
        if (b <= 0) return 0;
        const kellyF = p - (1 - p) / b;
        return Math.min(Math.max(0, kellyF * 100), 25); // máximo 25%
    }, [winRate, rbRatio]);

    useEffect(() => {
        setLoading(true);
        operationsService.getAll()
            .then(setOperations)
            .catch(() => setError('Error al cargar operaciones'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (operations.length === 0) {
            setCurrentCapital(initialCapital);
            setMaxCapital(initialCapital);
            setMinCapital(initialCapital);
            setMaxDrawdown(0);
            return;
        }

        let tempCurrentCapital = initialCapital;
        let tempMaxCapital = initialCapital;
        let tempMinCapital = initialCapital;
        let tempMaxDrawdown = 0;
        let peakCapital = initialCapital;

        operations.forEach((op: Operation) => {
            tempCurrentCapital = op.finalCapital;
            if (tempCurrentCapital > tempMaxCapital) tempMaxCapital = tempCurrentCapital;
            if (tempCurrentCapital < tempMinCapital) tempMinCapital = tempCurrentCapital;

            if (tempCurrentCapital < peakCapital) {
                tempMaxDrawdown = Math.max(tempMaxDrawdown, (peakCapital - tempCurrentCapital) / peakCapital * 100);
            } else {
                peakCapital = tempCurrentCapital;
            }
        });

        setCurrentCapital(tempCurrentCapital);
        setMaxCapital(tempMaxCapital);
        setMinCapital(tempMinCapital);
        setMaxDrawdown(tempMaxDrawdown);
    }, [operations, initialCapital]);

    useEffect(() => {
        resetData(); // cuando cambia el capital inicial
    }, [initialCapital]);

    const addOperation = useCallback(async (isWin: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const lastCapital = Number(operations.length > 0 ? operations[operations.length - 1].finalCapital : initialCapital) || 0;
            const riskPercent = Number(useKelly ? kellyPercentage : fixedRiskPercentage) || 0;
            const riskAmount = (riskPercent / 100) * lastCapital;

            let montoRb = 0;
            let finalCapital = 0;

            if (isWin) {
                montoRb = riskAmount * rbRatio;
                finalCapital = lastCapital + montoRb;
            } else {
                montoRb = -riskAmount;
                finalCapital = lastCapital + montoRb;
            }

            // Validar antes de enviar
            if ([montoRb, finalCapital, lastCapital, riskPercent].some((v) => isNaN(v))) {
                setError('Error: cálculo inválido');
                setLoading(false);
                return;
            }

            const newOp = await operationsService.create({
                result: isWin ? 'Ganada' : 'Perdida',
                initialCapital: lastCapital,
                montoRb,
                finalCapital,
                kellyUsed: riskPercent
            });
            setOperations((prevOps) => [...prevOps, newOp]);
        } catch {
            setError('Error al crear operación');
        } finally {
            setLoading(false);
        }
    }, [operations, initialCapital, kellyPercentage, fixedRiskPercentage, rbRatio, useKelly]);

    const resetData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await operationsService.reset();
            setOperations([]);
            setCurrentCapital(initialCapital);
            setMaxCapital(initialCapital);
            setMinCapital(initialCapital);
            setMaxDrawdown(0);
            globalId = 1;
        } catch {
            setError('Error al reiniciar operaciones');
        } finally {
            setLoading(false);
        }
    }, [initialCapital]);

    const handleDelete = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await operationsService.delete(id);
            setOperations((ops) => ops.filter((op) => op.id !== id));
        } catch {
            setError('Error al eliminar operación');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (op: Operation) => {
        setEditId(op.id);
        setEditForm({
            result: op.result,
            initialCapital: op.initialCapital,
            montoRb: op.montoRb,
            finalCapital: op.finalCapital,
            kellyUsed: op.kellyUsed,
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
            const updated = await operationsService.update(id, editForm);
            setOperations((ops) =>
                ops.map((op) =>
                    op.id === id ? { ...updated } : op
                )
            );
            setEditId(null);
            setEditForm(null);
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

    // Skeleton para la tabla
    const TableSkeleton = () => (
        <table className="min-w-full text-sm table-auto border border-gray-300 rounded-lg animate-pulse">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Resultado</th>
                    <th className="px-4 py-2">Capital Inicial</th>
                    <th className="px-4 py-2">Monto R/B</th>
                    <th className="px-4 py-2">Capital Final</th>
                    <th className="px-4 py-2">% Riesgo</th>
                    <th className="px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {[...Array(4)].map((_, i) => (
                    <tr key={i}>
                        {[...Array(7)].map((_, j) => (
                            <td key={j} className="px-4 py-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // Skeleton para estadísticas
    const StatsSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-purple-50 p-6 rounded-lg shadow-inner animate-pulse">
            {[...Array(4)].map((_, i) => (
                <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );

    // Helper seguro para toFixed
    const safeFixed = (value: number | undefined | null, digits = 2) => {
        if (typeof value !== 'number' || isNaN(value)) return '0.00';
        return value.toFixed(digits);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4 font-sans">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8">
                    📈 Gestión de Riesgos – Método de Kelly
                </h1>

                {loading && <div className="text-center text-blue-600">Cargando...</div>}
                {error && <div className="text-center text-red-600">{error}</div>}

                {/* Configuración */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 bg-blue-50 p-6 rounded-lg">
                    <div>
                        <label className="block mb-1 font-medium">Capital Inicial ($)</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded border border-blue-300"
                            value={initialCapital}
                            onChange={(e) => setInitialCapital(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">% Riesgo Fijo</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded border border-blue-300"
                            value={fixedRiskPercentage}
                            onChange={(e) => setFixedRiskPercentage(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Ratio R/B</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded border border-blue-300"
                            value={rbRatio}
                            onChange={(e) => setRbRatio(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">% de Winrate Estimado</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded border border-blue-300"
                            value={winRate}
                            onChange={(e) => setWinRate(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">¿Usar Kelly?</label>
                        <select
                            className="w-full p-2 rounded border border-blue-300"
                            value={useKelly ? "kelly" : "fijo"}
                            onChange={(e) => setUseKelly(e.target.value === "kelly")}
                        >
                            <option value="kelly">Sí (Kelly)</option>
                            <option value="fijo">No (Riesgo Fijo)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">F. Kelly Calculada</label>
                        <div className="bg-white border border-blue-300 p-2 rounded font-bold text-blue-700">
                            {kellyPercentage.toFixed(2)}%
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                        onClick={() => addOperation(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Operación Ganada
                    </button>
                    <button
                        onClick={() => addOperation(false)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Operación Perdida
                    </button>
                    <button
                        onClick={() => resetData()}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Reiniciar
                    </button>
                </div>

                {/* Estadísticas */}
                {loading ? <StatsSkeleton /> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-purple-50 p-6 rounded-lg shadow-inner">
                        <div><strong>Capital Actual:</strong> ${safeFixed(currentCapital)}</div>
                        <div><strong>Capital Máximo:</strong> ${safeFixed(maxCapital)}</div>
                        <div><strong>Capital Mínimo:</strong> ${safeFixed(minCapital)}</div>
                        <div><strong>Máx. Drawdown:</strong> {safeFixed(maxDrawdown)}%</div>
                    </div>
                )}

                {/* Tabla */}
                <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg shadow-inner">
                    {loading ? (
                        <TableSkeleton />
                    ) : operations.length === 0 ? (
                        <p className="text-center text-gray-500">No hay operaciones aún.</p>
                    ) : (
                        <table className="min-w-full text-sm table-auto border border-gray-300 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Resultado</th>
                                    <th className="px-4 py-2">Capital Inicial</th>
                                    <th className="px-4 py-2">Monto R/B</th>
                                    <th className="px-4 py-2">Capital Final</th>
                                    <th className="px-4 py-2">% Riesgo</th>
                                    <th className="px-4 py-2 text-center" style={{ minWidth: 140 }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {operations.map((op) => (
                                    <tr key={op.id} className={op.result === 'Ganada' ? 'bg-green-50' : 'bg-red-50'}>
                                        <td className="px-4 py-2 text-center">{op.id}</td>
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
                                                        name="kellyUsed"
                                                        type="number"
                                                        value={editForm?.kellyUsed || 0}
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
                                                <td className="px-4 py-2 text-center">{op.result}</td>
                                                <td className="px-4 py-2 text-center">${safeFixed(op.initialCapital)}</td>
                                                <td className="px-4 py-2 text-center">${safeFixed(op.montoRb)}</td>
                                                <td className="px-4 py-2 text-center font-semibold">${safeFixed(op.finalCapital)}</td>
                                                <td className="px-4 py-2 text-center">{safeFixed(op.kellyUsed)}%</td>
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

export default Home;
