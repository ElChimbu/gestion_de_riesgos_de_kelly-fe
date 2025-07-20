import React, { useState, useEffect, useCallback } from 'react';
import "../tailwind.css";
import { FixedOperation } from "../types/types";
import { fixedOperationsService } from '../services/fixed-operations.service';
import { buildApiUrl, API_CONFIG } from '../config/api';

interface FixedOperationForm extends Omit<FixedOperation, 'id'> {}

const FixedOperations: React.FC = () => {
    const [initialCapital, setInitialCapital] = useState<number>(2000);
    const [fixedRiskPercentage] = useState<number>(2); // Siempre 2%
    const [rbRatio, setRbRatio] = useState<number>(1.5);
    
    const [operations, setOperations] = useState<FixedOperation[]>([]);
    const [currentCapital, setCurrentCapital] = useState<number>(initialCapital);
    
    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<FixedOperationForm | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    // Cargar operaciones
    useEffect(() => {
        setLoading(true);
        fixedOperationsService.getAll()
        .then((ops) => {
            setOperations(ops);
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
            
            setOperations((prevOps) => [...prevOps, newOp]);
            setCurrentCapital(finalCapital);
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



                {/* Capital actual y margen a arriesgar */}
                <div className="mb-6">
                    <div className="bg-neutral-900 border border-white rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
                            <div className="text-white font-semibold text-lg flex-1">
                                <span>🏦 Capital Inicial:</span>
                                <span className="ml-2 text-white font-bold">${safeFixed(displayedInitialCapital)}</span>
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
                <div className="bg-neutral-900 p-4 rounded-lg shadow-inner w-full overflow-x-auto md:overflow-x-visible">
                    {operations.length === 0 ? (
                        <p className="text-center text-white">No hay operaciones aún.</p>
                    ) : (
                        <table className="min-w-max text-sm table-auto border border-neutral-700 rounded-lg">
                            <thead className="bg-neutral-800">
                                <tr>
                                    <th className="px-4 py-2 text-gray-200">#</th>
                                    <th className="px-4 py-2 text-white">Resultado</th>
                                    <th className="px-4 py-2 text-white">Capital Inicial</th>
                                    <th className="px-4 py-2 text-white">PNL (%)</th>
                                    <th className="px-4 py-2 text-white">Capital Final</th>
                                    <th className="px-4 py-2 text-white">% Riesgo</th>
                                    <th className="px-4 py-2 text-white">Apertura</th>
                                    <th className="px-4 py-2 text-white">Cierre</th>
                                    <th className="px-4 py-2 text-white">Observaciones</th>
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
                                                    {/* PNL (%) solo lectura */}
                                                    {Number(editForm?.initialCapital || 0) !== 0
                                                        ? `${Number(editForm?.montoRb || 0) >= 0 ? '+' : ''}${safeFixed((Number(editForm?.montoRb || 0) / Number(editForm?.initialCapital || 1)) * 100)}%`
                                                        : '0.00%'}
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
                                                <td className="px-4 py-2 text-center">
                                                    <input
                                                        name="fechaHoraApertura"
                                                        type="datetime-local"
                                                        value={editForm?.fechaHoraApertura || ''}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-36"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <input
                                                        name="fechaHoraCierre"
                                                        type="datetime-local"
                                                        value={editForm?.fechaHoraCierre || ''}
                                                        onChange={handleEditChange}
                                                        className="border rounded p-1 w-36"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex items-center gap-2">
                                                        <textarea
                                                            name="observaciones"
                                                            value={editForm?.observaciones || ''}
                                                            onChange={handleEditChange}
                                                            className="border rounded p-1 w-36"
                                                            rows={1}
                                                        />
                                                        <label className="cursor-pointer">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 hover:text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                                                            </svg>
                                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                                        </label>
                                                    </div>
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
                                                <td className="px-4 py-2 text-center text-white">{op.fechaHoraApertura ? new Date(op.fechaHoraApertura).toLocaleString() : '-'}</td>
                                                <td className="px-4 py-2 text-center text-white">{op.fechaHoraCierre ? new Date(op.fechaHoraCierre).toLocaleString() : '-'}</td>
                                                <td className="px-4 py-2 text-center text-white relative">
  {op.observaciones && op.observaciones.trim() !== "" ? (
    <span
      className="flex items-center justify-center cursor-pointer"
      onClick={() => setObservationModalOp(op)}
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${op.result === 'Ganada' ? 'bg-green-500' : 'bg-red-500'} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-6 w-6 border-2 border-white ${op.result === 'Ganada' ? 'bg-green-600' : 'bg-red-600'}`}></span>
      </span>
    </span>
  ) : (
    "-"
  )}
</td>
                                                <td className="px-4 py-2 text-center" style={{ minWidth: 140 }}>
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => handleEdit(op)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                                                        <button onClick={() => confirmDelete(op.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
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
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
                    <div className="p-6 rounded-lg shadow-lg w-full max-w-xs text-center">
                        <h2 className="text-lg font-bold text-white mb-4">¿Eliminar operación?</h2>
                        <p className="text-white mb-6">Esta acción no se puede deshacer.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={doDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Eliminar</button>
                            <button onClick={cancelDelete} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            {observationModalOp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
                    <div className="bg-neutral-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center flex flex-col items-center">
                        <h2 className="text-lg font-bold text-white mb-4">Observación</h2>
                        <p className="text-white mb-4 whitespace-pre-line w-full text-left">{observationModalOp.observaciones}</p>
                        {observationModalOp.imagenUrl && observationModalOp.imagenUrl.trim() !== '' && (
                            <img src={observationModalOp.imagenUrl} alt="Imagen de observación" className="max-w-full max-h-64 rounded mb-4" />
                        )}
                        <button onClick={handleObservationModalClose} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mt-2">Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FixedOperations; 