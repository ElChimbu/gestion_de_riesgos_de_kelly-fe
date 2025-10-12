import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FixedOperation } from "../types/types";
import { fixedOperationsService, FixedOperationStats } from '../services/fixed-operations.service';
import { createOperation as createGlobalOperation } from '../services/operations';
import { buildApiUrl, API_CONFIG } from '../config/api';

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
    const hasLoadedRef = useRef(false);

    // Estado para el modal de confirmación de eliminación
    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Estado para el modal de observación
    const [observationModalOp, setObservationModalOp] = useState<FixedOperation | null>(null);

    // Helper seguro para toFixed
    const safeFixed = (value: number | undefined | null, digits = 2) => {
        if (typeof value !== 'number' || isNaN(value)) return '0.00';
        return value.toFixed(digits);
    };

    // Compute statistics from local operations array to ensure consistency with the table
    const computeStatsFromOps = (ops: FixedOperation[], initialCap: number) => {
    const wins = ops.filter(o => String(o.result).toLowerCase() === 'ganada' || String(o.result).toLowerCase() === 'win').length;
    const losses = ops.filter(o => String(o.result).toLowerCase() === 'perdida' || String(o.result).toLowerCase() === 'loss').length;
        const total = ops.length;
        const winrate = total ? parseFloat(((wins / total) * 100).toFixed(2)) : 0;

        return {
            winrate,
            wins,
            losses,
            totalOperations: total,
            // additional fields for compatibility
            totalProfit: ops.reduce((s, o) => s + (Number((o as any).montoRb) || 0), 0),
            currentCapital: ops.length > 0 ? ops[ops.length - 1].finalCapital : initialCap,
            initialCapital: ops.length > 0 ? ops[0].initialCapital : initialCap,
        } as FixedOperationStats & { totalOperations: number; totalProfit: number; currentCapital: number };
    };

    // Cargar operaciones y estadísticas
    useEffect(() => {
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;

        setLoading(true);
        fixedOperationsService.getAll()
        .then((ops) => {
            setOperations(ops);
            const computed = computeStatsFromOps(ops, initialCapital);
            setStats(computed as any);
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
            const nowIso = new Date().toISOString();
            const newOp = await fixedOperationsService.create({
                result: isWin ? 'Ganada' : 'Perdida',
                initialCapital: lastCapital,
                montoRb,
                finalCapital,
                riskPercentage: fixedRiskPercentage,
                fechaHoraApertura: nowIso
            });
            // also replicate to global operations endpoint so Dashboard (which reads /api/operations) sees it
            (async () => {
                try {
                    await createGlobalOperation({
                        type: 'fixed',
                        result: (newOp.result || '').toString().toLowerCase() === 'ganada' ? 'win' : 'loss',
                        amount: Number(newOp.montoRb || 0),
                        date: newOp.fechaHoraApertura || nowIso,
                        kellyPercent: undefined,
                    });
                } catch (err) {
                    // non-blocking: log for debugging
                    // eslint-disable-next-line no-console
                    console.warn('Replica to /api/operations failed:', err);
                }
            })();
            
            setOperations((prevOps) => {
                const newOps = [...prevOps, newOp];
                setCurrentCapital(finalCapital);
                const computed = computeStatsFromOps(newOps, initialCapital);
                setStats(computed as any);
                return newOps;
            });
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
            setOperations((ops) => {
                const newOps = ops.filter((op) => op.id !== id);
                const computed = computeStatsFromOps(newOps, initialCapital);
                setStats(computed as any);
                setCurrentCapital(newOps.length > 0 ? newOps[newOps.length - 1].finalCapital : initialCapital);
                return newOps;
            });
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
            fechaHoraApertura: op.fechaHoraApertura || '',
            fechaHoraCierre: op.fechaHoraCierre || '',
            observaciones: op.observaciones || '',
            imagenUrl: op.imagenUrl || '',
        });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!editForm) return;
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: value,
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

            // Recompute stats from local ops
            setOperations((ops) => {
                const newOps = ops.map((op) => (op.id === id ? { ...updated } : op));
                const computed = computeStatsFromOps(newOps, initialCapital);
                setStats(computed as any);
                setCurrentCapital(newOps.length > 0 ? newOps[newOps.length - 1].finalCapital : initialCapital);
                return newOps;
            });
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
            const computed = computeStatsFromOps([], initialCapital);
            setStats(computed as any);
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

    // Capital inicial real para mostrar en el banner
    const displayedInitialCapital = operations.length > 0 ? operations[0].initialCapital : initialCapital;

    // Nueva función para abrir el modal
    const confirmDelete = (id: number) => {
        setDeleteModalId(id);
        setShowDeleteModal(true);
    };
    // Nueva función para cancelar
    const cancelDelete = () => {
        setDeleteModalId(null);
        setShowDeleteModal(false);
    };
    // Nueva función para confirmar
    const doDelete = async () => {
        if (deleteModalId !== null) {
            await handleDelete(deleteModalId);
            setDeleteModalId(null);
            setShowDeleteModal(false);
        }
    };

    // Handler para el modal de observación
    const handleObservationModalClose = () => {
        setObservationModalOp(null);
    };

    // Handler para la carga de imagen en modo edición
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editForm) return;
        const file = e.target.files && e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD), {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    setEditForm({ ...editForm, imagenUrl: data.url });
                } else {
                    alert('Error al subir la imagen');
                }
            } catch (err) {
                alert('Error al subir la imagen');
            }
        }
    };

    return (
        <div className="min-h-screen bg-primary p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-primary mb-2">
                                📊 Registro de Operaciones - Riesgo Fijo (2%)
                            </h1>
                            <p className="text-secondary">
                                Registra operaciones con riesgo fijo del 2%
                            </p>
                        </div>
                        <div className="h-12 w-12 gradient-secondary rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="space-y-6">
                        {/* Skeleton Estadísticas */}
                        <div className="card">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[0,1,2,3].map(i => (
                                    <div key={i} className="text-center p-4 bg-card-hover rounded-lg">
                                        <div className="skeleton-text lg animate-breathe w-24 mx-auto mb-2"></div>
                                        <div className="skeleton-text animate-breathe w-20 mx-auto mb-2"></div>
                                        <div className="skeleton-text sm animate-breathe w-16 mx-auto"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skeleton Información de Capital */}
                        <div className="card">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[0,1,2].map(i => (
                                    <div key={i} className="p-4 bg-card-hover rounded-lg">
                                        <div className="skeleton-text sm animate-breathe w-28 mb-2"></div>
                                        <div className="skeleton-text lg animate-breathe w-36"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skeleton Tabla */}
                        <div className="card">
                            <div className="skeleton-text lg animate-breathe w-56 mb-4"></div>
                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-10 skeleton animate-breathe"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {error && <div className="text-center text-error">{error}</div>}

                {/* Configuración */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                        Configuración
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Capital Inicial ($)
                            </label>
                            <input
                                type="number"
                                className="w-full"
                                value={initialCapital}
                                onChange={(e) => setInitialCapital(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                % Riesgo Fijo
                            </label>
                            <div className="bg-card-hover p-4 rounded-lg text-center">
                                <div className="text-lg font-bold text-primary">
                                    {fixedRiskPercentage}%
                                </div>
                                <div className="text-sm text-secondary">(Fijo)</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Ratio R/B
                            </label>
                            <input
                                type="number"
                                className="w-full"
                                value={rbRatio}
                                onChange={(e) => setRbRatio(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                {/* Progreso hacia 100 operaciones */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-primary">
                            Progreso hacia 100 operaciones
                        </h2>
                        <span className="text-secondary">{progressTo100}/100</span>
                    </div>
                    <div className="w-full bg-card-hover rounded-full h-4">
                        <div
                            className="bg-warning h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Estadísticas */}
                {stats && (
                    <div className="card">
                        <h2 className="text-xl font-semibold text-primary mb-4">
                            Estadísticas
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-card-hover rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {safeFixed(Number(stats.winrate))}%
                                </div>
                                <div className="text-sm text-secondary">Winrate Real</div>
                            </div>
                            <div className="text-center p-4 bg-card-hover rounded-lg">
                                <div className="text-2xl font-bold text-success">
                                    {stats.wins}
                                </div>
                                <div className="text-sm text-secondary">Operaciones Ganadas</div>
                            </div>
                            <div className="text-center p-4 bg-card-hover rounded-lg">
                                <div className="text-2xl font-bold text-error">
                                    {stats.losses}
                                </div>
                                <div className="text-sm text-secondary">Operaciones Perdidas</div>
                            </div>
                            <div className="text-center p-4 bg-card-hover rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {operations.length}
                                </div>
                                <div className="text-sm text-secondary">Total Operaciones</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Capital actual y margen a arriesgar */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                        Información de Capital
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-card-hover rounded-lg">
                            <div className="text-sm text-secondary mb-2">🏦 Capital Inicial</div>
                            <div className="text-lg font-bold text-primary">
                                ${safeFixed(displayedInitialCapital)}
                            </div>
                        </div>
                        <div className="p-4 bg-card-hover rounded-lg">
                            <div className="text-sm text-secondary mb-2">💰 Capital Actual</div>
                            <div className="text-lg font-bold text-primary">
                                ${safeFixed(currentCapital)}
                            </div>
                        </div>
                        <div className="p-4 bg-card-hover rounded-lg">
                            <div className="text-sm text-secondary mb-2">💡 Margen a arriesgar próxima operación</div>
                            <div className="text-lg font-bold text-primary">
                                ${safeFixed(nextRiskAmount)} ({safeFixed(fixedRiskPercentage)}%)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                        Acciones
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => addFixedOperation(true)}
                            className="btn-primary"
                        >
                            Operación Ganada
                        </button>
                        <button
                            onClick={() => addFixedOperation(false)}
                            className="btn-error"
                        >
                            Operación Perdida
                        </button>
                        <button
                            onClick={resetData}
                            className="btn-secondary"
                        >
                            Reiniciar
                        </button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                        Historial de Operaciones
                    </h2>
                    {operations.length === 0 ? (
                        <div className="text-center py-8 text-secondary">
                            No hay operaciones registradas
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left p-3">#</th>
                                        <th className="text-left p-3">Resultado</th>
                                        <th className="text-left p-3">Capital Inicial</th>
                                        <th className="text-left p-3">PNL (%)</th>
                                        <th className="text-left p-3">Capital Final</th>
                                        <th className="text-left p-3">% Riesgo</th>
                                        <th className="text-left p-3">Apertura</th>
                                        <th className="text-left p-3">Cierre</th>
                                        <th className="text-left p-3">Observaciones</th>
                                        <th className="text-left p-3">Acciones</th>
                                    </tr>
                                </thead>
                            <tbody>
                                {operations.map((op) => (
                                    <tr key={op.id} className="border-b border-primary">
                                        <td className="p-3 text-secondary">{op.id}</td>
                                        {editId === op.id ? (
                                            <>
                                                <td className="p-3 text-secondary">
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
                                                <td className="p-3 text-secondary">
                                                    <input
                                                        name="initialCapital"
                                                        type="number"
                                                        value={editForm?.initialCapital || 0}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-24"
                                                    />
                                                </td>
                                                <td className="p-3 text-secondary">
                                                    {/* PNL (%) solo lectura */}
                                                    {Number(editForm?.initialCapital || 0) !== 0
                                                        ? `${Number(editForm?.montoRb || 0) >= 0 ? '+' : ''}${safeFixed((Number(editForm?.montoRb || 0) / Number(editForm?.initialCapital || 1)) * 100)}%`
                                                        : '0.00%'}
                                                </td>
                                                <td className="p-3 text-secondary">
                                                    <input
                                                        name="finalCapital"
                                                        type="number"
                                                        value={editForm?.finalCapital || 0}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-24"
                                                    />
                                                </td>
                                                <td className="p-3 text-secondary">
                                                    <input
                                                        name="riskPercentage"
                                                        type="number"
                                                        value={editForm?.riskPercentage || 0}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-16"
                                                    />
                                                </td>
                                                <td className="p-3 text-secondary">
                                                    <input
                                                        name="fechaHoraApertura"
                                                        type="datetime-local"
                                                        value={editForm?.fechaHoraApertura || ''}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-36"
                                                    />
                                                </td>
                                                <td className="p-3 text-secondary">
                                                    <input
                                                        name="fechaHoraCierre"
                                                        type="datetime-local"
                                                        value={editForm?.fechaHoraCierre || ''}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-36"
                                                    />
                                                </td>
                                                <td className="p-3 text-secondary">
                                                    <div className="flex items-center gap-2">
                                                        <textarea
                                                            name="observaciones"
                                                            value={editForm?.observaciones || ''}
                                                            onChange={handleEditChange}
                                                            className="border rounded p-1 w-36"
                                                            rows={1}
                                                        />
                                                        <label className="cursor-pointer">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info hover:text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                                                            </svg>
                                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-secondary">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => handleEditSave(op.id)} className="btn-primary">Guardar</button>
                                                        <button onClick={handleEditCancel} className="btn-secondary">Cancelar</button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-3 text-secondary">{op.result}</td>
                                                <td className="p-3 text-secondary">${safeFixed(op.initialCapital)}</td>
                                                <td className={`p-3 font-semibold ${op.montoRb >= 0 ? 'text-success' : 'text-error'}`}>{op.initialCapital !== 0 ? `${op.montoRb >= 0 ? '+' : ''}${safeFixed((op.montoRb / op.initialCapital) * 100)}%` : '0.00%'}</td>
                                                <td className="p-3 text-secondary">${safeFixed(op.finalCapital)}</td>
                                                <td className="p-3 text-secondary">{safeFixed(op.riskPercentage)}%</td>
                                                <td className="p-3 text-secondary">{op.fechaHoraApertura ? new Date(op.fechaHoraApertura).toLocaleString() : '-'}</td>
                                                <td className="p-3 text-secondary">{op.fechaHoraCierre ? new Date(op.fechaHoraCierre).toLocaleString() : '-'}</td>
                                                <td className="p-3 text-secondary relative">
  {op.observaciones && op.observaciones.trim() !== "" ? (
    <span
      className="flex items-center justify-center cursor-pointer"
      onClick={() => setObservationModalOp(op)}
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${op.result === 'Ganada' ? 'bg-success' : 'bg-error'} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-6 w-6 border-2 border-primary ${op.result === 'Ganada' ? 'bg-success' : 'bg-error'}`}></span>
      </span>
    </span>
  ) : (
    "-"
  )}
</td>
                                                <td className="p-3 text-secondary">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => handleEdit(op)} className="btn-warning">Editar</button>
                                                        <button onClick={() => confirmDelete(op.id)} className="btn-error">Eliminar</button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    )}
                </div>
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
                    <div className="card w-full max-w-xs text-center">
                        <h2 className="text-lg font-bold text-primary mb-4">¿Eliminar operación?</h2>
                        <p className="text-secondary mb-6">Esta acción no se puede deshacer.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={doDelete} className="btn-error">Eliminar</button>
                            <button onClick={cancelDelete} className="btn-secondary">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            {observationModalOp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
                    <div className="card w-full max-w-md text-center flex flex-col items-center">
                        <h2 className="text-lg font-bold text-primary mb-4">Observación</h2>
                        <p className="text-secondary mb-4 whitespace-pre-line w-full text-left">{observationModalOp.observaciones}</p>
                        {observationModalOp.imagenUrl && observationModalOp.imagenUrl.trim() !== '' && (
                            <img src={observationModalOp.imagenUrl} alt="Imagen de observación" className="max-w-full max-h-64 rounded mb-4" />
                        )}
                        <button onClick={handleObservationModalClose} className="btn-secondary mt-2">Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FixedOperations; 