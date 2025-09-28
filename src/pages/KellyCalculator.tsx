import React, { useState } from 'react';

interface KellyOperation {
  id: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  kellyPercentage: number;
  recommendedRisk: number;
  date: string;
}

const KellyCalculator: React.FC = () => {
  const [operations, setOperations] = useState<KellyOperation[]>([]);
  const [currentOperation, setCurrentOperation] = useState({
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
  });

  const calculateKelly = (winRate: number, avgWin: number, avgLoss: number) => {
    if (avgLoss === 0) return 0;
    
    const winRatio = avgWin / avgLoss;
    const kellyPercentage = (winRate * winRatio - (1 - winRate)) / winRatio;
    
    return Math.max(0, Math.min(kellyPercentage * 100, 100));
  };

  const handleAddOperation = () => {
    const kellyPercentage = calculateKelly(
      currentOperation.winRate,
      currentOperation.avgWin,
      currentOperation.avgLoss
    );

    const newOperation: KellyOperation = {
      id: Date.now(),
      winRate: currentOperation.winRate,
      avgWin: currentOperation.avgWin,
      avgLoss: currentOperation.avgLoss,
      kellyPercentage,
      recommendedRisk: kellyPercentage,
      date: new Date().toLocaleDateString(),
    };

    setOperations([...operations, newOperation]);
    setCurrentOperation({ winRate: 0, avgWin: 0, avgLoss: 0 });
  };

  const handleReset = () => {
    setOperations([]);
  };

  const getAverageKelly = () => {
    if (operations.length === 0) return 0;
    const total = operations.reduce((sum, op) => sum + op.kellyPercentage, 0);
    return total / operations.length;
  };

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2">
                Calculador de Kelly
              </h1>
              <p className="text-secondary">
                Calcula el porcentaje óptimo de riesgo según el criterio de Kelly
              </p>
            </div>
            <div className="h-12 w-12 gradient-secondary rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario de entrada */}
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Nueva Operación
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Tasa de Ganancia (%)
                </label>
                <input
                  type="number"
                  value={currentOperation.winRate}
                  onChange={(e) => setCurrentOperation({
                    ...currentOperation,
                    winRate: parseFloat(e.target.value) || 0
                  })}
                  className="w-full"
                  placeholder="Ej: 60"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Ganancia Promedio ($)
                </label>
                <input
                  type="number"
                  value={currentOperation.avgWin}
                  onChange={(e) => setCurrentOperation({
                    ...currentOperation,
                    avgWin: parseFloat(e.target.value) || 0
                  })}
                  className="w-full"
                  placeholder="Ej: 100"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Pérdida Promedio ($)
                </label>
                <input
                  type="number"
                  value={currentOperation.avgLoss}
                  onChange={(e) => setCurrentOperation({
                    ...currentOperation,
                    avgLoss: parseFloat(e.target.value) || 0
                  })}
                  className="w-full"
                  placeholder="Ej: 50"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddOperation}
                  disabled={!currentOperation.winRate || !currentOperation.avgWin || !currentOperation.avgLoss}
                  className="btn-primary flex-1"
                >
                  Calcular Kelly
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </div>

          {/* Resultado actual */}
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Resultado Actual
            </h2>
            
            {currentOperation.winRate && currentOperation.avgWin && currentOperation.avgLoss ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-card-hover rounded-lg">
                    <div className="text-2xl font-bold text-tertiary">
                      {calculateKelly(currentOperation.winRate, currentOperation.avgWin, currentOperation.avgLoss).toFixed(2)}%
                    </div>
                    <div className="text-sm text-secondary">Kelly Recomendado</div>
                  </div>
                  <div className="text-center p-4 bg-card-hover rounded-lg">
                    <div className="text-2xl font-bold text-info">
                      {(currentOperation.winRate * currentOperation.avgWin - (1 - currentOperation.winRate) * currentOperation.avgLoss).toFixed(2)}
                    </div>
                    <div className="text-sm text-secondary">Expectativa</div>
                  </div>
                </div>
                
                <div className="p-4 bg-card-hover rounded-lg">
                  <div className="text-sm text-secondary mb-2">Ratio Ganancia/Pérdida</div>
                  <div className="text-lg font-semibold text-primary">
                    {(currentOperation.avgWin / currentOperation.avgLoss).toFixed(2)}:1
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-secondary">
                Ingresa los datos para ver el cálculo
              </div>
            )}
          </div>
        </div>

        {/* Historial de operaciones */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary">
              Historial de Operaciones
            </h2>
            {operations.length > 0 && (
              <div className="text-sm text-secondary">
                Promedio Kelly: <span className="font-semibold text-tertiary">{getAverageKelly().toFixed(2)}%</span>
              </div>
            )}
          </div>

          {operations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-3">Fecha</th>
                    <th className="text-left p-3">Tasa Ganancia</th>
                    <th className="text-left p-3">Ganancia Prom.</th>
                    <th className="text-left p-3">Pérdida Prom.</th>
                    <th className="text-left p-3">Kelly %</th>
                    <th className="text-left p-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.map((operation) => (
                    <tr key={operation.id} className="border-b border-primary">
                      <td className="p-3 text-secondary">{operation.date}</td>
                      <td className="p-3 text-secondary">{operation.winRate}%</td>
                      <td className="p-3 text-secondary">${operation.avgWin}</td>
                      <td className="p-3 text-secondary">${operation.avgLoss}</td>
                      <td className="p-3">
                        <span className={`font-semibold ${
                          operation.kellyPercentage > 20 ? 'text-success' :
                          operation.kellyPercentage > 10 ? 'text-warning' : 'text-error'
                        }`}>
                          {operation.kellyPercentage.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`badge ${
                          operation.kellyPercentage > 20 ? 'badge-success' :
                          operation.kellyPercentage > 10 ? 'badge-warning' : 'badge-error'
                        }`}>
                          {operation.kellyPercentage > 20 ? 'Óptimo' :
                           operation.kellyPercentage > 10 ? 'Moderado' : 'Alto Riesgo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-secondary">
              No hay operaciones registradas
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KellyCalculator; 