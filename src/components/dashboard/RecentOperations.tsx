import React from 'react';

interface Operation {
  id: number;
  type: string;
  result: string;
  amount: number;
  date: string;
}

interface RecentOperationsProps {
  operations: Operation[];
  loading?: boolean;
}

const RecentOperations: React.FC<RecentOperationsProps> = ({ operations, loading = false }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Operaciones Recientes
      </h2>
      {loading ? (
        <div className="space-y-3">
          {[0,1,2].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 w-1/2">
                <div className="skeleton-text sm animate-breathe w-16 rounded-full px-2 py-1"></div>
                <div className="skeleton-text animate-breathe w-24"></div>
              </div>
              <div className="text-right w-1/3 space-y-2">
                <div className="skeleton-text animate-breathe w-20 ml-auto"></div>
                <div className="skeleton-text sm animate-breathe w-16 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      ) : operations.length > 0 ? (
        <div className="space-y-3">
          {operations.map((operation) => (
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
  );
};

export default RecentOperations;