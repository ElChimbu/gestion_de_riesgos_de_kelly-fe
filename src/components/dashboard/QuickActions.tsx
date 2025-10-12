import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
  return (
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
  );
};

export default QuickActions;