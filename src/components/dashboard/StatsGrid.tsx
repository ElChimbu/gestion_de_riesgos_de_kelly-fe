import React from 'react';

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

interface StatsGridProps {
  stats: DashboardStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
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
  );
};

export default StatsGrid;