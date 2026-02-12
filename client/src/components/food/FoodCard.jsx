import { Clock3, Leaf } from "lucide-react";
import { formatDate, getExpiryStatus } from "../../utils/dateFormatter";

const statusClass = {
  Fresh: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Near Expiry": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Expired: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export default function FoodCard({ item }) {
  const status = getExpiryStatus(item.expiryDate);

  return (
    <article className="glass-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[status]}`}>{status}</span>
      </div>
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p className="flex items-center gap-2"><Leaf className="h-4 w-4 text-brand-600" /> {item.category}</p>
        <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand-600" /> Expires {formatDate(item.expiryDate)}</p>
      </div>
    </article>
  );
}