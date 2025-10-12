import React, { useState, useEffect } from 'react';
import { fetchTopMarkets, CoinMarket } from '../services/crypto';
import { fetchDollarQuotes, DollarQuote } from '../services/dollar';
import CryptoTicker from './dashboard/CryptoTicker';
import DollarTicker from './dashboard/DollarTicker';

const GlobalTickers: React.FC = () => {
  const [markets, setMarkets] = useState<CoinMarket[]>([]);
  const [dollarQuotes, setDollarQuotes] = useState<DollarQuote[]>([]);

  // crypto marquee: load top markets and update every 60s, cache in sessionStorage
  useEffect(() => {
    let mounted = true;
    const key = 'crypto_top_100_v1';

    const load = async () => {
      try {
        // try cache first
        const cached = sessionStorage.getItem(key);
        if (cached) {
          const parsed = JSON.parse(cached) as { ts: number; data: CoinMarket[] };
          // use cache if < 60s
          if (Date.now() - parsed.ts < 60000) {
            if (mounted) setMarkets(parsed.data);
            return;
          }
        }

        const data = await fetchTopMarkets(100);
        if (!mounted) return;
        setMarkets(data);
        try { sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
      } catch (err) {
        console.error('Error fetching markets', err);
      }
    };

    load();
    const t = setInterval(load, 60000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  // dollar quotes: load and update every 60s, cache in sessionStorage
  useEffect(() => {
    let mounted = true;
    const key = 'dollar_quotes_v1';

    const load = async () => {
      try {
        // try cache first
        const cached = sessionStorage.getItem(key);
        if (cached) {
          const parsed = JSON.parse(cached) as { ts: number; data: DollarQuote[] };
          // use cache if < 60s
          if (Date.now() - parsed.ts < 60000) {
            if (mounted) setDollarQuotes(parsed.data);
            return;
          }
        }

        const data = await fetchDollarQuotes();
        if (!mounted) return;
        setDollarQuotes(data);
        try { sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
      } catch (err) {
        console.error('Error fetching dollar quotes', err);
      }
    };

    load();
    const t = setInterval(load, 60000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  return (
    <div className=''>
      <CryptoTicker markets={markets} />
      <div className='mt-2'>
        <DollarTicker dollarQuotes={dollarQuotes} />
      </div>
    </div>
  );
};

export default GlobalTickers;