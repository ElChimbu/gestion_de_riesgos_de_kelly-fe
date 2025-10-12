import React from 'react';
import { DollarQuote } from '../../services/dollar';

interface DollarTickerProps {
  dollarQuotes: DollarQuote[];
}

const DollarTicker: React.FC<DollarTickerProps> = ({ dollarQuotes }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 shadow-lg overflow-hidden">
      <div className="marquee whitespace-nowrap flex items-center" style={{ gap: 24 }}>
        {[...dollarQuotes, ...dollarQuotes].map((quote, idx) => (
          <div key={`${quote.casa}-${idx}`} className="inline-flex items-center space-x-3 px-4 py-2 bg-gray-800 rounded">
            <div className="text-sm text-gray-200 font-medium">{quote.nombre}</div>
            <div className="text-sm text-white font-semibold">Compra: ${quote.compra}</div>
            <div className="text-sm text-white font-semibold">Venta: ${quote.venta}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DollarTicker;