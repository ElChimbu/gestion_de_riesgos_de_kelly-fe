import React from 'react';
import { CoinMarket } from '../../services/crypto';

interface CryptoTickerProps {
  markets: CoinMarket[];
  loading?: boolean;
}

const CryptoTicker: React.FC<CryptoTickerProps> = ({ markets, loading = false }) => {
  const showSkeleton = loading || markets.length === 0;

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-lg overflow-hidden">
      {showSkeleton ? (
        <div className="marquee whitespace-nowrap flex items-center" style={{ gap: 24 }}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="inline-flex items-center space-x-3 px-4 py-2 bg-gray-800 rounded">
              <div className="skeleton-circle animate-breathe"></div>
              <div className="skeleton-text sm animate-breathe w-10"></div>
              <div className="skeleton-text animate-breathe w-16"></div>
              <div className="skeleton-text sm animate-breathe w-12"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="marquee whitespace-nowrap flex items-center" style={{ gap: 24 }}>
          {[...markets, ...markets].map((m, idx) => (
            <div key={`${m.id}-${idx}`} className="inline-flex items-center space-x-3 px-4 py-2 bg-gray-800 rounded">
              <img src={m.image} alt={m.symbol} className="h-6 w-6 rounded-full" />
              <div className="text-sm text-gray-200 font-medium">{m.symbol.toUpperCase()}</div>
              <div className="text-sm text-white font-semibold">${m.current_price.toFixed(2)}</div>
              <div className={`text-sm ${ (m.price_change_percentage_24h||0) >= 0 ? 'text-green-400' : 'text-red-400' }`}>
                {m.price_change_percentage_24h ? `${m.price_change_percentage_24h.toFixed(2)}%` : '0.00%'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoTicker;