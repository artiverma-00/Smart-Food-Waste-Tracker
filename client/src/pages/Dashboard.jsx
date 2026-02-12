import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Table2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import * as foodService from "../services/food.service";
import FoodCard from "../components/food/FoodCard";
import FoodTable from "../components/food/FoodTable";
import Button from "../components/common/Button";
import { Loader, Skeleton } from "../components/common/Loader";

function EmptyIllustration() {
  return (
    <svg viewBox="0 0 240 160" className="h-36 w-52 text-brand-500/70" fill="none">
      <rect x="20" y="28" width="200" height="108" rx="16" className="fill-current opacity-10" />
      <path d="M58 108h124" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <circle cx="92" cy="76" r="14" className="fill-current opacity-35" />
      <circle cx="130" cy="68" r="11" className="fill-current opacity-45" />
      <circle cx="160" cy="86" r="9" className="fill-current opacity-55" />
    </svg>
  );
}

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("table");

  const stats = useMemo(() => {
    const expired = items.filter((item) => new Date(item.expiryDate) < new Date()).length;
    const nearExpiry = items.filter((item) => {
      const diff = (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 2;
    }).length;
    return {
      total: items.length,
      expired,
      nearExpiry,
    };
  }, [items]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await foodService.getFoods();
        setItems(Array.isArray(data) ? data : data.items || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await foodService.deleteFood(id);
    setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-24" />)
          : [
              { label: "Total Items", value: stats.total },
              { label: "Near Expiry", value: stats.nearExpiry },
              { label: "Expired", value: stats.expired },
              { label: "Waste Saved", value: `${Math.max(0, stats.total - stats.expired)} items` },
            ].map((card) => (
              <motion.div key={card.label} whileHover={{ y: -2 }} className="glass-card">
                <p className="text-sm text-slate-500 dark:text-slate-300">{card.label}</p>
                <p className="mt-2 text-2xl font-bold text-brand-700 dark:text-brand-300">{card.value}</p>
              </motion.div>
            ))}
      </div>

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold">Inventory Overview</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={view === "table" ? "primary" : "secondary"} size="sm" onClick={() => setView("table")}>
            <Table2 className="mr-2 h-4 w-4" /> Table
          </Button>
          <Button variant={view === "card" ? "primary" : "secondary"} size="sm" onClick={() => setView("card")}>
            <LayoutGrid className="mr-2 h-4 w-4" /> Cards
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="glass-card flex min-h-72 flex-col items-center justify-center gap-3 text-center">
          <EmptyIllustration />
          <Sparkles className="h-9 w-9 text-brand-500" />
          <h3 className="text-lg font-semibold">No food items yet</h3>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-300">
            Start by adding your first food item. The dashboard and analytics will automatically update.
          </p>
        </div>
      ) : view === "table" ? (
        <FoodTable items={items} onDelete={handleDelete} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => <FoodCard key={item._id || item.id} item={item} />)}
        </div>
      )}
    </section>
  );
}
