import React from 'react';

interface DashboardStats {
  totalOperations: number;
  totalProfit: number;
  initialCapital: number;
  currentCapital: number;
}

interface ProgressChartsProps {
  stats: DashboardStats;
  loading?: boolean;
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({ stats, loading = false }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
        {loading ? (
          <>
            <div className="skeleton-text lg animate-breathe w-48 mb-4"></div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="skeleton-text sm animate-breathe w-32"></div>
                  <div className="skeleton-text sm animate-breathe w-16"></div>
                </div>
                <div className="skeleton-bar">
                  <div className="fill animate-breathe" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="skeleton-text sm animate-breathe w-40"></div>
                  <div className="skeleton-text sm animate-breathe w-24"></div>
                </div>
                <div className="skeleton-bar">
                  <div className="fill animate-breathe" style={{ width: '55%' }}></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
        {loading ? (
          <>
            <div className="skeleton-text lg animate-breathe w-56 mb-4"></div>
            <div className="text-center py-8 space-y-3">
              <div className="skeleton-text lg animate-breathe w-24 mx-auto"></div>
              <div className="skeleton-text sm animate-breathe w-40 mx-auto"></div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressCharts;