import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalOperations: number;
  winRate: number;
  totalProfit: number;
  currentCapital: number;
  initialCapital: number;
  kellyAverage: number;
  fixedRiskOperations: number;
  kellyOperations: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOperations: 0,
    winRate: 0,
    totalProfit: 0,
    currentCapital: 2000,
    initialCapital: 2000,
    kellyAverage: 0,
    fixedRiskOperations: 0,
    kellyOperations: 0,
  });

  const [recentOperations, setRecentOperations] = useState<any[]>([]);

  // Simular datos para el dashboard
  useEffect(() => {
    // Aquí se cargarían los datos reales desde la API
    setStats({
      totalOperations: 15,
      winRate: 73.3,
      totalProfit: 450.50,
      currentCapital: 2450.50,
      initialCapital: 2000,
      kellyAverage: 18.5,
      fixedRiskOperations: 12,
      kellyOperations: 3,
    });

    setRecentOperations([
      { id: 1, type: 'fixed', result: 'win', amount: 40, date: '2024-01-15' },
      { id: 2, type: 'kelly', result: 'loss', amount: -25, date: '2024-01-14' },
      { id: 3, type: 'fixed', result: 'win', amount: 40, date: '2024-01-13' },
    ]);
  }, []);

  // Removed unused functions

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl hidden font-bold text-white mb-2">
                Dashboard de Gestión de Riesgos
              </h1>
              <p className="text-gray-300">
                Resumen general de tus operaciones y rendimiento
              </p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Capital Actual</p>
                <p className="text-2xl font-bold text-white">${stats.currentCapital.toFixed(2)}</p>
                <p className={`text-sm ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  +${stats.totalProfit.toFixed(2)} ({((stats.totalProfit / stats.initialCapital) * 100).toFixed(1)}%)
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Tasa de Ganancia</p>
                <p className="text-2xl font-bold text-green-400">{stats.winRate}%</p>
                <p className="text-sm text-gray-300">{stats.totalOperations} operaciones</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Kelly Promedio</p>
                <p className="text-2xl font-bold text-blue-400">{stats.kellyAverage}%</p>
                <p className="text-sm text-gray-300">{stats.kellyOperations} cálculos</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Riesgo Fijo</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.fixedRiskOperations}</p>
                <p className="text-sm text-gray-300">operaciones</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/fixed-operations"
                className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-yellow-400 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                      Riesgo Fijo
                    </p>
                    <p className="text-sm text-gray-300">2% fijo por operación</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/kelly-calculator"
                className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-purple-400 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      Cálculo Kelly
                    </p>
                    <p className="text-sm text-gray-300">Porcentaje óptimo de riesgo</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Operaciones Recientes
            </h2>
            {recentOperations.length > 0 ? (
              <div className="space-y-3">
                {recentOperations.map((operation) => (
                  <div key={operation.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${operation.result === 'win' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {operation.result === 'win' ? 'Ganada' : 'Perdida'}
                      </span>
                      <span className="text-sm text-gray-300">
                        {operation.type === 'fixed' ? 'Riesgo Fijo' : 'Kelly'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${operation.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${operation.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-300">{operation.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-300">
                No hay operaciones recientes
              </div>
            )}
          </div>
        </div>

        {/* Gráficos y análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Progreso de Objetivos
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">100 Operaciones</span>
                  <span className="text-white">{stats.totalOperations}/100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(stats.totalOperations / 100) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Capital Objetivo: $5000</span>
                  <span className="text-white">${stats.currentCapital.toFixed(0)}/$5000</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(stats.currentCapital / 5000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              Rendimiento Mensual
            </h2>
            <div className="text-center py-8">
              <div className="text-3xl font-bold text-green-400 mb-2">
                +{((stats.totalProfit / stats.initialCapital) * 100).toFixed(1)}%
              </div>
              <div className="text-gray-300">
                Rendimiento este mes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 