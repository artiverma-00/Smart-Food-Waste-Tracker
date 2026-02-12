import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import CategoryChart from "../components/analytics/CategoryChart";
import WasteChart from "../components/analytics/WasteChart";
import { Loader } from "../components/common/Loader";
import * as analyticsService from "../services/analytics.service";

const fallbackBar = [
  { name: "Mon", waste: 3 },
  { name: "Tue", waste: 2 },
  { name: "Wed", waste: 4 },
  { name: "Thu", waste: 1 },
  { name: "Fri", waste: 5 },
  { name: "Sat", waste: 2 },
  { name: "Sun", waste: 1 },
];

const fallbackPie = [
  { name: "Vegetables", value: 36 },
  { name: "Dairy", value: 21 },
  { name: "Fruits", value: 25 },
  { name: "Grains", value: 18 },
];

function EmptyChartIllustration() {
  return (
    <svg viewBox="0 0 240 160" className="mb-2 h-36 w-52 text-brand-500/70" fill="none">
      <rect x="24" y="24" width="192" height="112" rx="14" className="fill-current opacity-10" />
      <path d="M56 110V78M98 110V62M140 110V88M182 110V52" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overview, categories] = await Promise.all([
          analyticsService.getWasteOverview(),
          analyticsService.getCategoryBreakdown(),
        ]);
        setBarData(Array.isArray(overview) ? overview : overview.data || []);
        setPieData(Array.isArray(categories) ? categories : categories.data || []);
      } catch {
        setBarData(fallbackBar);
        setPieData(fallbackPie);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalWaste = useMemo(() => pieData.reduce((sum, item) => sum + item.value, 0), [pieData]);

  if (loading) return <Loader />;

  if (!barData.length && !pieData.length) {
    return (
      <div className="glass-card flex min-h-72 flex-col items-center justify-center text-center">
        <EmptyChartIllustration />
        <BarChart3 className="mb-2 h-8 w-8 text-brand-500" />
        <h2 className="text-lg font-semibold">No analytics data yet</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-300">Analytics will appear once you start tracking food inventory and expiries.</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="glass-card">
        <p className="text-sm text-slate-500 dark:text-slate-300">Total Tracked Waste</p>
        <h2 className="text-3xl font-bold text-brand-700 dark:text-brand-300">{totalWaste}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        <WasteChart data={barData} />
        <CategoryChart data={pieData} />
      </div>
    </section>
  );
}
