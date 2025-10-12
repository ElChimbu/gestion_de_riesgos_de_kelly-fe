import React, { useState, useEffect } from 'react';
import { fetchOperations } from '../services/operations';
import StatsGrid from '../components/dashboard/StatsGrid';
import QuickActions from '../components/dashboard/QuickActions';
import RecentOperations from '../components/dashboard/RecentOperations';
import ProgressCharts from '../components/dashboard/ProgressCharts';

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

  // Cargar datos reales desde la API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
  const data = await fetchOperations();
  const ops: any[] = Array.isArray(data) ? (data as any[]) : (data as any).operations ?? [];
  const metaInitial: number | undefined = !Array.isArray(data) ? (data as any).meta?.initialCapital : undefined;

        const totalOperations = ops.length;
        const wins = ops.filter((o: any) => o.result === 'win').length;
        const winRate = totalOperations ? parseFloat(((wins / totalOperations) * 100).toFixed(1)) : 0;
        const totalProfit = ops.reduce((s: number, o: any) => s + (Number(o.amount) || 0), 0);
        const initial = metaInitial ?? 2000;
        const currentCapital = initial + totalProfit;
        const kellyOps = ops.filter((o: any) => o.type === 'kelly');
        const kellyAverage = kellyOps.length
          ? parseFloat((kellyOps.reduce((s: number, o: any) => s + (o.kellyPercent || 0), 0) / kellyOps.length).toFixed(1))
          : 0;
        const fixedRiskOperations = ops.filter((o: any) => o.type === 'fixed').length;

        if (!mounted) return;
        setStats({
          totalOperations,
          winRate,
          totalProfit: parseFloat(totalProfit.toFixed(2)),
          currentCapital: parseFloat(currentCapital.toFixed(2)),
          initialCapital: initial,
          kellyAverage,
          fixedRiskOperations,
          kellyOperations: kellyOps.length,
        });

        const recent = ops
          .slice()
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
          .map((o: any) => ({
            id: o.id,
            type: o.type,
            result: o.result,
            amount: Number(o.amount),
            date: (o.date || '').split('T')[0] ?? o.date,
          }));
        setRecentOperations(recent);
      } catch (err) {
        console.error('Error cargando operaciones:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Removed unused functions

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActions />
          <RecentOperations operations={recentOperations} />
        </div>
        <ProgressCharts stats={stats} />
      </div>
    </div>
  );
};

export default Dashboard; 