import { Trash2 } from "lucide-react";
import Button from "../common/Button";
import { formatDate, getExpiryStatus } from "../../utils/dateFormatter";

const statusClass = {
  Fresh: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Near Expiry": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Expired: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export default function FoodTable({ items, onDelete }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/70 text-xs uppercase tracking-wider text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const status = getExpiryStatus(item.expiryDate);
              return (
                <tr key={item._id || item.id} className="border-t border-white/20 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">{formatDate(item.expiryDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass[status]}`}>{status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => onDelete(item._id || item.id)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}