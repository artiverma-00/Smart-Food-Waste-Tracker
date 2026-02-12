export default function Input({
  label,
  error,
  className = "",
  icon: Icon,
  ...props
}) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <input
          className={`w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-glass outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 ${Icon ? "pl-10" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </label>
  );
}