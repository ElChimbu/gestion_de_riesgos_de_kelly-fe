import React from 'react';
import { DollarQuote } from '../../services/dollar';

interface DollarTickerProps {
  dollarQuotes: DollarQuote[];
  loading?: boolean;
}

const DollarTicker: React.FC<DollarTickerProps> = ({ dollarQuotes, loading = false }) => {
  const showSkeleton = loading || dollarQuotes.length === 0;

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-lg overflow-hidden">
      {showSkeleton ? (
        <div className="marquee whitespace-nowrap flex items-center" style={{ gap: 24 }}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="inline-flex items-center space-x-3 px-4 py-2 bg-gray-800 rounded">
              <div className="skeleton-text sm animate-breathe w-24"></div>
              <div className="skeleton-text sm animate-breathe w-28"></div>
              <div className="skeleton-text sm animate-breathe w-28"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="marquee whitespace-nowrap flex items-center" style={{ gap: 24 }}>
          {[...dollarQuotes, ...dollarQuotes].map((quote, idx) => (
            <div key={`${quote.casa}-${idx}`} className="inline-flex items-center space-x-3 px-4 py-2 bg-gray-800 rounded">
              <div className="text-sm text-gray-200 font-medium">{quote.nombre}</div>
              <div className="text-sm text-white font-semibold">Compra: ${quote.compra}</div>
              <div className="text-sm text-white font-semibold">Venta: ${quote.venta}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DollarTicker;